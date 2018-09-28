import { makeLogic } from '../reduxUtils'
import { createLogic } from 'redux-logic'
import { ILocalRepo } from '../../common'
import { RepoActionType,
    // IFetchFullRepoAction,
    ICreateRepoAction,
    ICreateRepoSuccessAction,
    IGetLocalReposAction,
    IGetLocalReposSuccessAction,
    ISelectRepoAction,
    ISelectRepoSuccessAction,
    selectRepo, fetchedRepo, fetchFullRepo, watchRepo, fetchedFiles, fetchedTimeline, setIsBehindRemote } from './repoActions'
import { FETCH_SHARED_REPOS } from '../sharedRepos/sharedReposActions'
import { GET_DISCUSSIONS } from '../discussion/discussionActions'
import UserData from '../../lib/UserData'
import ConscienceRelay from '../../lib/ConscienceRelay'
import ServerRelay from '../../lib/ServerRelay'
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
    }
})

const getLocalReposLogic = makeLogic<IGetLocalReposAction, IGetLocalReposSuccessAction>({
    type: RepoActionType.GET_LOCAL_REPOS,
    async process({ action }, dispatch) {
        const rpcClient = rpc.initClient()
        const repoList: ILocalRepo[] = await rpcClient.getLocalReposAsync()
        let repos = {} as {[path: string]: ILocalRepo}

        for (let repo of repoList) {
            // await dispatch(fetchedRepo({ repo }))
            // @@TODO: make sure we're not already watching a given repo
            dispatch(watchRepo({ repoID: repo.repoID, folderPath: repo.path }))
            repos[repo.path] = repo
        }

        // @@TODO: not a good place for this.  put it in the component or in a wrapper action.
        if (repoList.length > 0) {
            const { repoID, path } = repoList[0]
            await dispatch(selectRepo({ repoID, path }))
        }
        // @@TODO: not a good place for this.  put it in the component or in a wrapper action.
        // await dispatch({ type: FETCH_SHARED_REPOS })

        return { repos }
    }
})

const selectRepoLogic = makeLogic<ISelectRepoAction, ISelectRepoSuccessAction>({
    type: RepoActionType.SELECT_REPO,
    async process({ getState, action }, dispatch) {
        const { repoID, path } = action.payload
        if (getState().repository.repos[repoID] === undefined) {
            await dispatch(fetchFullRepo({ repoID, folderPath: path }))
        }
        return {}
    }
})

const fetchFullRepoLogic = createLogic({
    type: RepoActionType.FETCH_FULL_REPO,
    async process({ getState, action }, dispatch, done) {
        const repo = await ConscienceRelay.fetchRepo(action.repoID, action.folderPath)
        const sharedUsers = await ServerRelay.getSharedUsers(repo.repoID)

        repo.sharedUsers = (sharedUsers || []).map(user => user.name || user.email)
        dispatch({
            type: GET_DISCUSSIONS,
            repoID: repo.repoID,
        })
        await dispatch(fetchedRepo({ repo }))
        done()
    }
})

const checkpointRepoLogic = createLogic({
    type: RepoActionType.CHECKPOINT_REPO,
    async process({ getState, action }, dispatch, done) {
        const [err, version] = await to(ConscienceRelay.checkpointRepo(action.folderPath, action.message))
        if (err) {
            done(err)
            return
        }
        await dispatch(fetchFullRepo({ repoID: action.repoID, folderPath: action.folderPath }))
        done()
    }
})

const getDiffLogic = createLogic({
    type: RepoActionType.GET_DIFF,
    async process({ getState, action }, dispatch, done) {
        const diff = await ConscienceRelay.getDiff(action.folderPath, action.filename, action.commit)
        const { folderPath, filename, commit } = action
        await dispatch(getDiffSuccess({ diff, folderPath, filename, commit }))
        done()
    }
})

const revertFilesLogic = createLogic({
    type: RepoActionType.REVERT_FILES,
    async process({ getState, action }, dispatch, done) {
        const [success, err] = await to(ConscienceRelay.revertFiles(action.folderPath, action.files, action.commit))
        if (err) {
            done(err)
            return
        }
        await dispatch(revertFilesSuccess({ folderPath: action.folderPath, filename: action.filename }))
        done()
    }
})

const pullRepoLogic = createLogic({
    type: RepoActionType.PULL_REPO,
    async process({ getState, action }, dispatch, done) {
        await ConscienceRelay.pullRepo(action.folderPath)
        await dispatch(fetchFullRepo({ folderPath: action.folderPath, repoID: action.repoID }))
        done()
    }
})

const addCollaboratorLogic = createLogic({
    type: RepoActionType.ADD_COLLABORATOR,
    async process({ getState, action }, dispatch, done) {
        console.log(action)
        const response = await ServerRelay.shareRepo(action.repoID, action.email)
        if (response.status === 200) {
            const { folderPath, repoID, email } = action
            await dispatch(addCollaboratorSuccess({ folderPath, repoID, email }))
        }
        done()
    }
})

const watchRepoLogic = createLogic({
    type: RepoActionType.WATCH_REPO,
    warnTimeout: 0,
    async process({ getState, action }, dispatch, done) {
        // @@TODO: we need a way to tear this down probably
        const watcher = await ConscienceRelay.watchRepo(action.repoID, action.folderPath)
        watcher.on('file_change', (files, timeline) => {
            dispatch(fetchedFiles({ folderPath: action.folderPath, files }))
            dispatch(fetchedTimeline({ folderPath: action.folderPath, timeline }))
        })
        watcher.on('behind_remote', () => {
            dispatch(setIsBehindRemote({ folderPath: action.folderPath }))
        })
        done()
    }
})

export default [
    createRepoLogic,
    getLocalReposLogic,
    selectRepoLogic,
    fetchFullRepoLogic,
    checkpointRepoLogic,
    pullRepoLogic,
    getDiffLogic,
    revertFilesLogic,
    addCollaboratorLogic,
    watchRepoLogic,
]