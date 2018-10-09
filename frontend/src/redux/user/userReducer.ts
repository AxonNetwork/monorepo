import { UserActionType, IUserAction } from './userActions'
import { IUser, ISharedRepoInfo } from '../../common'

const initialState = {
    users: {},
    currentUser: undefined,
    error: undefined,
    sharedRepos: {},
    codeColorScheme: undefined,
    menuLabelsHidden: undefined,
    checkedLocalUser: false,
    newestViewedCommentTimestamp: {},
}

export interface IUserState {
    users: {[id: string]: IUser}
    currentUser: string | undefined
    error: Error | undefined
    sharedRepos: {[repoID: string]: ISharedRepoInfo}
    codeColorScheme: string | undefined
    menuLabelsHidden: boolean | undefined
    checkedLocalUser: boolean
    newestViewedCommentTimestamp: {
        [repoID: string]: {
            [discussionID: number]: number,
        },
    }
}

const userReducer = (state: IUserState = initialState, action: IUserAction): IUserState => {
    switch (action.type) {
        case UserActionType.LOGIN_SUCCESS:
        case UserActionType.SIGNUP_SUCCESS:
        case UserActionType.CHECK_LOCAL_USER_SUCCESS:
            const { email, name } = action.payload
            const user = state.users[email] || {
                email,
                name,
                repos: [],
            }
            return {
                ...state,
                users: {
                    ...state.users,
                    [email]: user,
                },
                currentUser: email,
                checkedLocalUser: true,
            }

        case UserActionType.CHECK_LOCAL_USER_FAILED:
            return{
                ...state,
                checkedLocalUser: true,
            }

        case UserActionType.FETCH_USER_DATA_SUCCESS:
            return {
                ...state,
                users: {
                    ...state.users,
                    ...action.payload.users,
                },
            }

        case UserActionType.LOGIN_FAILED:
        case UserActionType.SIGNUP_FAILED:
            return {
                ...state,
                error: action.payload,
                currentUser: undefined,
            }

        case UserActionType.FETCH_SHARED_REPOS_SUCCESS: {
            const { sharedRepos } = action.payload
            return {
                ...state,
                sharedRepos,
            }
        }

        case UserActionType.IGNORE_SHARED_REPO_SUCCESS: {
            const { repoID } = action.payload
            return {
                ...state,
                sharedRepos: {
                    [repoID]: { repoID, ignored: true},
                },
            }
        }

        case UserActionType.READ_LOCAL_CONFIG_SUCCESS: {
            const { config } = action.payload
            return {
                ...state,
                codeColorScheme: config.codeColorScheme,
                menuLabelsHidden: config.menuLabelsHidden,
                newestViewedCommentTimestamp: config.newestViewedCommentTimestamp || {},
            }
        }

        case UserActionType.SET_CODE_COLOR_SCHEME_SUCCESS: {
            const { codeColorScheme } = action.payload
            return {
                ...state,
                codeColorScheme,
            }
        }

        case UserActionType.HIDE_MENU_LABELS_SUCCESS: {
            const { menuLabelsHidden } = action.payload
            return {
                ...state,
                menuLabelsHidden,
            }
        }

        case UserActionType.LOGOUT_SUCCESS: {
            return {
                ...state,
                currentUser: undefined,
            }
        }

        case UserActionType.SAW_COMMENT: {
            const { repoID, discussionID, commentID } = action.payload
            // If repoID/discussionID/commentID are null, it indicates that no actual update needs to occur.
            if (repoID === null) {
                return state
            }
            return {
                ...state,
                newestViewedCommentTimestamp: {
                    ...state.newestViewedCommentTimestamp,
                    [repoID]: {
                        ...(state.newestViewedCommentTimestamp[repoID] || {}),
                        [discussionID]: commentID,
                    },
                },
            }
        }

        default:
            return state
    }
}

export default userReducer
