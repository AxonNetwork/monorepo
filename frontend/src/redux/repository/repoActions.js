// action types
export const CREATE_REPO = 'CREATE_REPO'
export const CREATE_REPO_SUCCESS = 'CREATE_REPO_SUCCESS'
export const FETCH_REPOS = 'FETCH_REPOS'
export const FETCHED_REPO = 'FETCHED_REPO'
export const SELECT_REPO = 'SELECT_REPO'
export const FETCH_FULL_REPO = 'FETCH_FULL_REPO'
export const FETCHED_FULL_REPO = 'FETCHED_FULL_REPO'
export const FETCHED_FILES = 'FETCHED_FILES'
export const FETCHED_FILE = 'FETCHED_FILE'
export const REMOVED_FILE = 'REMOVED_FILE'
export const FETCHED_TIMELINE = 'FETCHED_TIMELINE'
export const CHECKPOINT_REPO = 'CHECKPOINT_REPO'
export const CHECKPOINT_REPO_SUCCESS = 'CHECKPOINT_REPO_SUCCESS'
export const PULL_REPO = 'PULL_REPO'
export const BEHIND_REMOTE = 'BEHIND_REMOTE'
export const SELECT_FILE = 'SELECT_FILE'
export const UNSELECT_FILE = 'UNSELECT_FILE'
export const WATCH_REPO = 'WATCH_REPO'
export const REPO_WATCHER_ADDED = 'REPO_WATCHER_ADDED'
export const ADD_COLLABORATOR = 'ADD_COLLABORATOR'
export const ADD_COLLABORATOR_SUCCESS = 'ADD_COLLABORATOR_SUCCESS'
export const ADD_HYPOTHESIS = 'ADD_HYPOTHESIS'
export const GET_DIFF = 'GET_DIFF'
export const GET_DIFF_SUCCESS = 'GET_DIFF_SUCCESS'
export const REVERT_FILES = 'REVERT_FILES'
export const REVERT_FILES_SUCCESS = 'REVERT_FILES_SUCCESS'

export const actionTypes = {
    CREATE_REPO,
    CREATE_REPO_SUCCESS,
    FETCH_REPOS,
    FETCHED_REPO,
    SELECT_REPO,
    FETCH_FULL_REPO,
    FETCHED_FULL_REPO,
    FETCHED_FILES,
    FETCHED_FILE,
    REMOVED_FILE,
    FETCHED_TIMELINE,
    WATCH_REPO,
    CHECKPOINT_REPO,
    CHECKPOINT_REPO_SUCCESS,
    PULL_REPO,
    BEHIND_REMOTE,
    SELECT_FILE,
    UNSELECT_FILE,
    REPO_WATCHER_ADDED,
    ADD_COLLABORATOR,
    ADD_COLLABORATOR_SUCCESS,
    ADD_HYPOTHESIS,
    GET_DIFF,
    GET_DIFF_SUCCESS,
    REVERT_FILES,
    REVERT_FILES_SUCCESS,
}

// action creators
export const createRepo = (repoID) => ({ type: CREATE_REPO, repoID })
export const fetchRepos = () => ({ type: FETCH_REPOS })
export const selectRepo = (repo) => ({ type: SELECT_REPO, repo })
export const checkpointRepo = (folderPath, repoID, message) => ({ type: CHECKPOINT_REPO, folderPath, repoID, message })
export const pullRepo = (folderPath, repoID) => ({ type: PULL_REPO, folderPath, repoID })
export const selectFile = (file, isFolder) => ({ type: SELECT_FILE, file, isFolder })
export const unselectFile = () => ({ type: UNSELECT_FILE })
export const addCollaborator = (folderPath, repoID, email) => ({ type: ADD_COLLABORATOR, folderPath, repoID, email })
export const addHypothesis = (folderPath, hypothesis) => ({ type: ADD_HYPOTHESIS, folderPath, hypothesis })
export const getDiff = (folderPath, filename, commit) => ({ type: GET_DIFF, folderPath, filename, commit })
export const revertFiles = (folderPath, files, commit) => ({ type: REVERT_FILES, folderPath, files, commit })

export const actionCreators = {
    createRepo,
    fetchRepos,
    selectRepo,
    checkpointRepo,
    pullRepo,
    selectFile,
    unselectFile,
    addCollaborator,
    addHypothesis,
    getDiff,
    revertFiles,
}
