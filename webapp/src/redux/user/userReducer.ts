import { IUser } from 'conscience-lib/common'
import { UserActionType, IUserAction } from './userActions'
import { fromPairs } from 'lodash'

const initialState = {
	users: {},
	usersByEmail: {},

	currentUser: undefined,
}

export interface IUserState {
    users: {[userID: string]: IUser}
    usersByEmail: {[email: string]: string} // value is userID

    currentUser: string | undefined
}

const userReducer = (state: IUserState = initialState, action: IUserAction): IUserState => {
	switch(action.type) {
        case UserActionType.WHO_AM_I_SUCCESS:
        case UserActionType.LOGIN_SUCCESS:
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
            }

		default:
			return state
	}
}

export default userReducer