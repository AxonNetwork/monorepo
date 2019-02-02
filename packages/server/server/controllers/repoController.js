import Repo from '../models/repo'
import Discussion from '../models/discussion'
import Comment from '../models/comment'
import User from '../models/user'
import HTTPError from '../util/HTTPError'
import passportAuthenticateAsync from '../util/passportAuth'
import { filemodeIsDir, fileType } from '../util'
import { defaultOnError } from '../util/Promise'
import spawnCmd from '../util/spawnCmd'
import * as noderpc from '../noderpc'
import { union, keyBy } from 'lodash'
import path from 'path'
import fs from 'fs'
import passport from 'passport'

const repoController = {}

const localRepos = {} // [repoID] => filepath

const rpcClient = noderpc.initClient()
async function setupLocalReposCache() {
    try {
        const local = await rpcClient.getLocalReposAsync({})
        for (let i = 0; i < local.length; i++) {
            const repo = local[i]
            localRepos[repo.repoID] = repo.path
        }
    } catch (err) {
        console.error(err)
    }
}

setupLocalReposCache()

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

repoController.get = async (req, res, next) => {
    const { repoID, filepath } = req.params
    if (!repoID) {
        throw new HTTPError(400, 'Missing repoID')
    } if (!localRepos[repoID]) {
        throw new HTTPError(404, 'Repository does not exist')
    }

    console.log('repoController.get 111')

    const [ admins, pullers, pushers, isPublicResp, repoRow ] = await Promise.all([
        rpcClient.getAllUsersOfTypeAsync(repoID, rpcClient.UserType.ADMIN),
        rpcClient.getAllUsersOfTypeAsync(repoID, rpcClient.UserType.PULLER),
        rpcClient.getAllUsersOfTypeAsync(repoID, rpcClient.UserType.PUSHER),
        rpcClient.isRepoPublicAsync({ repoID }),
        defaultOnError(Repo.get(repoID), {}),
    ])
    console.log('repoController.get 222')
    const isPublic = isPublicResp.isPublic
    const allUsers = union(admins, pullers, pushers)
    const hasAccess = req.user !== undefined && allUsers.indexOf(req.user.username) > -1
    if (!isPublic && !hasAccess) {
        throw new HTTPError(403, 'Unauthorized to view this repo')
    }

    console.log('repoController.get 333')
    const history = (await rpcClient.getRepoHistoryAsync({ repoID })).commits || []
    console.log('repoController.get 444')
    const timeline = history.map(event => ({
        version:  0,
        commit:   event.commitHash,
        user:     event.author,
        time:     new Date(event.timestamp.toNumber() * 1000),
        message:  event.message,
        files:    event.files,
        verified: event.verified !== undefined ? new Date(event.verified.toNumber() * 1000) : undefined,
    }))
    console.log('repoController.get 555')
    const commits = keyBy(timeline, 'commit')
    const commitList = Object.keys(commits)

    // @@TODO: don't hardcode the commit hash thing?
    const filesListRaw = (await rpcClient.getRepoFilesAsync({ repoID })).files || []
    console.log('repoController.get 666')
    const contents = filesListRaw.map(file => ({
        name:            file.name,
        hash:            file.hash ? file.hash.toString('hex') : null,
        size:            file.size ? file.size.toNumber() : 0,
        modified:        new Date(file.modified * 1000),
        type:            fileType(file.name),
        status:          file.stagedStatus,
        mergeConflict:   file.mergeConflict,
        mergeUnresolved: file.mergeUnresolved,
    }))
    const files = keyBy(contents, 'name')

    console.log('repoController.get 777')
    res.status(200).json({
        repoID,
        admins,
        pullers,
        pushers,
        commits,
        commitList,
        files,
        sharedUsers: repoRow.users,
        isPublic,
    })
}

repoController.getFileContents = async (req, res, next) => {
    const { repoID } = req.params
    const repoRoot = localRepos[repoID]

    // with the route /file/filename* (see routes.js),
    // params.filename = filename and params[0] = *
    const filename = path.join(req.params.filename, req.params[0])
    const filepath = path.join(repoRoot, filename)

    res.sendFile(filepath)
}

repoController.saveFileContents = async (req, res, next) => {
    const { contents } = req.body
    if (contents === undefined) {
        throw new HTTPError(400, 'missing contents')
    }
    const { repoID } = req.params
    const repoRoot = localRepos[repoID]

    // with the route /file/filename* (see routes.js),
    // params.filename = filename and params[0] = *
    const filename = path.join(req.params.filename, req.params[0])
    const filepath = path.join(repoRoot, filename)
    fs.writeFileSync(filepath, contents)

    res.status(200).json({ contents })
}

repoController.getDiff = async (req, res, next) => {
    const { repoID, commit } = req.params
    const repoRoot = localRepos[repoID]
    const diff = await spawnCmd('git', [ 'show', commit ], repoRoot)

    res.status(200).json({
        // repoID,
        // commit,
        // diffs,
        diff,
    })
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
