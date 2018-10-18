import { UserActionType, IUserAction } from '../user/userActions'
import { RepoActionType, IRepoAction } from '../repository/repoActions'

const initialState = {
    loginLoading: false,
    checkpointLoading: false,
    pullLoading: false,
}

export interface IUIState {
    loginLoading: boolean
    checkpointLoading: boolean
    pullLoading: boolean
}

const uiReducer = (state: IUIState= initialState, action: IUserAction | IRepoAction): IUIState => {
    switch(action.type){
        case UserActionType.SIGNUP:
        case UserActionType.LOGIN:
            return {
                ...state,
                loginLoading: true
            }

        case UserActionType.SIGNUP_SUCCESS:
        case UserActionType.LOGIN_SUCCESS:
        case UserActionType.SIGNUP_FAILED:
        case UserActionType.LOGIN_FAILED:
            return {
                ...state,
                loginLoading: false
            }

        case RepoActionType.CHECKPOINT_REPO:
            return {
                ...state,
                checkpointLoading: true
            }

        case RepoActionType.CHECKPOINT_REPO_SUCCESS:
        case RepoActionType.CHECKPOINT_REPO_FAILED:
            return {
                ...state,
                checkpointLoading: false
            }

        case RepoActionType.PULL_REPO:
            return {
                ...state,
                pullLoading: true
            }

        case RepoActionType.PULL_REPO_SUCCESS:
        case RepoActionType.PULL_REPO_FAILED:
            return {
                ...state,
                pullLoading: false
            }
    }

    return state
}

export default uiReducer
