import fromPairs from 'lodash/fromPairs'
import { IUser, ISharedRepoInfo, IUserSettings } from 'conscience-lib/common'
import { UserActionType, IUserAction } from './userActions'

export const initialState = {
    users: {},
    usersByEmail: {},
    usersByUsername: {},

    currentUser: undefined,
    checkedLoggedIn: false,

    userSettings: {
        codeColorScheme: 'pojoaque',
        menuLabelsHidden: false,
        fileExtensionsHidden: false,
        manualChunking: false,
        newestViewedCommentTimestamp: {},
    },

    loginError: undefined,

    sharedRepos: {},
}

export interface IUserState {
    users: { [userID: string]: IUser }
    usersByEmail: { [email: string]: string } // value is userID
    usersByUsername: { [username: string]: string } // value is userID

    currentUser: string | undefined
    checkedLoggedIn: boolean

    userSettings: IUserSettings

    loginError: Error | undefined

    sharedRepos: { [repoID: string]: ISharedRepoInfo }
}

const userReducer = (state: IUserState = initialState, action: IUserAction): IUserState => {
    switch (action.type) {
        case UserActionType.WHO_AM_I_SUCCESS:
        case UserActionType.LOGIN_SUCCESS:
        case UserActionType.SIGNUP_SUCCESS: {
            const user = action.payload
            const { userID, emails } = user
            const usersByEmail = fromPairs(emails.map(email => [email, userID]))
            return {
                ...state,
                users: {
                    ...state.users,
                    [userID]: user,
                },
                usersByEmail: {
                    ...state.usersByEmail,
                    ...usersByEmail,
                },
                usersByUsername: {
                    ...state.usersByUsername,
                    [user.username]: userID,
                },
                currentUser: userID,
                checkedLoggedIn: true,
                loginError: undefined,
            }
        }

        case UserActionType.LOGIN_FAILED: {
            return {
                ...state,
                loginError: action.payload.error,
                currentUser: undefined,
            }
        }

        case UserActionType.WHO_AM_I_FAILED: {
            return {
                ...state,
                checkedLoggedIn: true,
            }
        }

        case UserActionType.LOGIN_FAILED:
        case UserActionType.SIGNUP_FAILED: {
            return {
                ...state,
                checkedLoggedIn: true,
                currentUser: undefined,
            }
        }

        case UserActionType.LOGOUT: {
            return {
                ...state,
                currentUser: undefined,
            }
        }

        case UserActionType.FETCH_USER_DATA_SUCCESS:
        case UserActionType.FETCH_USER_DATA_BY_EMAIL_SUCCESS:
        case UserActionType.FETCH_USER_DATA_BY_USERNAME_SUCCESS: {
            const { users } = action.payload
            const usersByEmail = {} as { [email: string]: string }
            const usersByUsername = {} as { [username: string]: string }
            for (let userID of Object.keys(users)) {
                const user = users[userID]
                usersByUsername[user.username] = userID
                for (let email of (user.emails || [])) {
                    usersByEmail[email] = userID
                }
            }

            return {
                ...state,
                users: {
                    ...state.users,
                    ...action.payload.users,
                },
                usersByEmail: {
                    ...state.usersByEmail,
                    ...usersByEmail,
                },
                usersByUsername: {
                    ...state.usersByUsername,
                    ...usersByUsername,
                },
            }
        }

        case UserActionType.SAW_COMMENT_SUCCESS: {
            const { repoID, discussionID, commentTimestamp } = action.payload
            return {
                ...state,
                userSettings: {
                    ...state.userSettings,
                    newestViewedCommentTimestamp: {
                        ...state.userSettings.newestViewedCommentTimestamp,
                        [repoID]: {
                            ...((state.userSettings.newestViewedCommentTimestamp || {})[repoID] || {}),
                            [discussionID]: commentTimestamp,
                        },
                    },
                },
            }
        }

        case UserActionType.GET_USER_SETTINGS_SUCCESS:
        case UserActionType.UPDATE_USER_SETTINGS:
        case UserActionType.UPDATE_USER_SETTINGS_SUCCESS: {
            const { settings } = action.payload
            const updated = {
                codeColorScheme: settings.codeColorScheme !== undefined ? settings.codeColorScheme : state.userSettings.codeColorScheme,
                menuLabelsHidden: settings.menuLabelsHidden !== undefined ? settings.menuLabelsHidden : state.userSettings.menuLabelsHidden,
                fileExtensionsHidden: settings.fileExtensionsHidden !== undefined ? settings.fileExtensionsHidden : state.userSettings.fileExtensionsHidden,
                newestViewedCommentTimestamp: settings.newestViewedCommentTimestamp !== undefined ? settings.newestViewedCommentTimestamp : state.userSettings.newestViewedCommentTimestamp,
            }
            return {
                ...state,
                userSettings: updated,
            }
        }

        case UserActionType.UPLOAD_USER_PICTURE_SUCCESS: {
            const { picture, userID } = action.payload
            return {
                ...state,
                users: {
                    ...state.users,
                    [userID]: {
                        ...(state.users[userID] || {}),
                        picture,
                    },
                },
            }
        }

        case UserActionType.MODIFY_USER_EMAIL_SUCCESS: {
            const { userID, email, add } = action.payload
            return {
                ...state,
                users: {
                    ...state.users,
                    [userID]: {
                        ...(state.users[userID] || {}),
                        emails: add ? ((state.users[userID] || {}).emails || []).concat(email) : ((state.users[userID] || {}).emails || []).filter(x => x !== email),
                    },
                },
            }
        }

        case UserActionType.UPDATE_USER_PROFILE:
        case UserActionType.UPDATE_USER_PROFILE_SUCCESS: {
            const { userID, profile } = action.payload
            return {
                ...state,
                users: {
                    ...state.users,
                    [userID]: {
                        ...(state.users[userID] || {}),
                        profile: profile,
                    },
                },
            }
        }

        case UserActionType.FETCH_USER_ORGS_SUCCESS: {
            const { userID, orgs } = action.payload
            return {
                ...state,
                users: {
                    ...state.users,
                    [userID]: {
                        ...(state.users[userID] || {}),
                        orgs: orgs,
                    },
                },
            }

        }

        default:
            return state
    }
}

export default userReducer