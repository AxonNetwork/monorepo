import keyBy from 'lodash/keyBy'
import union from 'lodash/union'
import { makeLogic, makeContinuousLogic } from 'conscience-components/redux/reduxUtils'
import { ILocalRepo, IRepoFile, ITimelineEvent, URI, URIType } from 'conscience-lib/common'
import {
    RepoActionType,
    IGetDiffAction, IGetDiffSuccessAction,
    IUpdateUserPermissionsAction, IUpdateUserPermissionsSuccessAction,
    ICheckpointRepoAction, ICheckpointRepoSuccessAction,
    ICloneRepoAction,
    IPullRepoAction,
    cloneRepoProgress, pullRepoProgress, pullRepoSuccess
} from 'conscience-components/redux/repo/repoActions'
import {
    DesktopRepoActionType,
    ICreateRepoAction, ICreateRepoSuccessAction,
    IGetLocalReposAction, IGetLocalReposSuccessAction,
    IFetchFullRepoAction, IFetchFullRepoSuccessAction,
    IFetchRepoFilesAction, IFetchRepoFilesSuccessAction,
    IFetchRepoTimelineAction, IFetchRepoTimelineSuccessAction,
    IFetchRepoUsersPermissionsAction, IFetchRepoUsersPermissionsSuccessAction,
    IFetchLocalRefsAction, IFetchLocalRefsSuccessAction,
    IFetchRemoteRefsAction, IFetchRemoteRefsSuccessAction,
    ISelectRepoAction, ISelectRepoSuccessAction,

    IWatchRepoAction,
    selectRepo, fetchFullRepo, fetchRepoFiles, fetchRepoTimeline, fetchRepoUsersPermissions,
    fetchLocalRefs, fetchRemoteRefs, watchRepo, behindRemote
} from './repoActions'
import { fetchUserDataByUsername } from 'conscience-components/redux/user/userActions'
import { getDiscussions } from 'conscience-components/redux/discussion/discussionActions'
import { addRepoToOrg } from 'conscience-components/redux/org/orgActions'
import { getRepo } from 'conscience-components/env-specific'
import ServerRelay from 'conscience-lib/ServerRelay'
import * as rpc from 'conscience-lib/rpc'

import RepoWatcher from 'lib/RepoWatcher'
import spawnCmd from 'utils/spawnCmd'
import * as filetypes from 'conscience-lib/utils/fileTypes'

const createRepoLogic = makeLogic<ICreateRepoAction, ICreateRepoSuccessAction>({
    type: DesktopRepoActionType.CREATE_REPO,
    async process({ action, getState }, dispatch) {
        const { repoID, orgID } = action.payload
        const state = getState()
        const { name, emails } = state.user.users[state.user.currentUser || '']

        const { path } = await rpc.client.initRepoAsync({
            repoID: repoID,
            name: name,
            email: emails[0],
        })
        await ServerRelay.createRepo(repoID)

        await dispatch(addRepoToOrg({ orgID, repoID }))
        await dispatch(watchRepo({ repoID, path }))
        await dispatch(selectRepo({ repoID, path }))
        return { repoID, path, orgID }
    },
})

const getLocalReposLogic = makeLogic<IGetLocalReposAction, IGetLocalReposSuccessAction>({
    type: DesktopRepoActionType.GET_LOCAL_REPOS,
    async process(_, dispatch) {

        // Attempt to fetch local repos 10 times in case node isn't running yet
        const repoList = await new Promise<ILocalRepo[]>(async (resolve, reject) => {
            let repeat = 10
            const attempt = async function() {
                try {
                    const result = await rpc.client.getLocalReposAsync()
                    resolve(result)
                } catch (err) {
                    repeat -= 1
                    if (repeat > 0) {
                        setTimeout(attempt, 200)
                    } else {
                        reject(err)
                    }
                }
            }
            attempt()
        })

        let repos = {} as { [path: string]: ILocalRepo }

        for (let repo of repoList) {
            // await dispatch(fetchedRepo({ repo }))
            // @@TODO: make sure we're not already watching a given repo
            dispatch(watchRepo({ repoID: repo.repoID, path: repo.path }))
            repos[repo.path] = repo
        }

        // @@TODO: not a good place for this.  put it in the component or in a wrapper action.
        if (repoList.length > 0) {
            const { repoID, path } = repoList[0]
            dispatch(selectRepo({ repoID, path }))
        }
        // @@TODO: not a good place for this.  put it in the component or in a wrapper action.
        // await dispatch({ type: FETCH_SHARED_REPOS })

        return { repos }
    },
})

const selectRepoLogic = makeLogic<ISelectRepoAction, ISelectRepoSuccessAction>({
    type: DesktopRepoActionType.SELECT_REPO,
    async process({ getState, action }, dispatch) {
        const { repoID, path } = action.payload
        // If we don't have this repo in the store, fetch it.  Otherwise, just select it.
        if (!(getState().repo.repos[path] || {}).hasBeenFetched) {
            await dispatch(fetchFullRepo({ repoID, path }))
        }
        return { repoID, path }
    },
})

const fetchFullRepoLogic = makeLogic<IFetchFullRepoAction, IFetchFullRepoSuccessAction>({
    type: DesktopRepoActionType.FETCH_FULL_REPO,
    async process({ action }, dispatch) {
        const { path, repoID } = action.payload
        const uri = { type: URIType.Local, repoRoot: path } as URI

        dispatch(fetchRepoFiles({ path, repoID }))
        dispatch(fetchRepoTimeline({ path, repoID }))
        dispatch(getDiscussions({ uri }))
        dispatch(fetchRepoUsersPermissions({ repoID }))
        dispatch(fetchLocalRefs({ path, repoID }))
        dispatch(fetchRemoteRefs({ repoID }))
        return { path, repoID }
    },
})

const fetchRepoFilesLogic = makeLogic<IFetchRepoFilesAction, IFetchRepoFilesSuccessAction>({
    type: DesktopRepoActionType.FETCH_REPO_FILES,
    async process({ action }) {
        const { path, repoID } = action.payload

        const filesListRaw = (await rpc.client.getRepoFilesAsync({ path, repoID })).files
        const filesList = filesListRaw.map(file => ({
            name: file.name,
            size: file.size ? file.size.toNumber() : 0,
            modified: new Date(file.modified * 1000),
            type: filetypes.getType(file.name),
            status: file.stagedStatus,
            mergeConflict: file.mergeConflict,
            mergeUnresolved: file.mergeUnresolved,
        } as IRepoFile))
        const files = keyBy(filesList, 'name')

        return { repoID, path, files }
    },
})

const fetchRepoTimelineLogic = makeLogic<IFetchRepoTimelineAction, IFetchRepoTimelineSuccessAction>({
    type: DesktopRepoActionType.FETCH_REPO_TIMELINE,
    async process({ action }) {
        const { path, repoID } = action.payload

        const history = (await rpc.client.getRepoHistoryAsync({ path, repoID, page: 0 }))
        const timeline = history.commits.map(event => ({
            version: 0,
            commit: event.commitHash,
            user: event.author,
            time: new Date(event.timestamp.toNumber() * 1000),
            message: event.message,
            files: event.files, // @@TODO: we can fetch these with `git show --name-only --pretty=format:"" HEAD`
            verified: event.verified !== undefined ? new Date(event.verified.toNumber() * 1000) : undefined,
        } as ITimelineEvent))

        return { repoID, path, timeline }
    },
})

const fetchRepoUsersPermissionsLogic = makeLogic<IFetchRepoUsersPermissionsAction, IFetchRepoUsersPermissionsSuccessAction>({
    type: DesktopRepoActionType.FETCH_REPO_USERS_PERMISSIONS,
    async process({ action }, dispatch) {
        const { repoID } = action.payload
        const [admins, pushers, pullers] = await Promise.all([
            rpc.client.getAllUsersOfTypeAsync({ repoID, type: rpc.client.UserType.ADMIN }),
            rpc.client.getAllUsersOfTypeAsync({ repoID, type: rpc.client.UserType.PUSHER }),
            rpc.client.getAllUsersOfTypeAsync({ repoID, type: rpc.client.UserType.PULLER })
        ])

        const usernames = union(admins, pushers, pullers)
        await dispatch(fetchUserDataByUsername({ usernames: usernames }))

        return { repoID, admins, pushers, pullers }
    },
})

const updateUserPermissionsLogic = makeLogic<IUpdateUserPermissionsAction, IUpdateUserPermissionsSuccessAction>({
    type: RepoActionType.UPDATE_USER_PERMISSIONS,
    async process({ action }, dispatch) {
        const { repoID, username, admin, pusher, puller } = action.payload
        await rpc.client.setUserPermissionsAsync({ repoID, username, puller, pusher, admin })
        const [admins, pushers, pullers] = await Promise.all([
            rpc.client.getAllUsersOfTypeAsync({ repoID, type: rpc.client.UserType.ADMIN }),
            rpc.client.getAllUsersOfTypeAsync({ repoID, type: rpc.client.UserType.PUSHER }),
            rpc.client.getAllUsersOfTypeAsync({ repoID, type: rpc.client.UserType.PULLER })
        ])
        return { repoID, admins, pushers, pullers }
    },
})

const fetchLocalRefsLogic = makeLogic<IFetchLocalRefsAction, IFetchLocalRefsSuccessAction>({
    type: DesktopRepoActionType.FETCH_LOCAL_REFS,
    async process({ action }) {
        const { repoID, path } = action.payload
        const resp = await rpc.client.getLocalRefsAsync({ repoID, path })
        const localRefs = {} as { [refName: string]: string }
        for (let ref of resp.refs) {
            localRefs[ref.refName] = ref.commitHash
        }
        return { path: resp.path, localRefs }
    },
})

const fetchRemoteRefsLogic = makeLogic<IFetchRemoteRefsAction, IFetchRemoteRefsSuccessAction>({
    type: DesktopRepoActionType.FETCH_REMOTE_REFS,
    async process({ action }) {
        const { repoID } = action.payload
        const remoteRefs = await rpc.client.getAllRemoteRefsAsync(repoID)
        return { repoID, remoteRefs }
    },
})

const checkpointRepoLogic = makeLogic<ICheckpointRepoAction, ICheckpointRepoSuccessAction>({
    type: RepoActionType.CHECKPOINT_REPO,
    async process({ action }, dispatch) {
        const { uri, message } = action.payload
        const repo = getRepo(uri)
        await rpc.client.checkpointRepoAsync({ path: repo.path || '', message: message })
        await dispatch(fetchFullRepo({ repoID: repo.repoID, path: repo.path || '' }))
        return {}
    },
})

const getDiffLogic = makeLogic<IGetDiffAction, IGetDiffSuccessAction>({
    type: RepoActionType.GET_DIFF,
    async process({ action }) {
        const { repoRoot, commit } = action.payload

        if (repoRoot === undefined) {
            throw new Error('repoRoot should never be undefined in getDiffLogic')
        }

        let diffBlob: string
        try {
            diffBlob = await spawnCmd('git', ['show', commit], repoRoot)
        } catch (err) {
            console.log(`ERROR running git show ${commit} ~>`, err)
            throw err
        }

        const lines = diffBlob.split('\n')
        let filename = ''
        let skipLines = 0
        let pastHeader = false
        let diffs = {} as { [filename: string]: string }
        for (let line of lines) {
            if (line.indexOf('diff ') === 0) {
                const parts = line.split(' ')
                filename = parts[2].replace('a/', '')
                skipLines = 3
                pastHeader = true
            }
            if (skipLines > 0) {
                skipLines--
                continue
            }
            if (!pastHeader) {
                continue
            }
            diffs[filename] = (diffs[filename] || '') + line + '\n'
        }

        console.log('diffs ~>', diffs)

        return { diffs, repoRoot, filename, commit }
    },
})

// const revertFilesLogic = makeLogic<IRevertFilesAction, IRevertFilesSuccessAction>({
//     type: RepoActionType.REVERT_FILES,
//     async process({ action }) {
//         const { repoRoot, files, commit } = action.payload
//         await ConscienceRelay.revertFiles(repoRoot, files, commit)
//         return {}
//     },
// })

const cloneRepoLogic = makeContinuousLogic<ICloneRepoAction>({
    type: RepoActionType.CLONE_REPO,
    async process({ action, getState }, dispatch, done) {
        const { repoID } = action.payload
        const state = getState()
        const { name, emails } = state.user.users[state.user.currentUser || '']

        const stream = rpc.client.cloneRepo({
            repoID: repoID,
            name: name,
            email: emails[0],
        })
        dispatch(cloneRepoProgress({ repoID, fetched: 1, toFetch: 10 }))
        var path = ""
        var success = false
        stream.on('data', async (data: any) => {
            if (data.progress !== undefined) {
                const fetched = data.progress.fetched !== undefined ? data.progress.fetched.toNumber() : 0
                const toFetch = data.progress.toFetch !== undefined ? data.progress.toFetch.toNumber() : 0
                await dispatch(cloneRepoProgress({ repoID, fetched, toFetch }))
            }
            if (data.success !== undefined) {
                path = data.success.path
                success = true
            }
        })
        stream.on('end', async () => {
            if (success) {
                await dispatch(watchRepo({ repoID, path }))
                await dispatch(selectRepo({ repoID, path }))
            }
            done()
        })
        stream.on('error', (err: any) => {
            throw err
        })
    },
})

const pullRepoLogic = makeContinuousLogic<IPullRepoAction>({
    type: RepoActionType.PULL_REPO,
    async process({ action }, dispatch, done) {
        const { uri } = action.payload
        const repo = getRepo(uri)
        const folderPath = repo.path || ''
        const stream = rpc.client.pullRepo({ path: folderPath })
        dispatch(pullRepoProgress({ folderPath, fetched: 0, toFetch: 0 }))
        stream.on('data', async (data: any) => {
            console.log("PULL", data)
            const toFetch = data.toFetch !== undefined ? data.toFetch.toNumber() : 0
            const fetched = data.fetched !== undefined ? data.fetched.toNumber() : 0
            await dispatch(pullRepoProgress({ folderPath, fetched, toFetch }))
        })
        stream.on('end', async () => {
            await dispatch(fetchFullRepo({ path: folderPath, repoID: repo.repoID }))
            await dispatch(pullRepoSuccess({ folderPath }))
            done()
        })
        stream.on('error', (err: any) => {
            throw err
        })
    },
})

// const addCollaboratorLogic = makeLogic<IAddCollaboratorAction, IAddCollaboratorSuccessAction>({
//     type: RepoActionType.ADD_COLLABORATOR,
//     async process({ action, getState }, dispatch) {
//         const { repoRoot, repoID, email } = action.payload
//         const user = (await ServerRelay.fetchUsersByEmail([email]))[0]
//         if (user === undefined) {
//             throw new Error('user does not exist')
//         }
//         const username = user.username
//         await rpc.client.setUserPermissionsAsync({ repoID, username, puller: true, pusher: true, admin: false })
//         const userID = user.userID
//         await ServerRelay.shareRepo(repoID, userID)
//         dispatch(fetchUserData({ userIDs: [userID] }))
//         return { repoRoot, repoID, userID }
//     },
// })

// const removeCollaboratorLogic = makeLogic<IRemoveCollaboratorAction, IRemoveCollaboratorSuccessAction>({
//     type: RepoActionType.REMOVE_COLLABORATOR,
//     async process({ action, getState }) {
//         const { repoRoot, repoID, userID } = action.payload
//         const user = getState().user.users[userID]
//         // @@TODO fetch if not exists
//         const username = user.username
//         await rpc.client.setUserPermissionsAsync({ repoID, username, puller: false, pusher: false, admin: false })
//         await ServerRelay.unshareRepo(repoID, userID)
//         return { repoRoot, repoID, userID }
//     },
// })

const watchRepoLogic = makeContinuousLogic<IWatchRepoAction>({
    type: DesktopRepoActionType.WATCH_REPO,
    async process({ action }, dispatch, done) {
        const { repoID, path } = action.payload
        const watcher = RepoWatcher.watch(repoID, path) // returns null if the watcher already exists
        if (watcher) {
            watcher.on('file_change', () => {
                dispatch(fetchRepoFiles({ path, repoID }))
            })
            watcher.on('behind_remote', () => {
                dispatch(behindRemote({ path }))
            })
            watcher.on('end', () => {
                done()
            })
        }
    },
})

export default [
    // imported from conscience-components
    updateUserPermissionsLogic,

    // desktop-specific
    createRepoLogic,
    getLocalReposLogic,
    selectRepoLogic,
    fetchFullRepoLogic,
    fetchRepoFilesLogic,
    fetchRepoTimelineLogic,
    fetchRepoUsersPermissionsLogic,
    fetchLocalRefsLogic,
    fetchRemoteRefsLogic,
    checkpointRepoLogic,
    getDiffLogic,
    // revertFilesLogic,
    cloneRepoLogic,
    pullRepoLogic,
    // addCollaboratorLogic,
    // removeCollaboratorLogic,
    watchRepoLogic,
]