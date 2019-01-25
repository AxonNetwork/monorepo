import { UserActionType, IUserAction } from '../user/userActions'
import { RepoActionType, IRepoAction } from '../repo/repoActions'
import { OrgActionType, IOrgAction } from '../org/orgActions'
import { uriToString } from 'conscience-lib/utils'

const initialState = {
    loginLoading: false,
    createRepoLoading: false,
    checkpointLoading: false,
    pullLoading: false,
    updateOrgLoading: false,
    pullRepoProgressByURI: {},
    cloneRepoProgress: {},
    updatingUserPermissions: undefined,
}

export interface IUIState {
    loginLoading: boolean
    createRepoLoading: boolean
    checkpointLoading: boolean
    pullLoading: boolean
    updateOrgLoading: boolean
    pullRepoProgressByURI: {
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

const uiReducer = (state: IUIState = initialState, action: IUserAction | IRepoAction | IOrgAction): IUIState => {
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

        case RepoActionType.CREATE_REPO:
            return {
                ...state,
                createRepoLoading: true
            }

        case RepoActionType.CREATE_REPO_SUCCESS:
        case RepoActionType.CREATE_REPO_FAILED:
            return {
                ...state,
                createRepoLoading: false
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

        case RepoActionType.PULL_REPO_PROGRESS: {
            const { uri, fetched, toFetch } = action.payload
            return {
                ...state,
                pullRepoProgressByURI: {
                    ...state.pullRepoProgressByURI,
                    [uriToString(uri)]: {
                        fetched: fetched,
                        toFetch: toFetch,
                    }
                }
            }
        }

        case RepoActionType.PULL_REPO_SUCCESS: {
            const { uri } = action.payload
            return {
                ...state,
                pullRepoProgressByURI: {
                    ...state.pullRepoProgressByURI,
                    [uriToString(uri)]: undefined
                }
            }
        }

        case RepoActionType.CLONE_REPO_PROGRESS: {
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

        case RepoActionType.UPDATE_USER_PERMISSIONS_FAILED:
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
