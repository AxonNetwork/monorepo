// action types
export const LOGIN = 'LOGIN'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILED = 'LOGIN_FAILED'
export const SIGNUP = 'SIGNUP'
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS'
export const SIGNUP_FAILED = 'SIGNUP_FAILED'
export const FETCH_USER_DATA = 'FETCH_USER_DATA'
export const FETCH_USER_DATA_SUCCESS = 'FETCH_USER_DATA_SUCCESS'
export const LOGOUT = 'LOGOUT'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const FETCHED_OTHER_USER_INFO = 'FETCHED_OTHER_USER_INFO'

export const actionTypes = {
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    SIGNUP,
    SIGNUP_SUCCESS,
    SIGNUP_FAILED,
    FETCH_USER_DATA,
    FETCH_USER_DATA_SUCCESS,
    LOGOUT,
    LOGOUT_SUCCESS,
    FETCHED_OTHER_USER_INFO
}

// action creators
export const login = (email, password) => ({ type: LOGIN, email: email, password: password})
export const logout = () => ({ type: LOGOUT})
export const signup = (name, email, password) => ({ type: SIGNUP, name: name, email: email, password: password})
export const fetchUserData = () => ({ type: FETCH_USER_DATA})

export const actionCreators = {
    login,
    logout,
    signup,
    fetchUserData
}