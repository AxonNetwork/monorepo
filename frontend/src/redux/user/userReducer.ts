import { UserActionType, IUserAction } from './userActions'
import { IUser } from '../../common'

const initialState = {
    users: {},
    currentUser: null,
    error: null,
}

export interface IUserState {
    users: { [name: string]: IUser }
    currentUser: string | null
    error: Error | null
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
                currentUser: null,
            }

        default:
            return state
    }
}

export default userReducer
