import { NAVIGATE_NEW_REPO, NAVIGATE_SETTINGS } from './navigationActions'
import { SELECT_REPO } from '../repository/repoActions'

const initialState = {
    currentPage: 'new'
}

const navigationReducer = (state = initialState, action) => {
    switch(action.type){
        case NAVIGATE_NEW_REPO:
            return {
                ...state,
                currentPage: 'new'
            }
        case NAVIGATE_SETTINGS:
            return {
                ...state,
                currentPage: 'settings'
            }
        case SELECT_REPO:
            return {
                ...state,
                currentPage: 'repo'
            }
        default:
            return state
    }
}

export default navigationReducer
