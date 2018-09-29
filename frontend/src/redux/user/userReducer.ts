import { UserActionType, IUserAction } from './userActions'
import { IUser, ISharedRepoInfo } from '../../common'

const initialState = {
    users: {},
    currentUser: undefined,
    error: undefined,
}

export interface IUserState {
    users: { [name: string]: IUser }
    currentUser: string | undefined
    error: Error | undefined
}

const userReducer = (state: IUserState = initialState, action: IUserAction): IUserState => {
    switch (action.type) {
        case UserActionType.LOGIN_SUCCESS:
        case UserActionType.SIGNUP_SUCCESS:
        case UserActionType.CHECK_LOCAL_USER_SUCCESS:
            return {
                ...state,
                currentUser: action.payload.email,
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

        default:
            return state
    }
}

export default userReducer
