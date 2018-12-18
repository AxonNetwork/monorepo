import { IUser, IUserSettings } from 'conscience-lib/common'
import { UserActionType, IUserAction } from './userActions'
import { fromPairs } from 'lodash'

const initialState = {
	users: {},
	usersByEmail: {},

	currentUser: undefined,
    checkedLoggedIn: false,

    userSettings: {
        codeColorScheme: 'pojoaque',
        menuLabelsHidden: false,
        fileExtensionsHidden: false,
        newestViewedCommentTimestamp: {},
    },

    loginError: undefined,
}

export interface IUserState {
    users: {[userID: string]: IUser}
    usersByEmail: {[email: string]: string} // value is userID

    currentUser: string | undefined
    checkedLoggedIn: boolean

    userSettings: IUserSettings

    loginError: Error | undefined
}

const userReducer = (state: IUserState = initialState, action: IUserAction): IUserState => {
	switch(action.type) {
        case UserActionType.WHO_AM_I_SUCCESS:
        case UserActionType.LOGIN_SUCCESS: {
            const { userID, emails, name, username, picture } = action.payload
            const user = state.users[userID] || {
                userID,
                emails,
                name,
                username,
                picture,
                repos: [],
            }
            const usersByEmail = fromPairs(emails.map(email => [ email, userID ]))
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
                currentUser: userID,
                checkedLoggedIn: true,
            }
        }

        case UserActionType.LOGIN_FAILED: {
            return {
                ...state,
                loginError: action.payload,
                currentUser: undefined,
            }
        }

        case UserActionType.WHO_AM_I_FAILED: {
            return {
                ...state,
                checkedLoggedIn: true,
            }
        }

        case UserActionType.LOGIN_FAILED: {
            return {
                ...state,
                checkedLoggedIn: true,
            }
        }

        case UserActionType.LOGOUT_SUCCESS: {
            return {
                ...state,
                currentUser: undefined
            }
        }

        case UserActionType.FETCH_USER_DATA_SUCCESS: {
            const { users } = action.payload
            const usersByEmail = {} as {[email: string]: string}
            for (let userID of Object.keys(users)) {
                for (let email of (users[userID].emails || [])) {
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
            }
        }

        case UserActionType.SAW_COMMENT: {
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
        case UserActionType.UPDATE_USER_SETTINGS_SUCCESS:{
            const { settings } = action.payload
            const updated = {
                codeColorScheme: settings.codeColorScheme !== undefined ? settings.codeColorScheme : state.userSettings.codeColorScheme,
                menuLabelsHidden: settings.menuLabelsHidden !== undefined ? settings.menuLabelsHidden : state.userSettings.menuLabelsHidden,
                fileExtensionsHidden: settings.fileExtensionsHidden !== undefined ? settings.fileExtensionsHidden : state.userSettings.fileExtensionsHidden,
                newestViewedCommentTimestamp: settings.newestViewedCommentTimestamp !== undefined ? settings.newestViewedCommentTimestamp : state.userSettings.newestViewedCommentTimestamp,
            }
            return {
                ...state,
                userSettings: updated
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

		default:
			return state
	}
}

export default userReducer