import { createLogic } from 'redux-logic'
import { RepoActionType, createRepoSuccess, selectRepo, fetchedRepo, fetchFullRepo, watchRepo, getDiffSuccess, revertFilesSuccess, addCollaboratorSuccess, fetchedFiles, fetchedTimeline, setIsBehindRemote } from './repoActions'
import { FETCH_SHARED_REPOS } from '../sharedRepos/sharedReposActions'
import { GET_DISCUSSIONS } from '../discussion/discussionActions'
import UserData from '../../lib/UserData'
import ConscienceRelay from '../../lib/ConscienceRelay'
import ServerRelay from '../../lib/ServerRelay'
import to from 'await-to-js'

const createRepoLogic = createLogic({
    type: RepoActionType.CREATE_REPO,
    async process({ getState, action }, dispatch, done) {
        const repo = await ConscienceRelay.createRepo(action.repoID, UserData.conscienceLocation)
        await ServerRelay.createRepo(repo.repoID)
        await dispatch(createRepoSuccess({ repo }))
        await dispatch(selectRepo({ repo }))
        done()
      }
})

const fetchReposLogic = createLogic({
    type: RepoActionType.FETCH_REPOS,
    async process({ getState, action }, dispatch, done) {
        const repos = (await ConscienceRelay.getRepos()) || []
        repos.forEach(async (repo) => {
            await dispatch(fetchedRepo({ repo }))
            await dispatch(watchRepo({ repoID: repo.repoID, folderPath: repo.folderPath }))
        })
        if (repos.length > 0) {
            await dispatch(selectRepo({ repo: repos[0] }))
        }
        await dispatch({ type: FETCH_SHARED_REPOS })
        done()
    }
})

const selectRepoLogic = createLogic({
    type: RepoActionType.SELECT_REPO,
    async process({ getState, action }, dispatch, done) {
        let repo = action.repo
        if (repo !== undefined) {
          await dispatch(fetchFullRepo({ repoID: repo.repoID, folderPath: repo.folderPath }))
        }
        done()
    }
})

const fetchFullRepoLogic = createLogic({
    type: RepoActionType.FETCH_FULL_REPO,
    async process({ getState, action }, dispatch, done) {
        // @@TODO: maybe don't use `to` here, not much benefit
        let [repoErr, repo] = await to(ConscienceRelay.fetchRepo(action.repoID, action.folderPath))
        let [userErr, sharedUsers] = await to(ServerRelay.getSharedUsers(repo.repoID))
        // @@TODO: use `done(err)`?
        if (repoErr) {
            throw repoErr
        } else if (userErr) {
            throw userErr
        }

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
    fetchReposLogic,
    selectRepoLogic,
    fetchFullRepoLogic,
    checkpointRepoLogic,
    pullRepoLogic,
    getDiffLogic,
    revertFilesLogic,
    addCollaboratorLogic,
    watchRepoLogic,
]