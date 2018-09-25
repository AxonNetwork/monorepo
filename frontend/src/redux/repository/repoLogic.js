import { createLogic } from 'redux-logic'
import { CREATE_REPO, CREATE_REPO_SUCCESS, FETCH_REPOS, FETCHED_REPO, SELECT_REPO, FETCH_FULL_REPO,
    FETCHED_FILES, CHECKPOINT_REPO, WATCH_REPO, ADD_COLLABORATOR, ADD_COLLABORATOR_SUCCESS, PULL_REPO, GET_DIFF, GET_DIFF_SUCCESS,
    REVERT_FILES, REVERT_FILES_SUCCESS, FETCHED_TIMELINE, BEHIND_REMOTE } from './repoActions'
import { FETCH_SHARED_REPOS } from '../sharedRepos/sharedReposActions'
import { GET_DISCUSSIONS } from '../discussion/discussionActions'
import UserData from '../../lib/UserData.js'
import ConscienceRelay from '../../lib/ConscienceRelay'
import ServerRelay from '../../lib/ServerRelay'
import to from 'await-to-js'

const createRepo = createLogic({
    type: CREATE_REPO,
    async process({ getState, action }, dispatch, done) {
        const repo = await ConscienceRelay.createRepo(action.repoID, UserData.conscienceLocation)
        await ServerRelay.createRepo(repo.repoID)
        await dispatch({ type: CREATE_REPO_SUCCESS, repo })
        await dispatch({ type: SELECT_REPO, repo })
        done()
      }
})

const fetchRepos = createLogic({
    type: FETCH_REPOS,
    async process({ getState, action }, dispatch, done) {
        const repos = (await ConscienceRelay.getRepos()) || []
        repos.forEach(async function(repo){
            await dispatch({ type: FETCHED_REPO, repo })
            await dispatch({
                type: WATCH_REPO,
                repoID: repo.repoID,
                folderPath: repo.folderPath
            })
        })
        if(repos.length > 0){
            await dispatch({
                type: SELECT_REPO,
                repo: repos[0]
            })
        }
        await dispatch({ type: FETCH_SHARED_REPOS })
        done()
    }
})

const selectRepo = createLogic({
    type: SELECT_REPO,
    async process({ getState, action }, dispatch, done) {
        let repo = action.repo
        if (repo !== undefined){
          await dispatch({
                type: FETCH_FULL_REPO,
                folderPath: repo.folderPath,
                repoID: repo.repoID
            })
        }
        done()
    }
})

const fetchFullRepo = createLogic({
    type: FETCH_FULL_REPO,
    async process({ getState, action }, dispatch, done) {
        let [repoErr, repo] = await to(ConscienceRelay.fetchRepo(action.repoID, action.folderPath))
        let [userErr, sharedUsers] = await to(ServerRelay.getSharedUsers(repo.repoID))
        // Filter out logged in user
        // const userEmail = getState().user.email
        // sharedUsers = (sharedUsers||[]).filter(user=>user.email !== userEmail)
        repo.sharedUsers = (sharedUsers || []).map(user => user.name || user.email)
        dispatch({
            type: GET_DISCUSSIONS,
            repoID: repo.repoID,
        })
        await dispatch({
            type: FETCHED_REPO,
            repo: repo,
        })
        done()
    }
})

const checkpointRepo = createLogic({
    type: CHECKPOINT_REPO,
    async process({ getState, action }, dispatch, done) {
        const [err, version] = await to(ConscienceRelay.checkpointRepo(action.folderPath, action.message))
        if(err){
            done()
        }
        await dispatch({
            type: FETCH_FULL_REPO,
            folderPath: action.folderPath,
            repoID: action.repoID
        })
        done()
    }
})

const getDiff = createLogic({
    type:GET_DIFF,
    async process({ getState, action }, dispatch, done) {
        const diff = await ConscienceRelay.getDiff(action.folderPath, action.filename, action.commit)
        await dispatch({
            type: GET_DIFF_SUCCESS,
            diff: diff,
            folderPath: action.folderPath,
            filename: action.filename,
            commit: action.commit
        })
        done()
    }
})

const revertFiles = createLogic({
    type:REVERT_FILES,
    async process({ getState, action }, dispatch, done) {
        console.log(action)
        const [success, err] = await to(ConscienceRelay.revertFiles(action.folderPath, action.files, action.commit))
        if(err) done()
        await dispatch({
            type: REVERT_FILES_SUCCESS,
            folderPath: action.folderPath,
            filename: action.filename,
        })
        done()
    }
})

const pullRepo = createLogic({
    type:PULL_REPO,
    async process({ getState, action }, dispatch, done) {
        await ConscienceRelay.pullRepo(action.folderPath)
        await dispatch({
            type: FETCH_FULL_REPO,
            folderPath: action.folderPath,
            repoID: action.repoID
        })
        done()
    }
})

const addCollaborator = createLogic({
    type: ADD_COLLABORATOR,
    async process({ getState, action }, dispatch, done) {
        console.log(action)
        const response = await ServerRelay.shareRepo(action.repoID, action.email)
        if(response.status === 200){
            await dispatch({
                type: ADD_COLLABORATOR_SUCCESS,
                folderPath: action.folderPath,
                repoID: action.repoID,
                email: action.email
            })
        }
        done()
    }
})

const watchRepo = createLogic({
    type: WATCH_REPO,
    warnTimeout: 0,
    async process({ getState, action }, dispatch, done) {
        const watcher = await ConscienceRelay.watchRepo(action.repoID, action.folderPath)
        watcher.on('file_change', (files, timeline) =>{
            dispatch({
                type:FETCHED_FILES,
                folderPath: action.folderPath,
                files: files
            })
            dispatch({
                type: FETCHED_TIMELINE,
                folderPath: action.folderPath,
                timeline: timeline
            })
        })
        watcher.on('behind_remote', ()=>{
            dispatch({
                type: BEHIND_REMOTE,
                folderPath: action.folderPath
            })
        })
    }
})

export default [
    createRepo,
    fetchRepos,
    selectRepo,
    fetchFullRepo,
    checkpointRepo,
    pullRepo,
    getDiff,
    revertFiles,
    addCollaborator,
    watchRepo,
]