import { RepoActionType, IRepoAction } from '../repository/repoActions'
import { NavigationActionType, INavigationAction } from './navigationActions'

const initialState = {
    currentPage: 'new',
}

export interface INavigationState {
    currentPage: string
}

const navigationReducer = (state: INavigationState = initialState, action: INavigationAction|IRepoAction): INavigationState => {
    switch(action.type){
        case NavigationActionType.NAVIGATE_NEW_REPO:
            return {
                ...state,
                currentPage: 'new',
            }

        case NavigationActionType.NAVIGATE_SETTINGS:
            return {
                ...state,
                currentPage: 'settings',
            }

        case RepoActionType.SELECT_REPO:
            return {
                ...state,
                currentPage: 'repo',
            }

        default:
            return state
    }
}

export default navigationReducer
