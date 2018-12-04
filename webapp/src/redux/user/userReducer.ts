import { UserActionType, IUserAction } from './userActions'

const initialState = {}

export interface IUserState {}

const userReducer = (state: IUserState = initialState, action: IUserAction): IUserState => {
	switch(action.type) {

		case UserActionType.LOGIN_SUCCESS: {
			return state
		}

		default:
			return state
	}
}

export default userReducer