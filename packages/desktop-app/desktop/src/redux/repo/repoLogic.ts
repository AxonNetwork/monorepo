import keyBy from 'lodash/keyBy'
import union from 'lodash/union'
import once from 'lodash/once'
import { makeLogic, makeContinuousLogic } from 'conscience-components/redux/reduxUtils'
import {
    IRepoMetadata, IRepoFile, ITimelineEvent,
    ISecuredTextInfo, RepoPage, URI, LocalURI, URIType
} from 'conscience-lib/common'
import {
    RepoActionType,
    IInitRepoAction, IInitRepoSuccessAction,
    IGetLocalRepoListAction, IGetLocalRepoListSuccessAction,
    IFetchRepoMetadataAction, IFetchRepoMetadataSuccessAction,
    IFetchRepoFilesAction, IFetchRepoFilesSuccessAction,
    IFetchRepoTimelineAction, IFetchRepoTimelineSuccessAction,
    IBringTimelineUpToDateAction, IBringTimelineUpToDateSuccessAction,
    IFetchRepoTimelineEventAction, IFetchRepoTimelineEventSuccessAction,
    IFetchSecuredFileInfoAction, IFetchSecuredFileInfoSuccessAction,
    IFetchIsBehindRemoteAction, IFetchIsBehindRemoteSuccessAction,
    IFetchRepoUsersPermissionsAction, IFetchRepoUsersPermissionsSuccessAction,
    IFetchLocalRefsAction, IFetchLocalRefsSuccessAction,
    IFetchRemoteRefsAction, IFetchRemoteRefsSuccessAction,
    IGetDiffAction, IGetDiffSuccessAction,
    ISetRepoPublicAction, ISetRepoPublicSuccessAction,
    IUpdateUserPermissionsAction, IUpdateUserPermissionsSuccessAction,
    ISetFilesChunkingAction, ISetFilesChunkingSuccessAction,
    ICheckpointRepoAction, ICheckpointRepoSuccessAction,
    ICloneRepoAction,
    IPullRepoAction,
    IInitNodeWatcherAction,
    IWatchRepoAction,
    cloneRepoProgress, cloneRepoSuccess, cloneRepoFailed,
    pullRepoProgress, pullRepoSuccess, pullRepoFailed,
    fetchIsBehindRemote, addRepoToRepoList, bringTimelineUpToDate,
    markRepoFilesDirty, watchRepo,
} from 'conscience-components/redux/repo/repoActions'
import {
    getRepoListLogic,
} from 'conscience-components/redux/repo/repoLogic'
import { fetchUserDataByUsername } from 'conscience-components/redux/user/userActions'
import { addRepoToOrg } from 'conscience-components/redux/org/orgActions'
import { getRepoID } from 'conscience-components/env-specific'
import { selectRepo } from 'conscience-components/navigation'
import ServerRelay from 'conscience-lib/ServerRelay'
import * as rpc from 'conscience-lib/rpc'

import LocalCache from 'lib/LocalCache'
import RepoWatcher from 'lib/RepoWatcher'
import { parseDiff, uriToString, retry } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'


const initRepoLogic = makeLogic<IInitRepoAction, IInitRepoSuccessAction>({
    type: RepoActionType.INIT_REPO,
    async process({ action, getState }, dispatch) {
        const { repoID, path, orgID } = action.payload
        const state = getState()
        const { name, emails } = state.user.users[state.user.currentUser || '']

        let initPath = ''
        let shouldImport = false
        try {
            const resp = await rpc.getClient().initRepoAsync({
                repoID: repoID,
                path: path,
                name: name,
                email: emails[0],
            })
            initPath = resp.path
        } catch (err) {
            if (path === undefined) {
                if (err.details === 'repoID already registered') {
                    return new Error("This repoID is already taken. Please choose a new ID.")
                } else {
                    return new Error(`Something went wrong while creating "${repoID}`)
                }
            }
            shouldImport = true
        }
        if (shouldImport && path !== undefined) {
            try {
                await rpc.getClient().trackLocalRepoAsync({ repoPath: path, forceReload: true })
                initPath = path
            } catch (err) {
                return new Error("This repoID is already taken. Please choose a new ID.")
            }
        }
        if (initPath === '') {
            // should never reach this
            throw new Error("Failed to init repo")
        }

        await rpc.getClient().setUserPermissionsAsync({ repoID, username: 'conscience-node', puller: true, pusher: true, admin: true })

        await ServerRelay.createRepo(repoID)

        if (orgID && orgID.length > 0) {
            await dispatch(addRepoToOrg({ orgID, repoID }))
        }

        const uri = { type: URIType.Local, repoRoot: initPath } as URI
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

const fetchRepoMetadataLogic = makeLogic<IFetchRepoMetadataAction, IFetchRepoMetadataSuccessAction>({
    type: RepoActionType.FETCH_REPO_METADATA,
    async process({ action }, dispatch) {
        const { repoList = [] } = action.payload
        let metadataByURI = {} as { [uri: string]: IRepoMetadata | null }
        if (repoList.length === 0) {
            return { metadataByURI }

        } else if (repoList[repoList.length - 1].type === URIType.Local) {
            const promises = repoList.map(uri => LocalCache.loadMetadata(uri as LocalURI))
            const metadataList = await Promise.all(promises)

            for (let i = 0; i < metadataList.length; i++) {
                const uriStr = uriToString(repoList[i])
                metadataByURI[uriStr] = metadataList[i]
            }
            await Promise.all(repoList.map(uri => dispatch(watchRepo({ uri }))))
        } else {
            const repoIDs = repoList.map(id => getRepoID(id))
            const metadataList = await ServerRelay.getRepoMetadata(repoIDs)

            for (let i = 0; i < metadataList.length; i++) {
                const metadata = metadataList[i]
                const uri = { repoID: metadata.repoID, type: URIType.Network } as URI
                const uriStr = uriToString(uri)
                metadataByURI[uriStr] = metadata.isNull ? null : metadata as IRepoMetadata
            }
        }

        return { metadataByURI }
    },
})

const fetchRepoFilesLogic = makeLogic<IFetchRepoFilesAction, IFetchRepoFilesSuccessAction>({
    type: RepoActionType.FETCH_REPO_FILES,
    async process({ action }) {
        const { uri } = action.payload

        let files = {} as { [name: string]: IRepoFile }
        if (uri.type === URIType.Local) {
            const { repoRoot, commit = 'working' } = uri

            let params = (commit === 'HEAD' || commit === 'working')
                ? { repoRoot, commitRef: commit }
                : { repoRoot, commitHash: Buffer.from(commit, 'hex') }

            const filesListRaw = (await rpc.getClient().getRepoFilesAsync(params)).files || []

            const filesList = filesListRaw
                .filter(file => file && file.name)
                .map(file => {
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
                        status: file.unstagedStatus,
                        mergeConflict: file.mergeConflict,
                        mergeUnresolved: file.mergeUnresolved,
                    } as IRepoFile
                })
            files = keyBy(filesList, 'name')
            return { uri, files }
        } else {
            const repoID = getRepoID(uri)
            files = await ServerRelay.getRepoFiles(repoID)
        }

        return { uri, files }
    },
})

const fetchRepoTimelineLogic = makeLogic<IFetchRepoTimelineAction, IFetchRepoTimelineSuccessAction>({
    type: RepoActionType.FETCH_REPO_TIMELINE,
    async process({ action }) {
        const { uri, lastCommitFetched, pageSize } = action.payload

        const repoID = getRepoID(uri)
        let timeline = [] as ITimelineEvent[]
        if (uri.type === URIType.Local) {
            const path = uri.repoRoot

            const rpcClient = rpc.getClient()
            const relRef = lastCommitFetched !== undefined ? lastCommitFetched + "~1" : undefined
            const { commits = [], isEnd } = await rpcClient.getRepoHistoryAsync({ path, fromCommitRef: relRef, pageSize, onlyHashes: true })

            const hashes = commits.map(c => c.commitHash)
            timeline = await LocalCache.loadCommits(uri, hashes)
            if (isEnd && timeline.length > 0) {
                timeline[timeline.length - 1].isInitialCommit = true
            }
        } else {
            timeline = await ServerRelay.getRepoTimeline(repoID)
        }

        return { uri, timeline }
    },
})

const bringTimelineUpToDateLogic = makeLogic<IBringTimelineUpToDateAction, IBringTimelineUpToDateSuccessAction>({
    type: RepoActionType.BRING_TIMELINE_UP_TO_DATE,
    async process({ action, getState }) {
        const { uri } = action.payload
        let toPrepend = [] as ITimelineEvent[]
        if (uri.type === URIType.Local) {
            const uriStr = uriToString(uri)
            const currentTimeline = getState().repo.commitListsByURI[uriStr] || []
            const currentHEAD = currentTimeline.length > 0 ? currentTimeline[0] : undefined
            const path = uri.repoRoot
            const { commits = [], isEnd } = await rpc.getClient().getHistoryUpToCommit({ path, pageSize: 5, toCommit: currentHEAD })
            const hashes = commits.map(c => c.commitHash)
            toPrepend = await LocalCache.loadCommits(uri, hashes)
            if (isEnd && toPrepend.length > 0) {
                toPrepend[toPrepend.length - 1].isInitialCommit = true
            }
        }

        return { uri, toPrepend }
    },
})

const fetchRepoTimelineEventLogic = makeLogic<IFetchRepoTimelineEventAction, IFetchRepoTimelineEventSuccessAction>({
    type: RepoActionType.FETCH_REPO_TIMELINE_EVENT,
    async process({ action }) {
        const { uri } = action.payload
        if (uri.commit === undefined) {
            throw new Error("Must specify commit to fetch")
        }
        const commit = uri.commit
        let event: ITimelineEvent
        if (uri.type === URIType.Local) {
            const resp = await LocalCache.loadCommits(uri as LocalURI, [commit])
            event = resp[0]
        } else {
            const repoID = getRepoID(uri)
            event = await ServerRelay.getRepoTimelineEvent(repoID, commit)
        }
        return { event }
    },
})

const fetchSecuredFileInfoLogic = makeLogic<IFetchSecuredFileInfoAction, IFetchSecuredFileInfoSuccessAction>({
    type: RepoActionType.FETCH_SECURED_FILE_INFO,
    async process({ action }) {
        const { uri } = action.payload
        if (uri.filename === undefined) {
            throw new Error("Must specify filename to fetch")
        }
        let securedFileInfo = {} as ISecuredTextInfo
        if (uri.type === URIType.Local) {
            securedFileInfo = await LocalCache.loadSecuredFileInfo(uri)
        } else {
            const repoID = getRepoID(uri)
            securedFileInfo = await ServerRelay.getSecuredFileInfo(repoID, uri.filename || '')
        }
        return { uri, securedFileInfo }
    },
})

const fetchIsBehindRemoteLogic = makeLogic<IFetchIsBehindRemoteAction, IFetchIsBehindRemoteSuccessAction>({
    type: RepoActionType.FETCH_IS_BEHIND_REMOTE,
    async process({ action, getState }) {
        const { uri } = action.payload
        let isBehindRemote = false
        if (uri.type === URIType.Local) {
            const repoID = getRepoID(uri)
            const metadata = (await LocalCache.loadMetadata(uri as LocalURI)) || {}
            const startBlock = metadata.blockNumber || 0
            const { events = [] } = await rpc.getClient().getUpdatedRefEventsAsync({ repoID, startBlock })
            if (events.length === 0) {
                return { uri, isBehindRemote: false }
            }
            const currentRemote = events[events.length - 1].commit
            try {
                const commitHash = Buffer.from(currentRemote, 'hex')
                await rpc.getClient().getRepoHistoryAsync({ path: uri.repoRoot, fromCommitHash: commitHash, pageSize: 1 })
            } catch (err) {
                isBehindRemote = true
            }
        }

        return { uri, isBehindRemote }
    },
})

const fetchRepoUsersPermissionsLogic = makeLogic<IFetchRepoUsersPermissionsAction, IFetchRepoUsersPermissionsSuccessAction>({
    type: RepoActionType.FETCH_REPO_USERS_PERMISSIONS,
    async process({ action }, dispatch) {
        const { uri } = action.payload
        const repoID = getRepoID(uri)
        let permissions = {} as {
            admins: string[]
            pushers: string[]
            pullers: string[]
            isPublic: boolean
        }

        if (uri.type == URIType.Local) {
            const rpcClient = rpc.getClient()
            const [admins, pushers, pullers, isPublicResp] = await Promise.all([
                rpcClient.getAllUsersOfTypeAsync({ repoID, type: rpcClient.UserType.ADMIN }),
                rpcClient.getAllUsersOfTypeAsync({ repoID, type: rpcClient.UserType.PUSHER }),
                rpcClient.getAllUsersOfTypeAsync({ repoID, type: rpcClient.UserType.PULLER }),
                rpcClient.isRepoPublicAsync({ repoID })
            ])
            permissions = { admins, pushers, pullers, isPublic: isPublicResp.isPublic }
        } else {
            permissions = await ServerRelay.getRepoUsersPermissions(repoID)

        }

        const { admins, pushers, pullers, isPublic } = permissions
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

const setFilesChunkingLogic = makeLogic<ISetFilesChunkingAction, ISetFilesChunkingSuccessAction>({
    type: RepoActionType.SET_FILES_CHUNKING,
    async process({ action }) {
        const { uri, shouldChunkByFile } = action.payload
        return { uri, shouldChunkByFile }
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
        } else {
            throw new Error('Cannot checkpoint network repo')
        }
        return { uri }
    },
})

const getDiffLogic = makeLogic<IGetDiffAction, IGetDiffSuccessAction>({
    type: RepoActionType.GET_DIFF,
    async process({ action, getState }) {
        const { uri, commit } = action.payload

        if (getState().repo.diffsByCommitHash[commit]) {
            return
        }

        let diffBlob: string
        if (uri.type === URIType.Local) {
            let params = (commit === 'HEAD' || commit === 'working')
                ? { repoRoot: uri.repoRoot, commitRef: commit }
                : { repoRoot: uri.repoRoot, commitHash: Buffer.from(commit, 'hex') }

            let err = new Error()
            console.log('stack', err.stack)
            const stream = rpc.getClient().getDiff(params)

            diffBlob = await new Promise((resolve, reject) => {
                let diffBlob: string
                stream.on('data', pkt => {
                    if (pkt.end) { return resolve(diffBlob) }
                    diffBlob += pkt.data
                })
                stream.on('error', reject)
            })

        } else {
            diffBlob = await ServerRelay.getDiff({ repoID: uri.repoID, commit })
        }

        const diff = parseDiff(diffBlob)
        return { uri, commit, diff }
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

const initNodeWatcherLogic = makeContinuousLogic<IInitNodeWatcherAction>({
    type: RepoActionType.INIT_NODE_WATCHER,
    async process({ action, getState }, dispatch, done) {
        const nodeWatcher = RepoWatcher.watchNode()
        nodeWatcher.on('added_repo', (evt) => {
            const { repoRoot, repoID } = evt
            dispatch(addRepoToRepoList({ repoRoot, repoID }))
        })
        nodeWatcher.on('error', (err) => {
            console.error('Error in NodeWatcher ~> ', err)
            done()
        })
        nodeWatcher.on('end', () => {
            console.log('listener stopped')
            done()
        })
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
                    dispatch(markRepoFilesDirty({ uri }))
                })
                watcher.on('pulled_repo', (evt) => {
                    dispatch(fetchIsBehindRemote({ uri }))
                    dispatch(bringTimelineUpToDate({ uri }))
                    dispatch(markRepoFilesDirty({ uri }))
                })
                watcher.on('pushed_repo', () => {
                    dispatch(bringTimelineUpToDate({ uri }))
                })
                watcher.on('updated_ref', () => {
                    if (!getState().repo.isBehindRemoteByURI[uriStr]) {
                        dispatch(fetchIsBehindRemote({ uri }))
                    }
                })
                watcher.on('end', () => {
                    done()
                })
            } else {
                done()
            }
        }
    },
})

export default [
    // imported from conscience-components
    getRepoListLogic,

    // desktop-specific
    initRepoLogic,
    getLocalRepoListLogic,
    fetchRepoMetadataLogic,
    fetchRepoFilesLogic,
    fetchRepoTimelineLogic,
    bringTimelineUpToDateLogic,
    fetchRepoTimelineEventLogic,
    fetchSecuredFileInfoLogic,
    fetchIsBehindRemoteLogic,
    fetchRepoUsersPermissionsLogic,
    fetchLocalRefsLogic,
    fetchRemoteRefsLogic,
    checkpointRepoLogic,
    getDiffLogic,
    updateUserPermissionsLogic,
    setFilesChunkingLogic,
    setRepoPublicLogic,
    cloneRepoLogic,
    pullRepoLogic,
    initNodeWatcherLogic,
    watchRepoLogic,
]