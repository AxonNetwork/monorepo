import { UserActionType, IUserAction } from '../user/userActions'
import { RepoActionType, IRepoAction } from '../repo/repoActions'
import { OrgActionType, IOrgAction } from '../org/orgActions'
import { UIActionType, IUIAction } from './uiActions'
import { uriToString } from 'conscience-lib/utils'
import { URI } from 'conscience-lib/common'

const initialState = {
    loginLoading: false,
    createRepoLoading: false,
    importRepoLoading: false,
    initRepoError: undefined,
    checkpointLoading: false,
    checkpointError: undefined,
    pullLoading: false,
    updateOrgLoading: false,
    pullRepoProgressByURI: {},
    pullRepoErrorByURI: {},
    cloneRepoProgressByID: {},
    cloneRepoErrorByID: {},
    updatingUserPermissions: undefined,

    fileDetailsSidebarURI: undefined,
    fileDetailsSidebarOpen: false,
}

export interface IUIState {
    loginLoading: boolean
    createRepoLoading: boolean
    importRepoLoading: boolean
    initRepoError: Error | undefined
    checkpointLoading: boolean
    checkpointError: Error | undefined
    pullLoading: boolean
    updateOrgLoading: boolean
    pullRepoProgressByURI: {
        [uri: string]: {
            fetched: number
            toFetch: number
        } | undefined
    }
    pullRepoErrorByURI: {
        [uri: string]: Error | undefined
    }
    cloneRepoProgressByID: {
        [repoID: string]: {
            fetched: number
            toFetch: number
        } | undefined
    }
    cloneRepoErrorByID: {
        [repoID: string]: Error | undefined
    }
    updatingUserPermissions: string | undefined

    fileDetailsSidebarURI: URI | undefined
    fileDetailsSidebarOpen: boolean
}

const uiReducer = (state: IUIState = initialState, action: IUIAction | IUserAction | IRepoAction | IOrgAction): IUIState => {
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

        case RepoActionType.INIT_REPO: {
            const { path } = action.payload
            return {
                ...state,
                createRepoLoading: path === undefined,
                importRepoLoading: path !== undefined,
                initRepoError: undefined,
            }
        }

        case RepoActionType.INIT_REPO_SUCCESS:
            console.log(action)
            return {
                ...state,
                createRepoLoading: false,
                importRepoLoading: false,
            }

        case RepoActionType.INIT_REPO_FAILED: {
            const { error } = action.payload
            return {
                ...state,
                createRepoLoading: false,
                importRepoLoading: false,
                initRepoError: error,
            }
        }

        case UIActionType.CLEAR_INIT_REPO_ERROR:
            return {
                ...state,
                initRepoError: undefined
            }

        case RepoActionType.CHECKPOINT_REPO:
            return {
                ...state,
                checkpointLoading: true
            }

        case RepoActionType.CHECKPOINT_REPO_SUCCESS:
            return {
                ...state,
                checkpointLoading: false
            }

        case RepoActionType.CHECKPOINT_REPO_FAILED:
            return {
                ...state,
                checkpointLoading: false,
                checkpointError: action.payload.error
            }

        case UIActionType.CLEAR_CHECKPOINT_REPO_ERROR:
            return {
                ...state,
                checkpointError: undefined
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

        case RepoActionType.PULL_REPO_FAILED: {
            const { error, original } = action.payload
            const uriStr = uriToString(original.payload.uri)
            return {
                ...state,
                pullRepoProgressByURI: {
                    ...state.pullRepoProgressByURI,
                    [uriStr]: undefined
                },
                pullRepoErrorByURI: {
                    ...state.pullRepoErrorByURI,
                    [uriStr]: error
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

        case UIActionType.CLEAR_PULL_REPO_ERROR: {
            const uriStr = uriToString(action.payload.uri)
            return {
                ...state,
                pullRepoErrorByURI: {
                    ...state.pullRepoErrorByURI,
                    [uriStr]: undefined
                }
            }
        }

        case RepoActionType.CLONE_REPO_PROGRESS: {
            const { repoID, fetched, toFetch } = action.payload
            return {
                ...state,
                cloneRepoProgressByID: {
                    ...state.cloneRepoProgressByID,
                    [repoID]: {
                        fetched: fetched,
                        toFetch: toFetch,
                    }
                }
            }
        }

        case RepoActionType.CLONE_REPO_FAILED: {
            const { error, original } = action.payload
            const repoID = original.payload.uri.repoID
            return {
                ...state,
                cloneRepoProgressByID: {
                    ...state.cloneRepoProgressByID,
                    [repoID]: undefined
                },
                cloneRepoErrorByID: {
                    ...state.cloneRepoErrorByID,
                    [repoID]: error
                }
            }
        }

        case RepoActionType.CLONE_REPO_SUCCESS: {
            const { repoID } = action.payload
            return {
                ...state,
                cloneRepoProgressByID: {
                    ...state.cloneRepoProgressByID,
                    [repoID]: undefined
                }
            }
        }

        case UIActionType.CLEAR_CLONE_REPO_ERROR: {
            const { repoID } = action.payload
            return {
                ...state,
                cloneRepoErrorByID: {
                    ...state.cloneRepoErrorByID,
                    [repoID]: undefined
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

        case UIActionType.SET_FILE_DETAILS_SIDEBAR_URI: {
            return {
                ...state,
                fileDetailsSidebarURI: action.payload.uri,
            }
        }
        case UIActionType.SHOW_FILE_DETAILS_SIDEBAR: {
            return {
                ...state,
                fileDetailsSidebarOpen: action.payload.open
            }
        }
    }

    return state
}

export default uiReducer
