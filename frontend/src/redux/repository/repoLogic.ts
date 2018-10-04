import { makeLogic } from '../reduxUtils'
import { keyBy } from 'lodash'
import fileType from 'utils/fileType'
import { ILocalRepo, IRepoFile, ITimelineEvent } from '../../common'
import { RepoActionType,
    ICreateRepoAction, ICreateRepoSuccessAction,
    IGetLocalReposAction, IGetLocalReposSuccessAction,
    IFetchFullRepoAction, IFetchFullRepoSuccessAction,
    IFetchRepoFilesAction, IFetchRepoFilesSuccessAction,
    IFetchRepoTimelineAction, IFetchRepoTimelineSuccessAction,
    IFetchRepoSharedUsersAction, IFetchRepoSharedUsersSuccessAction,
    IFetchLocalRefsAction, IFetchLocalRefsSuccessAction,
    IFetchRemoteRefsAction, IFetchRemoteRefsSuccessAction,
    ISelectRepoAction, ISelectRepoSuccessAction,
    ICheckpointRepoAction, ICheckpointRepoSuccessAction,
    IGetDiffAction, IGetDiffSuccessAction,
    IRevertFilesAction, IRevertFilesSuccessAction,
    IPullRepoAction, IPullRepoSuccessAction,
    IWatchRepoAction, IWatchRepoSuccessAction,
    IAddCollaboratorAction, IAddCollaboratorSuccessAction,
    selectRepo, fetchFullRepo, fetchRepoFiles, fetchRepoTimeline, fetchRepoSharedUsers, fetchLocalRefs, fetchRemoteRefs, watchRepo } from './repoActions'
import { getDiscussions } from '../discussion/discussionActions'
import { getCommentsForRepo } from '../comment/commentActions'
import ConscienceRelay from 'lib/ConscienceRelay'
import ServerRelay from 'lib/ServerRelay'
import RepoWatcher from 'lib/RepoWatcher'
import * as rpc from '../../rpc'


const createRepoLogic = makeLogic<ICreateRepoAction, ICreateRepoSuccessAction>({
    type: RepoActionType.CREATE_REPO,
    async process({ action }, dispatch) {
        const { repoID } = action.payload

        const rpcClient = rpc.initClient()
        const { path } = await rpcClient.initRepoAsync({ repoID: repoID })
        await ServerRelay.createRepo(repoID)

        await dispatch(selectRepo({ repoID, path }))
        return { repoID, path }
    },
})

const getLocalReposLogic = makeLogic<IGetLocalReposAction, IGetLocalReposSuccessAction>({
    type: RepoActionType.GET_LOCAL_REPOS,
    async process(_, dispatch) {
        const rpcClient = rpc.initClient()
        const repoList: ILocalRepo[] = await rpcClient.getLocalReposAsync()
        let repos = {} as {[path: string]: ILocalRepo}

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
    type: RepoActionType.SELECT_REPO,
    async process({ getState, action }, dispatch) {
        const { repoID, path } = action.payload
        // If we don't have this repo in the store, fetch it.  Otherwise, just select it.
        if (!(getState().repository.repos[repoID] || {}).hasBeenFetched) {
            await dispatch(fetchFullRepo({ repoID, path }))
        }
        return { repoID, path }
    },
})

const fetchFullRepoLogic = makeLogic<IFetchFullRepoAction, IFetchFullRepoSuccessAction>({
    type: RepoActionType.FETCH_FULL_REPO,
    async process({ action }, dispatch) {
        const { path, repoID } = action.payload

        dispatch(fetchRepoFiles({ path, repoID }))
        dispatch(fetchRepoTimeline({ path, repoID }))
        dispatch(getCommentsForRepo({ repoID }))
        dispatch(getDiscussions({ repoID }))
        dispatch(fetchRepoSharedUsers({ repoID }))
        dispatch(fetchLocalRefs({ path, repoID }))
        dispatch(fetchRemoteRefs({ repoID }))
        return { path }
    },
})

const fetchRepoFilesLogic = makeLogic<IFetchRepoFilesAction, IFetchRepoFilesSuccessAction>({
    type: RepoActionType.FETCH_REPO_FILES,
    async process({ action }) {
        const { path, repoID } = action.payload

        const rpcClient = rpc.initClient()
        const filesListRaw = (await rpcClient.getRepoFilesAsync({ path, repoID })).files
        const filesList = filesListRaw.map(file=> ({
            name: file.name,
            size: file.size,
            modified: new Date(file.modified*1000),
            type: fileType(file.name),
            status: file.stagedStatus
        } as IRepoFile))
        const files = keyBy(filesList, 'name')

        return { repoID, path, files }
    },
})

const fetchRepoTimelineLogic = makeLogic<IFetchRepoTimelineAction, IFetchRepoTimelineSuccessAction>({
    type: RepoActionType.FETCH_REPO_TIMELINE,
    async process({ action }) {
        const { path, repoID } = action.payload

        const rpcClient = rpc.initClient()
        const history = (await rpcClient.getRepoHistoryAsync({ path, repoID, page: 0}))
        const timeline = history.commits.map(event => ({
            version: 0,
            commit: event.commitHash,
            user: event.author,
            time: new Date(event.timestamp*1000),
            message: event.message,
            files: [], // @@TODO: we can fetch these with `git show --name-only --pretty=format:"" HEAD`
        } as ITimelineEvent))

        return { repoID, path, timeline }
    },
})

const fetchRepoSharedUsersLogic = makeLogic<IFetchRepoSharedUsersAction, IFetchRepoSharedUsersSuccessAction>({
    type: RepoActionType.FETCH_REPO_SHARED_USERS,
    async process({ action }) {
        const { repoID } = action.payload
        const sharedUsers = (await ServerRelay.getSharedUsers(repoID)).map(user => user.email)
        return { repoID, sharedUsers }
    },
})

const fetchLocalRefsLogic = makeLogic<IFetchLocalRefsAction, IFetchLocalRefsSuccessAction>({
    type: RepoActionType.FETCH_LOCAL_REFS,
    async process({ action }) {
        const { repoID, path } = action.payload
        const rpcClient = rpc.initClient()
        const resp = await rpcClient.getLocalRefsAsync({ repoID, path })
        const localRefs = {} as {[refName: string]: string}
        for (let ref of resp.refs) {
            localRefs[ref.refName] = ref.commitHash
        }
        return { path: resp.path, localRefs }
    },
})

const fetchRemoteRefsLogic = makeLogic<IFetchRemoteRefsAction, IFetchRemoteRefsSuccessAction>({
    type: RepoActionType.FETCH_REMOTE_REFS,
    async process({ action }) {
        const { repoID } = action.payload
        const rpcClient = rpc.initClient()
        const remoteRefs = await rpcClient.getAllRemoteRefsAsync(repoID)
        return { repoID, remoteRefs }
    },
})

const checkpointRepoLogic = makeLogic<ICheckpointRepoAction, ICheckpointRepoSuccessAction>({
    type: RepoActionType.CHECKPOINT_REPO,
    async process({ action }, dispatch) {
        const { repoID, folderPath, message } = action.payload
        await ConscienceRelay.checkpointRepo(folderPath, message)
        await dispatch(fetchFullRepo({ repoID, path: folderPath }))
        return {}
    },
})

const getDiffLogic = makeLogic<IGetDiffAction, IGetDiffSuccessAction>({
    type: RepoActionType.GET_DIFF,
    async process({ action }) {
        const { repoRoot, commit } = action.payload
        const diffBlob = await ConscienceRelay.getDiff(repoRoot, commit)

        const lines = diffBlob.split('\n')
        let filename = ''
        let skipLines = 0
        let pastHeader = false
        let diffs = {} as {[filename: string]: string}
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

const revertFilesLogic = makeLogic<IRevertFilesAction, IRevertFilesSuccessAction>({
    type: RepoActionType.REVERT_FILES,
    async process({ action }) {
        const { repoRoot, files, commit } = action.payload
        await ConscienceRelay.revertFiles(repoRoot, files, commit)
        return {}
    },
})

const pullRepoLogic = makeLogic<IPullRepoAction, IPullRepoSuccessAction>({
    type: RepoActionType.PULL_REPO,
    async process({ action }, dispatch) {
        const { folderPath, repoID } = action.payload
        await ConscienceRelay.pullRepo(folderPath)
        await dispatch(fetchFullRepo({ path: folderPath, repoID }))
        return {}
    },
})

const addCollaboratorLogic = makeLogic<IAddCollaboratorAction, IAddCollaboratorSuccessAction>({
    type: RepoActionType.ADD_COLLABORATOR,
    async process({ action }) {
        const { repoID, email, folderPath } = action.payload
        await ServerRelay.shareRepo(repoID, email)
        return { folderPath, repoID, email }
    },
})

const watchRepoLogic = makeLogic<IWatchRepoAction, IWatchRepoSuccessAction>({
    type: RepoActionType.WATCH_REPO,
    async process({ action }) {
        const { repoID, path } = action.payload
        RepoWatcher.watch(repoID, path)
        return {}
    }
})

export default [
    createRepoLogic,
    getLocalReposLogic,
    selectRepoLogic,
    fetchFullRepoLogic,
    fetchRepoFilesLogic,
    fetchRepoTimelineLogic,
    fetchRepoSharedUsersLogic,
    fetchLocalRefsLogic,
    fetchRemoteRefsLogic,
    checkpointRepoLogic,
    getDiffLogic,
    revertFilesLogic,
    pullRepoLogic,
    addCollaboratorLogic,
    watchRepoLogic,
]