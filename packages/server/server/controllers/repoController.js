import Repo from '../models/repo'
import Discussion from '../models/discussion'
import Comment from '../models/comment'
import User from '../models/user'
import Commit from '../models/commit'
import SecuredText from '../models/securedText'
import HTTPError from '../util/HTTPError'
import passportAuthenticateAsync from '../util/passportAuth'
import { filemodeIsDir, fileType } from '../util'
import { defaultOnError } from '../util/Promise'
import spawnCmd from '../util/spawnCmd'
import * as noderpc from '../noderpc'
import { union, keyBy, isArray } from 'lodash'
import path from 'path'
import fs from 'fs'
import passport from 'passport'

const repoController = {}

const rpcClient = noderpc.initClient()

repoController.getUserRepos = async (req, res, next) => {
    const requesterUsername = req.user.username
    const username = req.params.username
    const repoIDs = []
    const local = await rpcClient.getLocalReposAsync({})
    const permissionsByRepo = await Promise.all(local.map(async (repo) => {
        const [ admins, pullers, pushers, isPublicResp ] = await Promise.all([
            defaultOnError(rpcClient.getAllUsersOfTypeAsync(repo.repoID, rpcClient.UserType.ADMIN), []),
            defaultOnError(rpcClient.getAllUsersOfTypeAsync(repo.repoID, rpcClient.UserType.PULLER), []),
            defaultOnError(rpcClient.getAllUsersOfTypeAsync(repo.repoID, rpcClient.UserType.PUSHER), []),
            defaultOnError(rpcClient.isRepoPublicAsync(repo.repoID), false),
        ])
        const users = union(admins, pullers, pushers)
        const isPublic = isPublicResp.isPublic
        return {
            users,
            isPublic,
        }
    }))
    for (let i = 0; i < local.length; i++) {
        const permissions = permissionsByRepo[i]
        const { users, isPublic } = permissions
        if (users.indexOf(username) > -1 &&
            (isPublic || users.indexOf(requesterUsername) > -1)
        ) {
            repoIDs.push(local[i].repoID)
        }
    }
    res.status(200).json({ repoIDs })
}

const checkUserAccess = async (user, repoID) => {
    if (!repoID) {
        throw new HTTPError(400, 'Missing repoID')
    }

    const [ pullers, isPublicResp ] = await Promise.all([
        rpcClient.getAllUsersOfTypeAsync(repoID, rpcClient.UserType.PULLER),
        rpcClient.isRepoPublicAsync({ repoID }),
    ])
    const canView = isPublicResp.isPublic || (user && user.username && pullers.indexOf(user.username) > -1)
    if (!canView) {
        throw new HTTPError(403, `Unauthorized to view repo "${repoID}"`)
    }
}

repoController.getRepoMetadata = async (req, res, next) => {
    let { repoIDs } = req.query
    if (!repoIDs) {
        throw new HTTPError(400, 'Missing repoIDs')
    }
    if (!isArray(repoIDs)) {
        repoIDs = [ repoIDs ]
    }

    const metadataPromiseList = repoIDs.map(async (id) => {
        try {
            await checkUserAccess(req.user, id)
            const repo = await Repo.get(id)
            return repo
        } catch (err) {
            return {
                repoID: id,
                isNull: true,
                error: err,
            }
        }
    })
    const metadata = await Promise.all(metadataPromiseList)

    res.status(200).json({ metadata })
}

repoController.getRepoFiles = async (req, res, next) => {
    const { repoID } = req.params
    await checkUserAccess(req.user, repoID)

    const filesListRaw = (await rpcClient.getRepoFilesAsync({ repoID, commitRef: 'HEAD' })).files || []

    const fileList = filesListRaw
        .filter(file => file && file.name)
        .map(file => ({
            name:            file.name,
            hash:            file.hash ? file.hash.toString('hex') : null,
            size:            file.size ? file.size.toNumber() : 0,
            modified:        file.modified * 1000,
            type:            fileType(file.name),
            status:          file.stagedStatus,
            mergeConflict:   file.mergeConflict,
            mergeUnresolved: file.mergeUnresolved,
        }))
    const files = keyBy(fileList, 'name')

    res.status(200).json({ files })
}

repoController.getRepoTimeline = async (req, res, next) => {
    const { repoID } = req.params
    await checkUserAccess(req.user, repoID)

    // default to HEAD
    const fromCommitRef = (req.query.lastCommitFetched || '').length > 0 ? `${req.query.lastCommitFetched}^` : undefined
    // default to 10
    const pageSize = (req.query.pageSize || '').length > 0 ? req.query.pageSize : 10

    const { commits = [], isEnd } = await rpcClient.getRepoHistoryAsync({ repoID, fromCommitRef, pageSize, onlyHashes: true })
    const hashes = commits.map(c => c.commitHash)
    const dynamoCommits = await Commit.batchGet(repoID, hashes)
    const commitObj = keyBy(dynamoCommits, 'commit')

    const timeline = hashes.map(h => commitObj[h])
    if (isEnd && timeline.length > 0) {
        timeline[timeline.length - 1].isInitialCommit = true
    }

    res.status(200).json({ timeline })
}

repoController.getRepoTimelineEvent = async (req, res, next) => {
    const { repoID } = req.params
    const { commit } = req.query
    await checkUserAccess(req.user, repoID)

    const event = await Commit.get(repoID, commit)

    res.status(200).json({ event })
}

repoController.getRepoUsersPermissions = async (req, res, next) => {
    const { repoID } = req.params
    await checkUserAccess(req.user, repoID)

    let [ admins, pullers, pushers, isPublicResp ] = await Promise.all([
        rpcClient.getAllUsersOfTypeAsync(repoID, rpcClient.UserType.ADMIN),
        rpcClient.getAllUsersOfTypeAsync(repoID, rpcClient.UserType.PULLER),
        rpcClient.getAllUsersOfTypeAsync(repoID, rpcClient.UserType.PUSHER),
        rpcClient.isRepoPublicAsync({ repoID }),
    ])
    // @@TODO refactor replicators to a different permission type
    const replicators = [ 'jupiter', 'saturn', 'axon' ]
    admins = admins.filter(name => replicators.indexOf(name) < 0)
    pullers = pullers.filter(name => replicators.indexOf(name) < 0)
    pushers = pushers.filter(name => replicators.indexOf(name) < 0)
    const isPublic = isPublicResp.isPublic

    res.status(200).json({ admins, pullers, pushers, isPublic })
}

repoController.getSecuredFileInfo = async (req, res, next) => {
    const { repoID } = req.params
    await checkUserAccess(req.user, repoID)

    const { file } = req.query
    if (!file || file.length === 0) {
        throw new HTTPError(400, 'Missing files')
    }

    const securedFileInfo = await SecuredText.getForFile(repoID, file)

    res.status(200).json({ securedFileInfo })
}

repoController.create = async (req, res, next) => {
    const { repoID } = req.body
    const { userID } = req.user
    if (!repoID) {
        throw new HTTPError(400, 'Missing field: repoID')
    } else if (!userID) {
        throw new HTTPError(400, 'Missing field: userID. User must be logged in to create repo')
    }

    await Repo.create(repoID)
    await Repo.shareWithUser(repoID, userID)
    await User.addRepo(repoID, userID)

    return res.status(200).json({})
}

repoController.getSharedUsers = async (req, res, next) => {
    const { repoID } = req.query
    if (!repoID) {
        throw new HTTPError(400, 'Missing field: repoID')
    }

    const userIDs = await Repo.getSharedUsers(repoID)
    const users = await Promise.all(userIDs.map(userID => User.get(userID)))
    const sharedUsers = users.map(user => ({
        name:   user.name,
        userID: user.userID,
    }))
    res.status(200).json({ sharedUsers })
}

repoController.updateUserPermissions = async (req, res, next) => {
    const requester = req.user.username
    const { repoID, username, admin = false, pusher = false, puller = false } = req.body
    if (!repoID) {
        throw new HTTPError(400, 'Missing field: repoID')
    } else if (!username) {
        throw new HTTPError(400, 'Missing field: username')
    }
    const [ currentAdmins, user ] = await Promise.all([
        rpcClient.getAllUsersOfTypeAsync(repoID, rpcClient.UserType.ADMIN),
        User.getByUsername(username),
    ])
    if (currentAdmins.indexOf(requester) < 0) {
        throw new HTTPError(403, 'Must be an admin to update user permissions')
    }

    const promises = [ rpcClient.setUserPermissionsAsync({ repoID, username, admin, pusher, puller }) ]
    // keep database in sync for now
    // @@TODO: eventually refactor this out
    if (admin || pusher || puller) {
        promises.push(Repo.shareWithUser(repoID, user.userID))
        promises.push(User.addRepo(repoID, user.userID))
    } else {
        promises.push(User.unshareRepo(repoID, user.userID))
        promises.push(Repo.unshareWithUser(repoID, user.userID))
    }
    await Promise.all(promises)

    const [ admins, pushers, pullers ] = await Promise.all([
        rpcClient.getAllUsersOfTypeAsync(repoID, rpcClient.UserType.ADMIN),
        rpcClient.getAllUsersOfTypeAsync(repoID, rpcClient.UserType.PUSHER),
        rpcClient.getAllUsersOfTypeAsync(repoID, rpcClient.UserType.PULLER),
    ])

    res.status(200).json({ repoID, admins, pushers, pullers })
}

repoController.shareRepo = async (req, res, next) => {
    let { repoID, userID, username } = req.body
    if (!repoID) {
        throw new HTTPError(400, 'Missing field: repoID')
    } else if (!username && !userID) {
        throw new HTTPError(400, 'Missing field: username or userID')
    }
    if (userID === undefined) {
        const user = await User.getByUsername(username)
        userID = user.userID
    }

    await Promise.all([
        User.addRepo(repoID, userID),
        Repo.shareWithUser(repoID, userID),
    ])
    res.status(200).json({ message: 'ok' })
}

repoController.unshareRepo = async (req, res, next) => {
    let { repoID, userID, username } = req.body
    if (!repoID) {
        throw new HTTPError(400, 'Missing field: repoID')
    } else if (!username && !userID) {
        throw new HTTPError(400, 'Missing field: username or userID')
    }
    if (userID === undefined) {
        const user = await User.getByUsername(username)
        userID = user.userID
    }

    await Promise.all([
        User.unshareRepo(repoID, userID),
        Repo.unshareWithUser(repoID, userID),
    ])
    res.status(200).json({ message: 'ok' })
}

repoController.setPublic = async (req, res, next) => {
    const requesterUsername = req.user.username
    const { repoID } = req.params
    const { isPublic } = req.body
    if (!repoID) {
        throw new HTTPError(400, 'Missing field: repoID')
    } else if (isPublic !== true && isPublic !== false) {
        throw new HTTPError(400, 'Missing field: isPublic')
    }
    const admins = await rpcClient.getAllUsersOfTypeAsync(repoID, rpcClient.UserType.ADMIN)
    if (admins.indexOf(requesterUsername) < 0) {
        throw new HTTPError(403, 'must be an admin to make a repo public')
    }

    await rpcClient.setRepoPublicAsync({ repoID, isPublic })

    res.status(200).json({ message: 'ok' })
}

repoController.isPublic = async (req, res, next) => {
    const { repoID } = req.params
    if (!repoID) {
        throw new HTTPError(400, 'Missing field: repoID')
    }
    const isPublicResp = await rpcClient.isRepoPublicAsync({ repoID })
    const isPublic = isPublicResp.isPublic

    res.status(200).json({ isPublic })
}

export default repoController
