// action types
export const FETCH_SHARED_REPOS = 'FETCH_SHARED_REPOS'
export const GOT_SHARED_REPO = 'GOT_SHARED_REPO'
export const ADD_SHARED_REPO = 'ADD_SHARED_REPO'
export const ADD_SHARED_REPO_SUCCESS = 'ADD_SHARED_REPO_SUCCESS'
export const IGNORE_REPO = 'IGNORE_REPO'

export const actionTypes = {
    FETCH_SHARED_REPOS,
    GOT_SHARED_REPO,
    ADD_SHARED_REPO,
    ADD_SHARED_REPO_SUCCESS,
    IGNORE_REPO
}

// action creators
export const addSharedRepo = (repoID) => ({ type: ADD_SHARED_REPO, repoID: repoID})
export const ignoreRepo = (repoID) => ({ type: IGNORE_REPO, repoID: repoID})

export const actionCreators = {
    addSharedRepo,
    ignoreRepo
}