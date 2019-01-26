import path from 'path'
import keyBy from 'lodash/keyBy'
import union from 'lodash/union'
import { makeLogic, makeContinuousLogic } from 'conscience-components/redux/reduxUtils'
import { ILocalRepo, IRepoFile, ITimelineEvent, RepoPage, URI, URIType } from 'conscience-lib/common'
import {
    RepoActionType,
    IGetLocalRepoListAction, IGetLocalRepoListSuccessAction,
    IFetchRepoFilesAction, IFetchRepoFilesSuccessAction,
    IFetchRepoTimelineAction, IFetchRepoTimelineSuccessAction,
    IFetchRepoUsersPermissionsAction, IFetchRepoUsersPermissionsSuccessAction,
    IFetchLocalRefsAction, IFetchLocalRefsSuccessAction,
    IFetchRemoteRefsAction, IFetchRemoteRefsSuccessAction,
    IGetDiffAction, IGetDiffSuccessAction,
    IUpdateUserPermissionsAction, IUpdateUserPermissionsSuccessAction,
    ICreateRepoAction, ICreateRepoSuccessAction,
    ICheckpointRepoAction, ICheckpointRepoSuccessAction,
    ICloneRepoAction,
    IPullRepoAction,
    cloneRepoProgress, pullRepoProgress, pullRepoSuccess, fetchFullRepo,
    fetchRepoFiles,
} from 'conscience-components/redux/repo/repoActions'
import {
    getRepoListLogic,
    fetchFullRepoLogic,
    fetchFullRepoFromServerLogic
} from 'conscience-components/redux/repo/repoLogic'
import {
    DesktopRepoActionType,
    IGetLocalReposAction, IGetLocalReposSuccessAction,
    IWatchRepoAction,
    watchRepo, behindRemote
} from './repoActions'
import { fetchUserDataByUsername } from 'conscience-components/redux/user/userActions'
import { addRepoToOrg } from 'conscience-components/redux/org/orgActions'
import { getRepo, getRepoID } from 'conscience-components/env-specific'
import { selectRepo } from 'conscience-components/navigation'
import ServerRelay from 'conscience-lib/ServerRelay'
import * as rpc from 'conscience-lib/rpc'

import RepoWatcher from 'lib/RepoWatcher'
import spawnCmd from 'utils/spawnCmd'
import parseDiff from 'conscience-lib/utils/parseDiff'
import * as filetypes from 'conscience-lib/utils/fileTypes'

const createRepoLogic = makeLogic<ICreateRepoAction, ICreateRepoSuccessAction>({
    type: RepoActionType.CREATE_REPO,
    async process({ action, getState }, dispatch) {
        const { repoID, orgID } = action.payload
        const state = getState()
        const { name, emails } = state.user.users[state.user.currentUser || '']

        const { path } = await rpc.getClient().initRepoAsync({
            repoID: repoID,
            name: name,
            email: emails[0],
        })

        await ServerRelay.createRepo(repoID)

        if (orgID && orgID.length > 0) {
            await dispatch(addRepoToOrg({ orgID, repoID }))
        }

        await dispatch(watchRepo({ repoID, path }))
        const uri = { type: URIType.Local, repoRoot: path } as URI
        await dispatch(fetchFullRepo({ uri }))
        selectRepo(uri, RepoPage.Home)

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
                    const result = await rpc.getClient().getLocalReposAsync()
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

        console.log('repoList', repoList)
        for (let repo of repoList) {
            // await dispatch(fetchedRepo({ repo }))
            // @@TODO: make sure we're not already watching a given repo
            dispatch(watchRepo({ repoID: repo.repoID, path: repo.path }))
            repos[repo.path] = repo
        }

        // @@TODO: not a good place for this.  put it in the component or in a wrapper action.
        if (repoList.length > 0) {
            const uri = { type: URIType.Local, repoRoot: repoList[0].path } as URI
            selectRepo(uri, RepoPage.Home)
        }
        // @@TODO: not a good place for this.  put it in the component or in a wrapper action.
        // await dispatch({ type: FETCH_SHARED_REPOS })

        return { repos }
    },
})

const getLocalRepoListLogic = makeLogic<IGetLocalRepoListAction, IGetLocalRepoListSuccessAction>({
    type: RepoActionType.GET_LOCAL_REPO_LIST,
    async process(_, dispatch) {
        const repoList = await new Promise<ILocalRepo[]>(async (resolve, reject) => {
            let repeat = 10
            const attempt = async function() {
                try {
                    const result = await rpc.getClient().getLocalReposAsync()
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

        let localRepos = {} as { [path: string]: string }

        for (let repo of repoList) {
            localRepos[repo.path] = repo.repoID
        }
        return { localRepos }
    },
})

const fetchRepoFilesLogic = makeLogic<IFetchRepoFilesAction, IFetchRepoFilesSuccessAction>({
    type: RepoActionType.FETCH_REPO_FILES,
    async process({ action }) {
        const { uri } = action.payload

        if (uri.type === URIType.Local) {
            const path = uri.repoRoot
            const repoID = getRepoID(uri)

            const filesListRaw = (await rpc.getClient().getRepoFilesAsync({ path, repoID })).files || []
            console.log('filesListRaw', filesListRaw)

            const filesList = filesListRaw.map(file => {
                if (file.name[file.name.length - 1] === '/') {
                    file.name = file.name.slice(0, file.name.length - 1)
                }
                if (file.name[0] === '/') {
                    file.name = file.name.slice(1)
                }
                return {
                    name: file.name,
                    size: file.size ? file.size.toNumber() : 0,
                    modified: new Date(file.modified * 1000),
                    type: filetypes.getType(file.name),
                    status: file.stagedStatus,
                    mergeConflict: file.mergeConflict,
                    mergeUnresolved: file.mergeUnresolved,
                } as IRepoFile
            })
            const files = keyBy(filesList, 'name')
            addFolders(files)
            return { uri, files }
        }
        return { uri, files: {} }
    },
})

function addFolders(files: { [name: string]: IRepoFile }) {
    for (let filepath of Object.keys(files)) {
        let dirname = path.dirname(filepath)
        if (dirname[0] === '/') {
            dirname = dirname.slice(1)
        }

        if (dirname === '.') {
            console.log('bad dirname', filepath)
            continue
        }

        const parts = dirname.split('/')
        for (let i = 0; i < parts.length; i++) {
            const partialDirname = parts.slice(0, i + 1).join('/')

            if (!files[partialDirname]) {
                const descendants = Object.keys(files).filter(filepath => filepath.startsWith(partialDirname) && files[filepath].type !== 'folder')
                let size = 0
                let modified: Date | null = null
                let status = ''
                for (let filepath of descendants) {
                    size += files[filepath].size
                    if (!modified || modified < files[filepath].modified) {
                        modified = files[filepath].modified
                    }

                    if (status !== 'M' && (files[filepath].status === 'M' || files[filepath].status === '?' || files[filepath].status === 'U')) {
                        status = 'M'
                    }
                }

                files[partialDirname] = {
                    name: partialDirname,
                    type: 'folder',
                    status,
                    size,
                    modified,
                    diff: '',
                    mergeConflict: false,
                    mergeUnresolved: false,
                } as IRepoFile
            }
        }
    }
}

const fetchRepoTimelineLogic = makeLogic<IFetchRepoTimelineAction, IFetchRepoTimelineSuccessAction>({
    type: RepoActionType.FETCH_REPO_TIMELINE,
    async process({ action }) {
        const { uri } = action.payload

        if (uri.type === URIType.Local) {
            const path = uri.repoRoot
            const repoID = getRepoID(uri)

            const history = (await rpc.getClient().getRepoHistoryAsync({ path, repoID, page: 0 })).commits || []

            const timeline = history.map(event => ({
                version: 0,
                commit: event.commitHash,
                user: event.author,
                time: new Date(event.timestamp.toNumber() * 1000),
                message: event.message,
                files: event.files, // @@TODO: we can fetch these with `git show --name-only --pretty=format:"" HEAD`
                verified: event.verified !== undefined ? new Date(event.verified.toNumber() * 1000) : undefined,
            } as ITimelineEvent))
            return { uri, timeline }
        }

        return { uri, timeline: [] }
    },
})

const fetchRepoUsersPermissionsLogic = makeLogic<IFetchRepoUsersPermissionsAction, IFetchRepoUsersPermissionsSuccessAction>({
    type: RepoActionType.FETCH_REPO_USERS_PERMISSIONS,
    async process({ action }, dispatch) {
        const { repoID } = action.payload
        const rpcClient = rpc.getClient()
        const [admins, pushers, pullers] = await Promise.all([
            rpcClient.getAllUsersOfTypeAsync({ repoID, type: rpcClient.UserType.ADMIN }),
            rpcClient.getAllUsersOfTypeAsync({ repoID, type: rpcClient.UserType.PUSHER }),
            rpcClient.getAllUsersOfTypeAsync({ repoID, type: rpcClient.UserType.PULLER })
        ])

        const usernames = union(admins, pushers, pullers)
        await dispatch(fetchUserDataByUsername({ usernames: usernames }))

        return { repoID, admins, pushers, pullers }
    },
})

const updateUserPermissionsLogic = makeLogic<IUpdateUserPermissionsAction, IUpdateUserPermissionsSuccessAction>({
    type: RepoActionType.UPDATE_USER_PERMISSIONS,
    async process({ action, getState }, dispatch) {
        const { uri, username, admin, pusher, puller } = action.payload
        const repoID = (getRepo(uri) || {}).repoID
        const userID = getState().user.usersByUsername[username]
        const rpcClient = rpc.getClient()

        let sharePromise = (admin || pusher || puller) ?
            ServerRelay.shareRepo(repoID, userID) :
            ServerRelay.unshareRepo(repoID, userID)

        await Promise.all([
            rpcClient.setUserPermissionsAsync({ repoID, username, puller, pusher, admin }),
            sharePromise
        ])

        const [admins, pushers, pullers] = await Promise.all([
            rpcClient.getAllUsersOfTypeAsync({ repoID, type: rpcClient.UserType.ADMIN }),
            rpcClient.getAllUsersOfTypeAsync({ repoID, type: rpcClient.UserType.PUSHER }),
            rpcClient.getAllUsersOfTypeAsync({ repoID, type: rpcClient.UserType.PULLER }),
        ])
        return { repoID, admins, pushers, pullers }
    },
})

const fetchLocalRefsLogic = makeLogic<IFetchLocalRefsAction, IFetchLocalRefsSuccessAction>({
    type: RepoActionType.FETCH_LOCAL_REFS,
    async process({ action }) {
        const { uri } = action.payload
        if (uri.type === URIType.Local) {
            const path = uri.repoRoot
            const repoID = getRepoID(uri)
            const refs = (await rpc.getClient().getLocalRefsAsync({ repoID, path })).refs || []

            const localRefs = {} as { [refName: string]: string }
            for (let ref of refs) {
                localRefs[ref.refName] = ref.commitHash
            }
        }

        return { uri, localRefs: {} }
    },
})

const fetchRemoteRefsLogic = makeLogic<IFetchRemoteRefsAction, IFetchRemoteRefsSuccessAction>({
    type: RepoActionType.FETCH_REMOTE_REFS,
    async process({ action }) {
        const { repoID } = action.payload
        const remoteRefs = await rpc.getClient().getAllRemoteRefsAsync(repoID)
        return { repoID, remoteRefs }
    },
})

const checkpointRepoLogic = makeLogic<ICheckpointRepoAction, ICheckpointRepoSuccessAction>({
    type: RepoActionType.CHECKPOINT_REPO,
    async process({ action }, dispatch) {
        const { uri, message } = action.payload
        const repo = getRepo(uri)
        await rpc.getClient().checkpointRepoAsync({ path: repo.path || '', message: message })
        await dispatch(fetchFullRepo({ uri }))
        return {}
    },
})

const getDiffLogic = makeLogic<IGetDiffAction, IGetDiffSuccessAction>({
    type: RepoActionType.GET_DIFF,
    async process({ action }) {
        const { uri, commit } = action.payload
        const repoRoot = (getRepo(uri) || {}).path || ''
        if (repoRoot === undefined) {
            throw new Error(`could not find repo at ${repoRoot}`)
        }

        let diffBlob: string
        try {
            diffBlob = await spawnCmd('git', ['show', commit], repoRoot)
        } catch (err) {
            console.log(`ERROR running git show ${commit} ~>`, err)
            throw err
        }

        const diff = parseDiff(diffBlob)

        return { commit, diff }
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

        const stream = rpc.getClient().cloneRepo({
            repoID: repoID,
            name: name,
            email: emails[0],
        })
        dispatch(cloneRepoProgress({ repoID, fetched: 1, toFetch: 20 }))
        let path = ''
        let success = false
        stream.on('data', async (data: any) => {
            console.log('data: ', data)
            if (data.progress !== undefined) {
                const fetched = data.progress.fetched !== undefined ? data.progress.fetched.toNumber() : 0
                const toFetch = data.progress.toFetch !== undefined ? data.progress.toFetch.toNumber() : 0
                if (fetched / toFetch >= 0.05) {
                    await dispatch(cloneRepoProgress({ repoID, fetched, toFetch }))
                }
            }
            if (data.success !== undefined) {
                path = data.success.path
                success = true
            }
        })
        stream.on('end', async () => {
            if (success) {
                await dispatch(watchRepo({ repoID, path }))
                await dispatch(fetchFullRepo({ repoID, path }))
                const uri = { type: URIType.Local, repoRoot: path } as URI
                selectRepo(uri, RepoPage.Home)
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
        const stream = rpc.getClient().pullRepo({ path: folderPath })
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
    getRepoListLogic,
    fetchFullRepoLogic,
    fetchFullRepoFromServerLogic,

    // desktop-specific
    updateUserPermissionsLogic,
    createRepoLogic,
    getLocalReposLogic,
    getLocalRepoListLogic,
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