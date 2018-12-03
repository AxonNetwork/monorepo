import { IUser, ISharedRepoInfo } from '../../common'
import { FailedAction } from '../reduxUtils'
import { IUserDataContents } from 'lib/UserData'

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

    FETCH_USER_DATA_BY_EMAIL = 'FETCH_USER_DATA_BY_EMAIL',
    FETCH_USER_DATA_BY_EMAIL_SUCCESS = 'FETCH_USER_DATA_BY_EMAIL_SUCCESS',
    FETCH_USER_DATA_BY_EMAIL_FAILED = 'FETCH_USER_DATA_BY_EMAIL_FAILED',

    LOGOUT = 'LOGOUT',
    LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',
    LOGOUT_FAILED = 'LOGOUT_FAILED',

    CHECK_NODE_USER = 'CHECK_NODE_USER',
    CHECK_NODE_USER_SUCCESS = 'CHECK_NODE_USER_SUCCESS',
    CHECK_NODE_USER_FAILED = 'CHECK_NODE_USER_FAILED',
    GOT_NODE_USERNAME = 'GOT_NODE_USERNAME',

    CHECK_BALANCE_AND_HIT_FAUCET = 'CHECK_BALANCE_AND_HIT_FAUCET',
    CHECK_BALANCE_AND_HIT_FAUCET_SUCCESS = 'CHECK_BALANCE_AND_HIT_FAUCET_SUCCESS',
    CHECK_BALANCE_AND_HIT_FAUCET_FAILED = 'CHECK_BALANCE_AND_HIT_FAUCET_FAILED',

    FETCH_SHARED_REPOS = 'FETCH_SHARED_REPOS',
    FETCH_SHARED_REPOS_SUCCESS = 'FETCH_SHARED_REPOS_SUCCESS',
    FETCH_SHARED_REPOS_FAILED = 'FETCH_SHARED_REPOS_FAILED',

    IGNORE_SHARED_REPO = 'IGNORE_SHARED_REPO',
    IGNORE_SHARED_REPO_SUCCESS = 'IGNORE_SHARED_REPO_SUCCESS',
    IGNORE_SHARED_REPO_FAILED = 'IGNORE_SHARED_REPO_FAILED',

    UNSHARE_REPO_FROM_SELF = 'UNSHARE_REPO_FROM_SELF',
    UNSHARE_REPO_FROM_SELF_SUCCESS = 'UNSHARE_REPO_FROM_SELF_SUCCESS',
    UNSHARE_REPO_FROM_SELF_FAILED = 'UNSHARE_REPO_FROM_SELF_FAILED',

    FETCH_ORGS = 'FETCH_ORGS',
    FETCH_ORGS_SUCCESS = 'FETCH_ORGS_SUCCESS',
    FETCH_ORGS_FAILED = 'FETCH_ORGS_FAILED',

    SAW_COMMENT = 'SAW_COMMENT',
    SAW_COMMENT_SUCCESS = 'SAW_COMMENT_SUCCESS',
    SAW_COMMENT_FAILED = 'SAW_COMMENT_FAILED',

    READ_LOCAL_CONFIG = 'READ_LOCAL_CONFIG',
    READ_LOCAL_CONFIG_SUCCESS = 'READ_LOCAL_CONFIG_SUCCESS',
    READ_LOCAL_CONFIG_FAILED = 'READ_LOCAL_CONFIG_FAILED',

    SET_LOCAL_CONFIG = 'SET_LOCAL_CONFIG',
    SET_LOCAL_CONFIG_SUCCESS = 'SET_LOCAL_CONFIG_SUCCESS',
    SET_LOCAL_CONFIG_FAILED = 'SET_LOCAL_CONFIG_FAILED',

    UPLOAD_USER_PICTURE = 'UPLOAD_USER_PICTURE',
    UPLOAD_USER_PICTURE_SUCCESS = 'UPLOAD_USER_PICTURE_SUCCESS',
    UPLOAD_USER_PICTURE_FAILED = 'UPLOAD_USER_PICTURE_FAILED',

    MODIFY_USER_EMAIL = 'MODIFY_USER_EMAIL',
    MODIFY_USER_EMAIL_SUCCESS = 'MODIFY_USER_EMAIL_SUCCESS',
    MODIFY_USER_EMAIL_FAILED = 'MODIFY_USER_EMAIL_FAILED',

    ADDED_ORG = 'ADDED_ORG',
}

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
        picture: string,
    }
}

export type ILoginFailedAction = FailedAction<UserActionType.LOGIN_FAILED>

export interface ILogoutAction {
    type: UserActionType.LOGOUT
    payload: {}
}

export interface ILogoutSuccessAction {
    type: UserActionType.LOGOUT_SUCCESS
    payload: {}
}

export type ILogoutFailedAction = FailedAction<UserActionType.LOGOUT_FAILED>

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
        usersByEmail: { [email: string]: string}, // value is userID
    }
}

export type IFetchUserDataByEmailFailedAction = FailedAction<UserActionType.FETCH_USER_DATA_BY_EMAIL_FAILED>

export interface ICheckNodeUserAction {
    type: UserActionType.CHECK_NODE_USER
    payload: {}
}

export interface ICheckNodeUserSuccessAction {
    type: UserActionType.CHECK_NODE_USER_SUCCESS
    payload: {
        userID: string
        emails: string[]
        name: string
        username: string
        picture: string,
    }
}

export type ICheckNodeUserFailedAction = FailedAction<UserActionType.CHECK_NODE_USER_FAILED>

export interface IGotNodeUsernameAction {
    type: UserActionType.GOT_NODE_USERNAME
    payload: {
        username: string,
    }
}

export interface ICheckBalanceAndHitFaucetAction {
    type: UserActionType.CHECK_BALANCE_AND_HIT_FAUCET
    payload: {}
}

export interface ICheckBalanceAndHitFaucetSuccessAction {
    type: UserActionType.CHECK_BALANCE_AND_HIT_FAUCET_SUCCESS
    payload: {
        balance: number,
    }
}

export type ICheckBalanceAndHitFaucetFailedAction = FailedAction<UserActionType.CHECK_BALANCE_AND_HIT_FAUCET_FAILED>


export interface IGetSharedReposAction {
    type: UserActionType.FETCH_SHARED_REPOS
    payload: {
        userID: string,
    }
}

export interface IGetSharedReposSuccessAction {
    type: UserActionType.FETCH_SHARED_REPOS_SUCCESS
    payload: {
        sharedRepos: {[repoID: string]: ISharedRepoInfo},
    }
}

export type IGetSharedReposFailedAction = FailedAction<UserActionType.FETCH_SHARED_REPOS_FAILED>

export interface IIgnoreSharedRepoAction {
    type: UserActionType.IGNORE_SHARED_REPO
    payload: {
        repoID: string,
    }
}

export interface IIgnoreSharedRepoSuccessAction {
    type: UserActionType.IGNORE_SHARED_REPO_SUCCESS
    payload: {
        repoID: string,
    }
}

export type IIgnoreSharedRepoFailedAction = FailedAction<UserActionType.IGNORE_SHARED_REPO_FAILED>

export interface IUnshareRepoFromSelfAction {
    type: UserActionType.UNSHARE_REPO_FROM_SELF
    payload: {
        repoID: string,
    }
}

export interface IUnshareRepoFromSelfSuccessAction {
    type: UserActionType.UNSHARE_REPO_FROM_SELF_SUCCESS
    payload: {
        repoID: string,
    }
}

export type IUnshareRepoFromSelfFailedAction = FailedAction<UserActionType.UNSHARE_REPO_FROM_SELF_FAILED>

export interface IFetchOrgsAction {
    type: UserActionType.FETCH_ORGS
    payload: {
        userID: string,
    }
}

export interface IFetchOrgsSuccessAction {
    type: UserActionType.FETCH_ORGS_SUCCESS
    payload: {
        userID: string,
        orgs: string[], //orgIDs
    }
}

export type IFetchOrgsFailedAction = FailedAction<UserActionType.FETCH_ORGS_FAILED>

export interface IReadLocalConfigAction {
    type: UserActionType.READ_LOCAL_CONFIG
    payload: {}
}

export interface IReadLocalConfigSuccessAction {
    type: UserActionType.READ_LOCAL_CONFIG_SUCCESS
    payload: {
        config: IUserDataContents,
    }
}

export type IReadLocalConfigFailedAction = FailedAction<UserActionType.READ_LOCAL_CONFIG_FAILED>

export interface ISetLocalConfigAction {
    type: UserActionType.SET_LOCAL_CONFIG
    payload: {
        config: IUserDataContents,
    }
}

export interface ISetLocalConfigSuccessAction {
    type: UserActionType.SET_LOCAL_CONFIG_SUCCESS
    payload: {
        config: IUserDataContents,
    }
}

export type ISetLocalConfigFailedAction = FailedAction<UserActionType.SET_LOCAL_CONFIG_FAILED>

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
        picture: string,
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

export interface IAddedOrgAction {
    type: UserActionType.ADDED_ORG
    payload: {
        userID: string
        orgID: string,
    }
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
    IFetchUserDataFailedAction |

    IFetchUserDataByEmailAction |
    IFetchUserDataByEmailSuccessAction |
    IFetchUserDataByEmailFailedAction |

    ICheckNodeUserAction |
    ICheckNodeUserSuccessAction |
    ICheckNodeUserFailedAction |
    IGotNodeUsernameAction |

    ICheckBalanceAndHitFaucetAction |
    ICheckBalanceAndHitFaucetSuccessAction |
    ICheckBalanceAndHitFaucetFailedAction |

    IGetSharedReposAction |
    IGetSharedReposSuccessAction |
    IGetSharedReposFailedAction |

    IIgnoreSharedRepoAction |
    IIgnoreSharedRepoSuccessAction |
    IIgnoreSharedRepoFailedAction |

    IUnshareRepoFromSelfAction |
    IUnshareRepoFromSelfSuccessAction |
    IUnshareRepoFromSelfFailedAction |

    IFetchOrgsAction |
    IFetchOrgsSuccessAction |
    IFetchOrgsFailedAction |

    IReadLocalConfigAction |
    IReadLocalConfigSuccessAction |
    IReadLocalConfigFailedAction |

    ISetLocalConfigAction |
    ISetLocalConfigSuccessAction |
    ISetLocalConfigFailedAction |

    ISawCommentAction |
    ISawCommentSuccessAction |
    ISawCommentFailedAction |

    IUploadUserPictureAction |
    IUploadUserPictureSuccessAction |
    IUploadUserPictureFailedAction |

    IModifyUserEmailAction |
    IModifyUserEmailSuccessAction |
    IModifyUserEmailFailedAction |

    IAddedOrgAction

export const login = (payload: ILoginAction['payload']): ILoginAction => ({ type: UserActionType.LOGIN, payload })
export const logout = (): ILogoutAction => ({ type: UserActionType.LOGOUT, payload: {} })
export const signup = (payload: ISignupAction['payload']): ISignupAction => ({ type: UserActionType.SIGNUP, payload })
export const fetchUserData = (payload: IFetchUserDataAction['payload']): IFetchUserDataAction => ({ type: UserActionType.FETCH_USER_DATA, payload })
export const fetchUserDataByEmail = (payload: IFetchUserDataByEmailAction['payload']): IFetchUserDataByEmailAction => ({ type: UserActionType.FETCH_USER_DATA_BY_EMAIL, payload })
export const checkNodeUser = () => ({ type: UserActionType.CHECK_NODE_USER, payload: {}})
export const gotNodeUsername = (payload: IGotNodeUsernameAction['payload']) => ({ type: UserActionType.GOT_NODE_USERNAME, payload})
export const checkBalanceAndHitFaucet = () => ({ type: UserActionType.CHECK_BALANCE_AND_HIT_FAUCET, payload: {}})

export const getSharedRepos = (payload: IGetSharedReposAction['payload']): IGetSharedReposAction => ({ type: UserActionType.FETCH_SHARED_REPOS, payload })

export const ignoreSharedRepo = (payload: IIgnoreSharedRepoAction['payload']): IIgnoreSharedRepoAction => ({ type: UserActionType.IGNORE_SHARED_REPO, payload })
export const unshareRepoFromSelf = (payload: IUnshareRepoFromSelfAction['payload']): IUnshareRepoFromSelfAction => ({ type: UserActionType.UNSHARE_REPO_FROM_SELF, payload })

export const fetchOrgs = (payload: IFetchOrgsAction['payload']): IFetchOrgsAction => ({ type: UserActionType.FETCH_ORGS, payload })

export const readLocalConfig = (payload: IReadLocalConfigAction['payload'] = {}): IReadLocalConfigAction => ({ type: UserActionType.READ_LOCAL_CONFIG, payload })
export const setLocalConfig = (payload: ISetLocalConfigAction['payload']): ISetLocalConfigAction => ({ type: UserActionType.SET_LOCAL_CONFIG, payload })

export const sawComment = (payload: ISawCommentAction['payload']): ISawCommentAction => ({ type: UserActionType.SAW_COMMENT, payload })

export const uploadUserPicture = (payload: IUploadUserPictureAction['payload']): IUploadUserPictureAction => ({ type: UserActionType.UPLOAD_USER_PICTURE, payload })
export const modifyUserEmail = (payload: IModifyUserEmailAction['payload']): IModifyUserEmailAction => ({ type: UserActionType.MODIFY_USER_EMAIL, payload })

export const addedOrg = (payload: IAddedOrgAction['payload']): IAddedOrgAction => ({ type: UserActionType.ADDED_ORG, payload })