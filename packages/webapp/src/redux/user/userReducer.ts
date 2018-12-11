import { IUser } from 'conscience-lib/common'
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
}

export interface IUserState {
    users: {[userID: string]: IUser}
    usersByEmail: {[email: string]: string} // value is userID

    currentUser: string | undefined
    checkedLoggedIn: boolean

    userSettings: {
        codeColorScheme: string | undefined
        menuLabelsHidden: boolean
        fileExtensionsHidden: boolean
        newestViewedCommentTimestamp: {
            [repoID: string]: {
                [discussionID: string]: number
            },
        },
    }
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
                checkedLoggedIn: true,
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

        case UserActionType.SAW_COMMENT_SUCCESS: {
            const { repoID, discussionID, commentTimestamp } = action.payload
            return {
                ...state,
                userSettings: {
                    ...state.userSettings,
                    newestViewedCommentTimestamp: {
                        ...state.userSettings.newestViewedCommentTimestamp,
                        [repoID]: {
                            ...(state.userSettings.newestViewedCommentTimestamp[repoID] || {}),
                            [discussionID]: commentTimestamp,
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