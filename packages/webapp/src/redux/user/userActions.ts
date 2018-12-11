import { FailedAction } from '../reduxUtils'
import { IUser } from 'conscience-lib/common'

export enum UserActionType {
    WHO_AM_I = 'WHO_AM_I',
    WHO_AM_I_SUCCESS = 'WHO_AM_I_SUCCESS',
    WHO_AM_I_FAILED = 'WHO_AM_I_FAILED',

    LOGIN = 'LOGIN',
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAILED = 'LOGIN_FAILED',

    SIGNUP = 'SIGNUP',
    SIGNUP_SUCCESS = 'SIGNUP_SUCCESS',
    SIGNUP_FAILED = 'SIGNUP_FAILED',

    LOGOUT = 'LOGOUT',
    LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',
    LOGOUT_FAILED = 'LOGOUT_FAILED',

    FETCH_USER_DATA = 'FETCH_USER_DATA',
    FETCH_USER_DATA_SUCCESS = 'FETCH_USER_DATA_SUCCESS',
    FETCH_USER_DATA_FAILED = 'FETCH_USER_DATA_FAILED',

    SAW_COMMENT = 'SAW_COMMENT',
    SAW_COMMENT_SUCCESS = 'SAW_COMMENT_SUCCESS',
    SAW_COMMENT_FAILED = 'SAW_COMMENT_FAILED',
}

export interface IWhoAmIAction {
    type: UserActionType.WHO_AM_I
    payload: {}
}

export interface IWhoAmISuccessAction {
    type: UserActionType.WHO_AM_I_SUCCESS
    payload: {
        userID: string
        emails: string[]
        name: string
        username: string
        picture: string,
    }
}

export type IWhoAmIFailedAction = FailedAction<UserActionType.WHO_AM_I_FAILED>

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
        userID: string
        emails: string[]
        name: string
        username: string
        picture: string,
    }
}

export type ILoginFailedAction = FailedAction<UserActionType.LOGIN_FAILED>

export interface ISignupAction {
    type: UserActionType.SIGNUP
    payload: {
        name: string
        username: string
        email: string
        password: string,
    }
}

export interface ISignupSuccessAction {
    type: UserActionType.SIGNUP_SUCCESS
    payload: {
        userID: string
        emails: string[]
        username: string
        name: string
        picture: string | undefined,
    }
}

export type ISignupFailedAction = FailedAction<UserActionType.SIGNUP_FAILED>

export interface ILogoutAction {
    type: UserActionType.LOGOUT
    payload: {}
}

export interface ILogoutSuccessAction {
    type: UserActionType.LOGOUT_SUCCESS
    payload: {}
}

export type ILogoutFailedAction = FailedAction<UserActionType.LOGOUT_FAILED>

export interface IFetchUserDataAction {
    type: UserActionType.FETCH_USER_DATA
    payload: {
        userIDs: string[],
    }
}

export interface IFetchUserDataSuccessAction {
    type: UserActionType.FETCH_USER_DATA_SUCCESS
    payload: {
        users: { [userID: string]: IUser },
    }
}

export type IFetchUserDataFailedAction = FailedAction<UserActionType.FETCH_USER_DATA_FAILED>

export interface ISawCommentAction {
    type: UserActionType.SAW_COMMENT
    payload: {
        repoID: string
        discussionID: string
        commentTimestamp: number,
    }
}

export interface ISawCommentSuccessAction {
    type: UserActionType.SAW_COMMENT_SUCCESS
    payload: {
        repoID: string
        discussionID: string
        commentTimestamp: number,
    }
}

export type ISawCommentFailedAction = FailedAction<UserActionType.SAW_COMMENT_FAILED>

export type IUserAction =
    IWhoAmIAction |
    IWhoAmISuccessAction |
    IWhoAmIFailedAction |

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
    IFetchUserDataFailedAction |

    ISawCommentAction |
    ISawCommentSuccessAction |
    ISawCommentFailedAction

export const whoami = (payload: IWhoAmIAction['payload']): IWhoAmIAction => ({ type: UserActionType.WHO_AM_I, payload })
export const login = (payload: ILoginAction['payload']): ILoginAction => ({ type: UserActionType.LOGIN, payload })
export const logout = (): ILogoutAction => ({ type: UserActionType.LOGOUT, payload: {} })
export const signup = (payload: ISignupAction['payload']): ISignupAction => ({ type: UserActionType.SIGNUP, payload })

export const fetchUserData = (payload: IFetchUserDataAction['payload']): IFetchUserDataAction => ({ type: UserActionType.FETCH_USER_DATA, payload })

export const sawComment = (payload: ISawCommentAction['payload']): ISawCommentAction => ({ type: UserActionType.SAW_COMMENT, payload })
