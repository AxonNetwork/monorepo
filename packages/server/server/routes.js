import path from 'path'
import { Router } from 'express'
import passport from 'passport'
import through2 from 'through2'

import * as rpc from './noderpc'

// Controller Logic
import userController from './controllers/userController'
import repoController from './controllers/repoController'
import commentController from './controllers/commentController'
import discussionController from './controllers/discussionController'
import organizationController from './controllers/organizationController'
import organizationBlogsController from './controllers/organizationBlogsController'
import faucetController from './controllers/faucetController'
import searchController from './controllers/searchController'

const mustAuthenticate = passport.authenticate('jwt', { session: false })
const tryAuthenticate = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) { return next(err) }
        if (!user) { return next() }
        req.login(user, { session: false }, (err) => {
            if (err) { return next(err) }
            next()
        })
    })(req, res, next)
}

const asyncMiddleware = fn => (req, res, next) => { Promise.resolve(fn(req, res, next)).catch(next) }

const routes = Router()

// User routes
routes.get('/api/whoami', mustAuthenticate, asyncMiddleware(userController.whoAmI))
routes.post('/api/create-user', asyncMiddleware(userController.createUser))
routes.post('/api/login', asyncMiddleware(userController.login))
routes.post('/api/login-with-key', asyncMiddleware(userController.loginWithKey))

routes.post('/api/logout', mustAuthenticate, asyncMiddleware(userController.logout))
routes.get('/api/shared-repos', mustAuthenticate, asyncMiddleware(userController.getSharedRepos))
routes.get('/api/organizations', mustAuthenticate, asyncMiddleware(userController.getOrganizations))
routes.get('/api/users', mustAuthenticate, asyncMiddleware(userController.getUsers))
routes.get('/api/users-by-email', mustAuthenticate, asyncMiddleware(userController.getUsersByEmail))
routes.get('/api/users-by-username', mustAuthenticate, asyncMiddleware(userController.getUsersByUsername))

routes.post('/api/user-photo', mustAuthenticate, asyncMiddleware(userController.uploadProfilePicture))
routes.post('/api/user/profile', mustAuthenticate, asyncMiddleware(userController.updateUserProfile))
routes.post('/api/user/email', mustAuthenticate, asyncMiddleware(userController.modifyEmail))
routes.post('/api/user/settings', mustAuthenticate, asyncMiddleware(userController.updateSettings))
routes.post('/api/user/sawComment', mustAuthenticate, asyncMiddleware(userController.sawComment))
routes.get('/api/user/settings', mustAuthenticate, asyncMiddleware(userController.getSettings))

routes.post('/api/create-repo', mustAuthenticate, asyncMiddleware(repoController.create))
routes.get('/api/shared-users', mustAuthenticate, asyncMiddleware(repoController.getSharedUsers))
routes.post('/api/update-user-permissions', mustAuthenticate, asyncMiddleware(repoController.updateUserPermissions))
routes.post('/api/share-repo', mustAuthenticate, asyncMiddleware(repoController.shareRepo))
routes.post('/api/unshare-repo', mustAuthenticate, asyncMiddleware(repoController.unshareRepo))

routes.get('/api/repolist/:username', mustAuthenticate, asyncMiddleware(repoController.getUserRepos))
routes.post('/api/repo/set-public/:repoID', mustAuthenticate, asyncMiddleware(repoController.setPublic))
routes.get('/api/repo/is-public/:repoID', mustAuthenticate, asyncMiddleware(repoController.isPublic))

routes.get('/api/repos/metadata', tryAuthenticate, asyncMiddleware(repoController.getRepoMetadata))
routes.get('/api/repo/files/:repoID', tryAuthenticate, asyncMiddleware(repoController.getRepoFiles))
routes.get('/api/repo/timeline/:repoID', tryAuthenticate, asyncMiddleware(repoController.getRepoTimeline))
routes.get('/api/repo/timeline-event/:repoID', tryAuthenticate, asyncMiddleware(repoController.getRepoTimelineEvent))
routes.get('/api/repo/permissions/:repoID', tryAuthenticate, asyncMiddleware(repoController.getRepoUsersPermissions))
routes.get('/api/repo/secured-file/:repoID', tryAuthenticate, asyncMiddleware(repoController.getSecuredFileInfo))

routes.get('/api/comment', mustAuthenticate, asyncMiddleware(commentController.get))
routes.post('/api/create-comment', mustAuthenticate, asyncMiddleware(commentController.createComment))
routes.post('/api/delete-comment', mustAuthenticate, asyncMiddleware(commentController.deleteComment))
routes.get('/api/comments-for-discussion', mustAuthenticate, asyncMiddleware(commentController.getAllForDiscussion))

routes.get('/api/discussion', mustAuthenticate, asyncMiddleware(discussionController.get))
routes.get('/api/discussions-for-repo', mustAuthenticate, asyncMiddleware(discussionController.getAllForRepo))
routes.post('/api/discussion', mustAuthenticate, asyncMiddleware(discussionController.createDiscussion))

routes.post('/api/create-organization', mustAuthenticate, asyncMiddleware(organizationController.create))
routes.get('/api/organization/:orgID', asyncMiddleware(organizationController.get))
routes.post('/api/update-organization', mustAuthenticate, asyncMiddleware(organizationController.update))
routes.post('/api/add-member-to-org', mustAuthenticate, asyncMiddleware(organizationController.addMember))
routes.post('/api/remove-member-from-org', mustAuthenticate, asyncMiddleware(organizationController.removeMember))
routes.post('/api/add-repo-to-org', mustAuthenticate, asyncMiddleware(organizationController.addRepo))
routes.post('/api/remove-repo-from-org', mustAuthenticate, asyncMiddleware(organizationController.removeRepo))
routes.post('/api/org-photo', mustAuthenticate, asyncMiddleware(organizationController.uploadOrgPicture))
routes.post('/api/org-banner', mustAuthenticate, asyncMiddleware(organizationController.uploadOrgBanner))
routes.post('/api/org/featured-repos', mustAuthenticate, asyncMiddleware(organizationController.changeOrgFeaturedRepos))
routes.post('/api/org/:orgID/update-colors', mustAuthenticate, asyncMiddleware(organizationController.updateColors))

routes.get('/api/org/:orgID/blog/:created', asyncMiddleware(organizationBlogsController.get))
routes.get('/api/org/:orgID/blog', asyncMiddleware(organizationBlogsController.getMany))
routes.post('/api/org/:orgID/blog', mustAuthenticate, asyncMiddleware(organizationBlogsController.create))
routes.patch('/api/org/:orgID/blog/:created', mustAuthenticate, asyncMiddleware(organizationBlogsController.update))

routes.post('/api/faucet', asyncMiddleware(faucetController.ethFaucet))
routes.get('/api/balance', asyncMiddleware(faucetController.getBalance))

routes.get('/api/repo/:repoID/object/:objectID', (req, res) => {
    const { repoID, objectID } = req.params

    if ([ 40, 64 ].indexOf(objectID.length) === -1) {
        return res.status(400).json({ error: 'bad objectID' })
    }

    const stream = rpc.initClient().getObject({ repoID, repoRoot: '', objectID: Buffer.from(objectID, 'hex'), maxSize: 999999999999999 })
    // @@TODO: how to get content-type?  request url?
    // res.setHeader('Content-Type', 'image/png')

    stream.on('error', (err) => {
        console.error(`error sending object ${objectID}: ${err.toString()}`)
        res.status(404).json({})
    })

    let gotHeader = false
    let totalSize = 0

    stream.pipe(through2({ objectMode: true }, (chunk, enc, cb) => {
        if (!gotHeader) {
            totalSize = chunk.header.uncompressedSize.toNumber()
            gotHeader = true
            return cb()
        }

        const pkt = chunk.data
        if (pkt.end) {
            return cb()
        }
        return cb(null, pkt.data)
    })).pipe(res)
})

routes.get('/api/repo/:repoID/file/:commit/:filename*', (req, res) => {
    const { repoID, commit } = req.params
    const filename = req.params[0] ? path.join(req.params.filename, req.params[0]) : req.params.filename // params[0] = and all subsequent unnamed params

    let stream
    if (commit === 'HEAD') {
        stream = rpc.initClient().getObject({ repoID, commitRef: commit, filename, maxSize: 999999999999999 })
    } else {
        if (commit.length != 40) {
            return res.status(400).json({ error: 'bad commit' })
        }
        stream = rpc.initClient().getObject({ repoID, commitHash: Buffer.from(commit, 'hex'), filename, maxSize: 999999999999999 })
    }

    // @@TODO: how to get content-type?  request url?
    // res.setHeader('Content-Type', 'image/png')

    stream.on('error', (err) => {
        console.error(`error sending object ${filename}: ${err.toString()}`)
        res.status(404).json({})
    })

    let gotHeader = false
    let totalSize = 0

    stream.pipe(through2({ objectMode: true }, (chunk, enc, cb) => {
        if (!gotHeader) {
            totalSize = chunk.header.uncompressedSize.toNumber()
            gotHeader = true
            return cb()
        }

        const pkt = chunk.data
        if (pkt.end) {
            return cb()
        }
        return cb(null, pkt.data)
    })).pipe(res)
})

routes.get('/api/repo/:repoID/diff/:commit', (req, res) => {
    const { repoID, commit } = req.params
    console.log('HERE')

    let stream
    if (commit === 'HEAD') {
        stream = rpc.initClient().getDiff({ repoID, commitRef: commit })
    } else {
        if (commit.length != 40) {
            return res.status(400).json({ error: 'bad commit' })
        }
        stream = rpc.initClient().getDiff({ repoID, commitHash: Buffer.from(commit, 'hex') })
    }

    stream.on('error', (err) => {
        console.error(`error sending diff ${repoID}:${commit}: ${err.toString()}`)
        res.status(404).json({})
    })

    stream.pipe(through2({ objectMode: true }, (pkt, enc, cb) => {
        if (pkt.end) {
            return cb()
        }
        return cb(null, pkt.data)
    })).pipe(res)
})

routes.get('/api/search/get', asyncMiddleware(searchController.get))
routes.get('/api/search/search', asyncMiddleware(searchController.search))
routes.get('/api/search/refresh', asyncMiddleware(searchController.refresh))
routes.get('/api/search/reindex-repo', asyncMiddleware(searchController.reindexRepo))

export default routes
