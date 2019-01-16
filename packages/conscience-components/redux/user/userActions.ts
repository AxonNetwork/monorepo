import { FailedAction } from '../reduxUtils'
import { IUser, IUserSettings, IUserProfile, IUploadedPicture } from 'conscience-lib/common'

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

    FETCH_USER_DATA_BY_EMAIL = 'FETCH_USER_DATA_BY_EMAIL',
    FETCH_USER_DATA_BY_EMAIL_SUCCESS = 'FETCH_USER_DATA_BY_EMAIL_SUCCESS',
    FETCH_USER_DATA_BY_EMAIL_FAILED = 'FETCH_USER_DATA_BY_EMAIL_FAILED',

    FETCH_USER_DATA_BY_USERNAME = 'FETCH_USER_DATA_BY_USERNAME',
    FETCH_USER_DATA_BY_USERNAME_SUCCESS = 'FETCH_USER_DATA_BY_USERNAME_SUCCESS',
    FETCH_USER_DATA_BY_USERNAME_FAILED = 'FETCH_USER_DATA_BY_USERNAME_FAILED',

    SAW_COMMENT = 'SAW_COMMENT',
    SAW_COMMENT_SUCCESS = 'SAW_COMMENT_SUCCESS',
    SAW_COMMENT_FAILED = 'SAW_COMMENT_FAILED',

    GET_USER_SETTINGS = 'GET_USER_SETTINGS',
    GET_USER_SETTINGS_SUCCESS = 'GET_USER_SETTINGS_SUCCESS',
    GET_USER_SETTINGS_FAILED = 'GET_USER_SETTINGS_FAILED',

    UPDATE_USER_SETTINGS = 'UPDATE_USER_SETTINGS',
    UPDATE_USER_SETTINGS_SUCCESS = 'UPDATE_USER_SETTINGS_SUCCESS',
    UPDATE_USER_SETTINGS_FAILED = 'UPDATE_USER_SETTINGS_FAILED',

    UPLOAD_USER_PICTURE = 'UPLOAD_USER_PICTURE',
    UPLOAD_USER_PICTURE_SUCCESS = 'UPLOAD_USER_PICTURE_SUCCESS',
    UPLOAD_USER_PICTURE_FAILED = 'UPLOAD_USER_PICTURE_FAILED',

    MODIFY_USER_EMAIL = 'MODIFY_USER_EMAIL',
    MODIFY_USER_EMAIL_SUCCESS = 'MODIFY_USER_EMAIL_SUCCESS',
    MODIFY_USER_EMAIL_FAILED = 'MODIFY_USER_EMAIL_FAILED',

    UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE',
    UPDATE_USER_PROFILE_SUCCESS = 'UPDATE_USER_PROFILE_SUCCESS',
    UPDATE_USER_PROFILE_FAILED = 'UPDATE_USER_PROFILE_FAILED',

    FETCH_USER_ORGS = 'FETCH_USER_ORGS',
    FETCH_USER_ORGS_SUCCESS = 'FETCH_USER_ORGS_SUCCESS',
    FETCH_USER_ORGS_FAILED = 'FETCH_USER_ORGS_FAILED',

    ADDED_ORG = 'ADDED_ORG',
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
        picture: IUploadedPicture | null
        orgs: string[]
        profile: IUserProfile | null
    }
}

export type IWhoAmIFailedAction = FailedAction<UserActionType.WHO_AM_I_FAILED>

export interface ILoginAction {
    type: UserActionType.LOGIN
    payload: {
        email: string
        password: string,
    }
}

export interface ILoginSuccessAction {
    type: UserActionType.LOGIN_SUCCESS
    payload: {
        userID: string
        emails: string[]
        name: string
        username: string
        picture: IUploadedPicture | null
        orgs: string[]
        profile: IUserProfile | null
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
        name: string
        username: string
        picture: null
        orgs: string[]
        profile: null
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

export interface IFetchUserDataByEmailAction {
    type: UserActionType.FETCH_USER_DATA_BY_EMAIL
    payload: {
        emails: string[],
    }
}

export interface IFetchUserDataByEmailSuccessAction {
    type: UserActionType.FETCH_USER_DATA_BY_EMAIL_SUCCESS
    payload: {
        users: { [userID: string]: IUser },
        usersByEmail: { [email: string]: string }, // value is userID
    }
}

export type IFetchUserDataByEmailFailedAction = FailedAction<UserActionType.FETCH_USER_DATA_BY_EMAIL_FAILED>

export interface IFetchUserDataByUsernameAction {
    type: UserActionType.FETCH_USER_DATA_BY_USERNAME
    payload: {
        usernames: string[],
    }
}

export interface IFetchUserDataByUsernameSuccessAction {
    type: UserActionType.FETCH_USER_DATA_BY_USERNAME_SUCCESS
    payload: {
        users: { [userID: string]: IUser },
    }
}

export type IFetchUserDataByUsernameFailedAction = FailedAction<UserActionType.FETCH_USER_DATA_BY_USERNAME_FAILED>

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

export interface IGetUserSettingsAction {
    type: UserActionType.GET_USER_SETTINGS
    payload: {}
}

export interface IGetUserSettingsSuccessAction {
    type: UserActionType.GET_USER_SETTINGS_SUCCESS
    payload: {
        settings: IUserSettings,
    }
}

export type IGetUserSettingsFailedAction = FailedAction<UserActionType.GET_USER_SETTINGS_FAILED>

export interface IUpdateUserSettingsAction {
    type: UserActionType.UPDATE_USER_SETTINGS
    payload: {
        settings: IUserSettings,
    }
}

export interface IUpdateUserSettingsSuccessAction {
    type: UserActionType.UPDATE_USER_SETTINGS_SUCCESS
    payload: {
        settings: IUserSettings,
    }
}

export type IUpdateUserSettingsFailedAction = FailedAction<UserActionType.UPDATE_USER_SETTINGS_FAILED>

export interface IUploadUserPictureAction {
    type: UserActionType.UPLOAD_USER_PICTURE
    payload: {
        userID: string,
        fileInput: any,
    }
}

export interface IUploadUserPictureSuccessAction {
    type: UserActionType.UPLOAD_USER_PICTURE_SUCCESS
    payload: {
        userID: string,
        picture: IUploadedPicture
    }
}

export type IUploadUserPictureFailedAction = FailedAction<UserActionType.UPLOAD_USER_PICTURE_FAILED>

export interface IModifyUserEmailAction {
    type: UserActionType.MODIFY_USER_EMAIL
    payload: {
        userID: string
        email: string
        add: boolean,
    }
}

export interface IModifyUserEmailSuccessAction {
    type: UserActionType.MODIFY_USER_EMAIL_SUCCESS
    payload: {
        userID: string
        email: string
        add: boolean,
    }
}

export type IModifyUserEmailFailedAction = FailedAction<UserActionType.MODIFY_USER_EMAIL_FAILED>

export interface IUpdateUserProfileAction {
    type: UserActionType.UPDATE_USER_PROFILE
    payload: {
        userID: string
        profile: IUserProfile,
    }
}

export interface IUpdateUserProfileSuccessAction {
    type: UserActionType.UPDATE_USER_PROFILE_SUCCESS
    payload: {
        userID: string
        profile: IUserProfile,
    }
}

export type IUpdateUserProfileFailedAction = FailedAction<UserActionType.UPDATE_USER_PROFILE_FAILED>

export interface IFetchUserOrgsAction {
    type: UserActionType.FETCH_USER_ORGS
    payload: {}
}

export interface IFetchUserOrgsSuccessAction {
    type: UserActionType.FETCH_USER_ORGS_SUCCESS
    payload: {
        userID: string
        orgs: string[],
    }
}

export type IFetchUserOrgsFailedAction = FailedAction<UserActionType.FETCH_USER_ORGS_FAILED>

export interface IAddedOrgAction {
    type: UserActionType.ADDED_ORG
    payload: {
        userID: string
        orgID: string,
    }
}

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

    IFetchUserDataByUsernameAction |
    IFetchUserDataByUsernameSuccessAction |
    IFetchUserDataByUsernameFailedAction |

    IFetchUserDataByEmailAction |
    IFetchUserDataByEmailSuccessAction |
    IFetchUserDataByEmailFailedAction |

    ISawCommentAction |
    ISawCommentSuccessAction |
    ISawCommentFailedAction |

    IGetUserSettingsAction |
    IGetUserSettingsSuccessAction |
    IGetUserSettingsFailedAction |

    IUpdateUserSettingsAction |
    IUpdateUserSettingsSuccessAction |
    IUpdateUserSettingsFailedAction |

    IUploadUserPictureAction |
    IUploadUserPictureSuccessAction |
    IUploadUserPictureFailedAction |

    IModifyUserEmailAction |
    IModifyUserEmailSuccessAction |
    IModifyUserEmailFailedAction |

    IUpdateUserProfileAction |
    IUpdateUserProfileSuccessAction |
    IUpdateUserProfileFailedAction |

    IFetchUserOrgsAction |
    IFetchUserOrgsSuccessAction |
    IFetchUserOrgsFailedAction |

    IAddedOrgAction


export const whoami = (payload: IWhoAmIAction['payload']): IWhoAmIAction => ({ type: UserActionType.WHO_AM_I, payload })
export const login = (payload: ILoginAction['payload']): ILoginAction => ({ type: UserActionType.LOGIN, payload })
export const logout = (): ILogoutAction => ({ type: UserActionType.LOGOUT, payload: {} })
export const signup = (payload: ISignupAction['payload']): ISignupAction => ({ type: UserActionType.SIGNUP, payload })

export const fetchUserData = (payload: IFetchUserDataAction['payload']): IFetchUserDataAction => ({ type: UserActionType.FETCH_USER_DATA, payload })
export const fetchUserDataByUsername = (payload: IFetchUserDataByUsernameAction['payload']): IFetchUserDataByUsernameAction => ({ type: UserActionType.FETCH_USER_DATA_BY_USERNAME, payload })
export const fetchUserDataByEmail = (payload: IFetchUserDataByEmailAction['payload']): IFetchUserDataByEmailAction => ({ type: UserActionType.FETCH_USER_DATA_BY_EMAIL, payload })

export const sawComment = (payload: ISawCommentAction['payload']): ISawCommentAction => ({ type: UserActionType.SAW_COMMENT, payload })
export const getUserSettings = (payload: IGetUserSettingsAction['payload']): IGetUserSettingsAction => ({ type: UserActionType.GET_USER_SETTINGS, payload })
export const updateUserSettings = (payload: IUpdateUserSettingsAction['payload']): IUpdateUserSettingsAction => ({ type: UserActionType.UPDATE_USER_SETTINGS, payload })

export const uploadUserPicture = (payload: IUploadUserPictureAction['payload']): IUploadUserPictureAction => ({ type: UserActionType.UPLOAD_USER_PICTURE, payload })
export const modifyUserEmail = (payload: IModifyUserEmailAction['payload']): IModifyUserEmailAction => ({ type: UserActionType.MODIFY_USER_EMAIL, payload })
export const updateUserProfile = (payload: IUpdateUserProfileAction['payload']): IUpdateUserProfileAction => ({ type: UserActionType.UPDATE_USER_PROFILE, payload })

export const fetchUserOrgs = (payload: IFetchUserOrgsAction['payload']): IFetchUserOrgsAction => ({ type: UserActionType.FETCH_USER_ORGS, payload })
export const addedOrg = (payload: IAddedOrgAction['payload']): IAddedOrgAction => ({ type: UserActionType.ADDED_ORG, payload })
