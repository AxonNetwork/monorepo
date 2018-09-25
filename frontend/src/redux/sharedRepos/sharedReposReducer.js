import { GOT_SHARED_REPO, ADD_SHARED_REPO_SUCCESS, IGNORE_REPO } from './sharedReposActions'

const initialState = []

const sharedRepos = (state = initialState, action) => {
    switch(action.type){
        case GOT_SHARED_REPO:
            return [
                ...state,
                action.repo
            ]
        case ADD_SHARED_REPO_SUCCESS:
            const index = state.findIndex(repo => repo.repoID === action.repo.repoID)
            return[
                ...state.slice(0, index),
                ...state.slice(index+1)
            ]
        case IGNORE_REPO:
            const newState = state.map((repo)=>{
                if(repo.key === action.key){
                    repo.ignore = true
                }
                return repo
            })
            return newState
        default:
            return state
    }
}

export default sharedRepos
