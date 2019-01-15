import { IRepoAction, RepoActionType } from '../repo/repoActions'

const initialState = {
    updatingUserPermissions: undefined
}

export interface IUIState {
    updatingUserPermissions: string | undefined
}

const uiReducer = (state: IUIState = initialState, action: IRepoAction): IUIState => {
    switch (action.type) {

        case RepoActionType.UPDATE_USER_PERMISSIONS: {
            const { username } = action.payload
            return {
                ...state,
                updatingUserPermissions: username
            }
        }

        case RepoActionType.UPDATE_USER_PERMISSIONS_SUCCESS: {
            return {
                ...state,
                updatingUserPermissions: undefined
            }
        }

        default:
            return state
    }
}

export default uiReducer
