import { NavigationActionType, INavigationAction } from './navigationActions'

const initialState = {
    currentPage: 'welcome',
}

export interface INavigationState {
    currentPage: string
}

const navigationReducer = (state: INavigationState = initialState, action: INavigationAction): INavigationState => {
    switch (action.type) {
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

        default:
            return state
    }
}

export default navigationReducer
