import { IUser } from 'conscience-lib/common'
import { UserActionType, IUserAction } from './userActions'
import { fromPairs } from 'lodash'

const initialState = {
	users: {},
	usersByEmail: {},

	currentUser: undefined,
    checkedLoggedIn: false,
}

export interface IUserState {
    users: {[userID: string]: IUser}
    usersByEmail: {[email: string]: string} // value is userID

    currentUser: string | undefined
    checkedLoggedIn: boolean,
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

		default:
			return state
	}
}

export default userReducer