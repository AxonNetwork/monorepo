import { LOGIN_SUCCESS, LOGIN_FAILED, SIGNUP_SUCCESS, SIGNUP_FAILED, FETCH_USER_DATA_SUCCESS, FETCHED_OTHER_USER_INFO } from './userActions'

const initialState = {
    users:{}
}

export interface IUserState {
    name: string
}


const userReducer = (state = initialState, action) => {
    switch(action.type){
        case LOGIN_SUCCESS:
        case SIGNUP_SUCCESS:
        case FETCH_USER_DATA_SUCCESS:
            return{
                ...state,
                ...action.user
            }
        case LOGIN_FAILED:
        case SIGNUP_FAILED:
            return {
                error: action.error
            }
        case FETCHED_OTHER_USER_INFO:
            return{
                ...state,
                users:{
                    ...state.users,
                    [action.user.email]: action.user
                }
            }
        default:
            return state
    }
}

export default userReducer
