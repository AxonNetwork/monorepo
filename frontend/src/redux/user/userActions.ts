import { IUser } from '../../common'

export enum UserActionType {
    LOGIN = 'LOGIN',
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAILED = 'LOGIN_FAILED',
    SIGNUP = 'SIGNUP',
    SIGNUP_SUCCESS = 'SIGNUP_SUCCESS',
    SIGNUP_FAILED = 'SIGNUP_FAILED',
    FETCH_USER_DATA = 'FETCH_USER_DATA',
    FETCH_USER_DATA_SUCCESS = 'FETCH_USER_DATA_SUCCESS',
    FETCH_USER_DATA_FAILED = 'FETCH_USER_DATA_FAILED',
    LOGOUT = 'LOGOUT',
    LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',
    LOGOUT_FAILED = 'LOGOUT_FAILED',
    FETCHED_OTHER_USER_INFO = 'FETCHED_OTHER_USER_INFO',
}

export interface ILoginAction {
    type: UserActionType.LOGIN
    payload: {
        email: string
        password: string
    }
}

export interface ILoginSuccessAction {
    type: UserActionType.LOGIN_SUCCESS
    payload: {
        email: string
        name: string
    }
}

export interface ILoginFailedAction {
    type: UserActionType.LOGIN_FAILED
    payload: Error
    error: boolean
}

export interface ILogoutAction {
    type: UserActionType.LOGOUT
    payload: {}
}

export interface ILogoutSuccessAction {
    type: UserActionType.LOGOUT_SUCCESS
    payload: {}
}

export interface ILogoutFailedAction {
    type: UserActionType.LOGOUT_FAILED
    payload: Error
    error: boolean
}

export interface ISignupAction {
    type: UserActionType.SIGNUP
    payload: {
        name: string
        email: string
        password: string
    }
}

export interface ISignupSuccessAction {
    type: UserActionType.SIGNUP_SUCCESS
    payload: {
        name: string
        email: string
    }
}

export interface ISignupFailedAction {
    type: UserActionType.SIGNUP_FAILED
    payload: Error
    error: boolean
}

export interface IFetchUserDataAction {
    type: UserActionType.FETCH_USER_DATA
    payload: {
        emails: string[]
    }
}

export interface IFetchUserDataSuccessAction {
    type: UserActionType.FETCH_USER_DATA_SUCCESS
    payload: {
        users: { [email: string]: IUser }
    }
}

export interface IFetchUserDataFailedAction {
    type: UserActionType.FETCH_USER_DATA_FAILED
    payload: Error
    error: boolean
}

export type IUserAction =
    ILoginAction |
    ILoginSuccessAction |
    ILoginFailedAction |
    ILogoutAction |
    ILogoutSuccessAction |
    ILogoutFailedAction |
    ISignupAction |
    ISignupSuccessAction |
    ISignupFailedAction |
    IFetchUserDataAction |
    IFetchUserDataSuccessAction |
    IFetchUserDataFailedAction

export const login = (payload: ILoginAction['payload']): ILoginAction => ({ type: UserActionType.LOGIN, payload })
export const logout = (): ILogoutAction => ({ type: UserActionType.LOGOUT, payload: {} })
export const signup = (payload: ISignupAction['payload']): ISignupAction => ({ type: UserActionType.SIGNUP, payload })
export const fetchUserData = (payload: IFetchUserDataAction['payload']): IFetchUserDataAction => ({ type: UserActionType.FETCH_USER_DATA, payload })

