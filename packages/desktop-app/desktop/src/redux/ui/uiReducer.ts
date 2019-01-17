import { UserActionType, IUserAction } from 'conscience-components/redux/user/userActions'
import { RepoActionType, IRepoAction } from 'conscience-components/redux/repo/repoActions'
import { DesktopRepoActionType, IDesktopRepoAction } from '../repo/repoActions'
import { OrgActionType, IOrgAction } from 'conscience-components/redux/org/orgActions'

const initialState = {
    loginLoading: false,
    createRepoLoading: false,
    checkpointLoading: false,
    pullLoading: false,
    updateOrgLoading: false,
    pullRepoProgress: {},
    cloneRepoProgress: {},
    updatingUserPermissions: undefined,
}

export interface IUIState {
    loginLoading: boolean
    createRepoLoading: boolean
    checkpointLoading: boolean
    pullLoading: boolean
    updateOrgLoading: boolean
    pullRepoProgress: {
        [path: string]: {
            fetched: number
            toFetch: number
        } | undefined
    }
    cloneRepoProgress: {
        [repoID: string]: {
            fetched: number
            toFetch: number
        } | undefined
    }
    updatingUserPermissions: string | undefined
}

const uiReducer = (state: IUIState = initialState, action: IUserAction | IRepoAction | IDesktopRepoAction | IOrgAction): IUIState => {
    switch (action.type) {
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

        case DesktopRepoActionType.CREATE_REPO:
            return {
                ...state,
                createRepoLoading: true
            }

        case DesktopRepoActionType.CREATE_REPO_SUCCESS:
        case DesktopRepoActionType.CREATE_REPO_FAILED:
            return {
                ...state,
                createRepoLoading: false
            }

        case DesktopRepoActionType.CHECKPOINT_REPO:
            return {
                ...state,
                checkpointLoading: true
            }

        case DesktopRepoActionType.CHECKPOINT_REPO_SUCCESS:
        case DesktopRepoActionType.CHECKPOINT_REPO_FAILED:
            return {
                ...state,
                checkpointLoading: false
            }

        case DesktopRepoActionType.PULL_REPO_PROGRESS: {
            const { folderPath, fetched, toFetch } = action.payload
            return {
                ...state,
                pullRepoProgress: {
                    ...state.pullRepoProgress,
                    [folderPath]: {
                        fetched: fetched,
                        toFetch: toFetch,
                    }
                }
            }
        }

        case DesktopRepoActionType.PULL_REPO_SUCCESS: {
            const { folderPath } = action.payload
            return {
                ...state,
                pullRepoProgress: {
                    ...state.pullRepoProgress,
                    [folderPath]: undefined
                }
            }
        }

        case DesktopRepoActionType.CLONE_REPO_PROGRESS: {
            const { repoID, fetched, toFetch } = action.payload
            return {
                ...state,
                cloneRepoProgress: {
                    ...state.cloneRepoProgress,
                    [repoID]: {
                        fetched: fetched,
                        toFetch: toFetch,
                    }
                }
            }
        }

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

        case OrgActionType.UPDATE_ORG:
            return {
                ...state,
                updateOrgLoading: true
            }

        case OrgActionType.UPDATE_ORG_SUCCESS:
        case OrgActionType.UPDATE_ORG_FAILED:
            return {
                ...state,
                updateOrgLoading: false
            }
    }

    return state
}

export default uiReducer
