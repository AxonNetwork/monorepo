import path from 'path'
import keyBy from 'lodash/keyBy'
import union from 'lodash/union'
import once from 'lodash/once'
import { makeLogic, makeContinuousLogic } from 'conscience-components/redux/reduxUtils'
import { IRepoFile, ITimelineEvent, RepoPage, URI, URIType } from 'conscience-lib/common'
import {
    RepoActionType,
    IGetLocalRepoListAction, IGetLocalRepoListSuccessAction,
    IFetchRepoFilesAction, IFetchRepoFilesSuccessAction,
    IFetchRepoTimelineAction, IFetchRepoTimelineSuccessAction,
    IFetchRepoUsersPermissionsAction, IFetchRepoUsersPermissionsSuccessAction,
    IFetchLocalRefsAction, IFetchLocalRefsSuccessAction,
    IFetchRemoteRefsAction, IFetchRemoteRefsSuccessAction,
    IGetDiffAction, IGetDiffSuccessAction,
    ISetRepoPublicAction, ISetRepoPublicSuccessAction,
    IUpdateUserPermissionsAction, IUpdateUserPermissionsSuccessAction,
    IInitRepoAction, IInitRepoSuccessAction,
    ICheckpointRepoAction, ICheckpointRepoSuccessAction,
    ICloneRepoAction,
    IPullRepoAction,
    IWatchRepoAction,
    cloneRepoProgress, cloneRepoSuccess, cloneRepoFailed,
    pullRepoProgress, pullRepoSuccess, pullRepoFailed,
    fetchFullRepo, fetchRepoFiles, behindRemote,
} from 'conscience-components/redux/repo/repoActions'
import {
    getRepoListLogic,
    fetchFullRepoLogic,
    fetchFullRepoFromServerLogic,
} from 'conscience-components/redux/repo/repoLogic'
import { fetchUserDataByUsername } from 'conscience-components/redux/user/userActions'
import { addRepoToOrg } from 'conscience-components/redux/org/orgActions'
import { getRepoID } from 'conscience-components/env-specific'
import { selectRepo } from 'conscience-components/navigation'
import ServerRelay from 'conscience-lib/ServerRelay'
import * as rpc from 'conscience-lib/rpc'

import RepoWatcher from 'lib/RepoWatcher'
import spawnCmd from 'utils/spawnCmd'
import { parseDiff, uriToString, retry } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'


const initRepoLogic = makeLogic<IInitRepoAction, IInitRepoSuccessAction>({
    type: RepoActionType.INIT_REPO,
    async process({ action, getState }, dispatch) {
        const { repoID, path, orgID } = action.payload
        const state = getState()
        const { name, emails } = state.user.users[state.user.currentUser || '']

        const resp = await rpc.getClient().initRepoAsync({
            repoID: repoID,
            path: path,
            name: name,
            email: emails[0],
        })
        const initPath = resp.path

        await ServerRelay.createRepo(repoID)

        if (orgID && orgID.length > 0) {
            await dispatch(addRepoToOrg({ orgID, repoID }))
        }

        const uri = { type: URIType.Local, repoRoot: initPath } as URI
        await dispatch(fetchFullRepo({ uri }))
        selectRepo(uri, RepoPage.Home)

        return { repoID, path: initPath, orgID }
    },
})

const selectRepoOnce = once((uri: URI) => selectRepo(uri, RepoPage.Home))

const getLocalRepoListLogic = makeLogic<IGetLocalRepoListAction, IGetLocalRepoListSuccessAction>({
    type: RepoActionType.GET_LOCAL_REPO_LIST,
    async process(_, dispatch) {
        const repoList = await retry({ retries: 10, timeout: 200 }, () => rpc.getClient().getLocalReposAsync())

        let localRepos = {} as { [path: string]: string }
        for (let repo of repoList) {
            localRepos[repo.path] = repo.repoID
        }

        // @@TODO: not a good place for this.  put it in the component or in a wrapper action.
        if (repoList.length > 0) {
            const uri = { type: URIType.Local, repoRoot: repoList[0].path } as URI
            selectRepoOnce(uri)
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
        const { uri } = action.payload
        const repoID = getRepoID(uri)
        const rpcClient = rpc.getClient()
        const [admins, pushers, pullers, isPublicResp] = await Promise.all([
            rpcClient.getAllUsersOfTypeAsync({ repoID, type: rpcClient.UserType.ADMIN }),
            rpcClient.getAllUsersOfTypeAsync({ repoID, type: rpcClient.UserType.PUSHER }),
            rpcClient.getAllUsersOfTypeAsync({ repoID, type: rpcClient.UserType.PULLER }),
            rpcClient.isRepoPublicAsync({ repoID })
        ])
        const isPublic = isPublicResp.isPublic

        const usernames = union(admins, pushers, pullers)
        await dispatch(fetchUserDataByUsername({ usernames: usernames }))


        return { repoID, admins, pushers, pullers, isPublic }
    },
})

const setRepoPublicLogic = makeLogic<ISetRepoPublicAction, ISetRepoPublicSuccessAction>({
    type: RepoActionType.SET_REPO_PUBLIC,
    async process({ action }, dispatch) {
        const { repoID, isPublic } = action.payload
        const rpcClient = rpc.getClient()
        await rpcClient.setRepoPublicAsync({ repoID, isPublic })
        return { repoID, isPublic }
    },
})

const updateUserPermissionsLogic = makeLogic<IUpdateUserPermissionsAction, IUpdateUserPermissionsSuccessAction>({
    type: RepoActionType.UPDATE_USER_PERMISSIONS,
    async process({ action, getState }, dispatch) {
        const { uri, username, admin, pusher, puller } = action.payload
        const repoID = getRepoID(uri)
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
        const { uri } = action.payload
        const repoID = getRepoID(uri)
        const remoteRefs = await rpc.getClient().getAllRemoteRefsAsync(repoID)
        return { repoID, remoteRefs }
    },
})

const checkpointRepoLogic = makeLogic<ICheckpointRepoAction, ICheckpointRepoSuccessAction>({
    type: RepoActionType.CHECKPOINT_REPO,
    async process({ action }, dispatch) {
        const { uri, message } = action.payload
        if (uri.type === URIType.Local) {
            await rpc.getClient().checkpointRepoAsync({ path: uri.repoRoot || '', message: message })
            await dispatch(fetchFullRepo({ uri }))
        } else {
            return new Error("Cannot checkpoint network repo")
        }
        return {}
    },
})

const getDiffLogic = makeLogic<IGetDiffAction, IGetDiffSuccessAction>({
    type: RepoActionType.GET_DIFF,
    async process({ action, getState }) {
        const { uri, commit } = action.payload
        let diffBlob: string
        if (uri.type === URIType.Local) {
            try {
                diffBlob = await spawnCmd('git', ['show', commit], uri.repoRoot)
            } catch (err) {
                console.log(`ERROR running git show ${commit} ~>`, err)
                throw err
            }
        } else {
            const state = getState()
            if (state.repo.diffsByCommitHash[commit]) {
                return
            }
            diffBlob = await ServerRelay.getDiff({ repoID: uri.repoID, commit })
        }
        const diff = parseDiff(diffBlob)
        return { commit, diff }
    },
})

const cloneRepoLogic = makeContinuousLogic<ICloneRepoAction>({
    type: RepoActionType.CLONE_REPO,
    async process({ action, getState }, dispatch, done) {
        const { uri } = action.payload
        const repoID = getRepoID(uri)
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
                const uri = { type: URIType.Local, repoRoot: path } as URI
                await dispatch(cloneRepoSuccess({ repoID }))
                await dispatch(fetchFullRepo({ uri }))
                selectRepo(uri, RepoPage.Home)
            }
            done()
        })
        stream.on('error', async (err: any) => {
            await dispatch(cloneRepoFailed({ error: err, original: action }))
        })
    },
})

const pullRepoLogic = makeContinuousLogic<IPullRepoAction>({
    type: RepoActionType.PULL_REPO,
    async process({ action }, dispatch, done) {
        const { uri } = action.payload
        if (uri.type === URIType.Local) {
            const stream = rpc.getClient().pullRepo({ path: uri.repoRoot })
            dispatch(pullRepoProgress({ uri, fetched: 0, toFetch: 0 }))
            stream.on('data', async (data: any) => {
                const toFetch = data.toFetch !== undefined ? data.toFetch.toNumber() : 0
                const fetched = data.fetched !== undefined ? data.fetched.toNumber() : 0
                await dispatch(pullRepoProgress({ uri, fetched, toFetch }))
            })
            stream.on('end', async () => {
                await dispatch(fetchFullRepo({ uri }))
                await dispatch(pullRepoSuccess({ uri }))
                done()
            })
            stream.on('error', async (err: any) => {
                await dispatch(pullRepoFailed({ error: err, original: action }))
                done()
            })
        } else {
            const err = new Error("Cannot pull network repo")
            await dispatch(pullRepoFailed({ error: err, original: action }))
        }
    },
})

const watchRepoLogic = makeContinuousLogic<IWatchRepoAction>({
    type: RepoActionType.WATCH_REPO,
    async process({ action, getState }, dispatch, done) {
        const { uri } = action.payload
        if (uri.type === URIType.Network) {
            done()
        } else {
            const path = uri.repoRoot
            const uriStr = uriToString(uri)
            const repoID = getRepoID(uri)
            const watcher = RepoWatcher.watch(repoID, path) // returns null if the watcher already exists
            if (watcher) {
                watcher.on('file_change', () => {
                    dispatch(fetchRepoFiles({ uri }))
                })
                watcher.on('behind_remote', () => {
                    if (!getState().repo.isBehindRemoteByURI[uriStr]) {
                        dispatch(behindRemote({ uri }))
                    }
                })
                watcher.on('end', () => {
                    done()
                })
            }
        }
    },
})

export default [
    // imported from conscience-components
    getRepoListLogic,
    fetchFullRepoLogic,
    fetchFullRepoFromServerLogic,

    // desktop-specific
    initRepoLogic,
    getLocalRepoListLogic,
    fetchRepoFilesLogic,
    fetchRepoTimelineLogic,
    fetchRepoUsersPermissionsLogic,
    fetchLocalRefsLogic,
    fetchRemoteRefsLogic,
    checkpointRepoLogic,
    getDiffLogic,
    updateUserPermissionsLogic,
    setRepoPublicLogic,
    cloneRepoLogic,
    pullRepoLogic,
    watchRepoLogic,
]