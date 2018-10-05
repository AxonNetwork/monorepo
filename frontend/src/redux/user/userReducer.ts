import { UserActionType, IUserAction } from './userActions'
import { IUser } from '../../common'

const initialState = {
    users: {},
    currentUser: undefined,
    error: undefined,
    codeColorScheme: undefined,
    checkedLocalUser: false
}

export interface IUserState {
    users: {[id: string]: IUser}
    currentUser: string | undefined
    error: Error | undefined
    codeColorScheme: string | undefined
    checkedLocalUser: boolean
}

const userReducer = (state: IUserState = initialState, action: IUserAction): IUserState => {
    switch (action.type) {
        case UserActionType.LOGIN_SUCCESS:
        case UserActionType.SIGNUP_SUCCESS:
        case UserActionType.CHECK_LOCAL_USER_SUCCESS:
            const { email, name } = action.payload
            const user = state.users[email]
            return {
                ...state,
                users:{
                    ...state.users,
                    [email]: {
                        email:email,
                        name:name,
                        repos: user !== undefined ? user.repos : [],
                        sharedRepos: user !== undefined ? user.sharedRepos : {}
                    }
                },
                currentUser: email,
                checkedLocalUser: true
            }

        case UserActionType.CHECK_LOCAL_USER_FAILED:
            return{
                ...state,
                checkedLocalUser: true
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
            const { email, sharedRepos } = action.payload
            return {
                ...state,
                users: {
                    ...state.users,
                    [email]: {
                        ...(state.users[email] || {}),
                        sharedRepos,
                    },
                },
            }
        }

        case UserActionType.IGNORE_SHARED_REPO_SUCCESS: {
            const { repoID, email } = action.payload
            if (email === undefined) { return state }
            return {
                ...state,
                users: {
                    ...state.users,
                    [email]: {
                        ...(state.users[email] || {}),
                        sharedRepos: {
                            ...((state.users[email] || {}).sharedRepos || {}),
                            [repoID]: { repoID, ignored: true },
                        },
                    },
                },
            }
        }

        case UserActionType.READ_LOCAL_CONFIG_SUCCESS: {
            const { config } = action.payload
            return {
                ...state,
                codeColorScheme: config.codeColorScheme,
            }
        }

        case UserActionType.SET_CODE_COLOR_SCHEME_SUCCESS: {
            const { codeColorScheme } = action.payload
            return {
                ...state,
                codeColorScheme,
            }
        }

        case UserActionType.LOGOUT_SUCCESS: {
            return {
                ...state,
                currentUser: undefined
            }
        }

        default:
            return state
    }
}

export default userReducer
