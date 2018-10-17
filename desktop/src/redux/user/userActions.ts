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

    CHECK_LOCAL_USER = 'CHECK_LOCAL_USER',
    CHECK_LOCAL_USER_SUCCESS = 'CHECK_LOCAL_USER_SUCCESS',
    CHECK_LOCAL_USER_FAILED = 'CHECK_LOCAL_USER_FAILED',

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

    CLONE_SHARED_REPO = 'CLONE_SHARED_REPO',
    CLONE_SHARED_REPO_SUCCESS = 'CLONE_SHARED_REPO_SUCCESS',
    CLONE_SHARED_REPO_FAILED = 'CLONE_SHARED_REPO_FAILED',

    IGNORE_SHARED_REPO = 'IGNORE_SHARED_REPO',
    IGNORE_SHARED_REPO_SUCCESS = 'IGNORE_SHARED_REPO_SUCCESS',
    IGNORE_SHARED_REPO_FAILED = 'IGNORE_SHARED_REPO_FAILED',

    SAW_COMMENT = 'SAW_COMMENT',
    SAW_COMMENT_SUCCESS = 'SAW_COMMENT_SUCCESS',
    SAW_COMMENT_FAILED = 'SAW_COMMENT_FAILED',

    READ_LOCAL_CONFIG = 'READ_LOCAL_CONFIG',
    READ_LOCAL_CONFIG_SUCCESS = 'READ_LOCAL_CONFIG_SUCCESS',
    READ_LOCAL_CONFIG_FAILED = 'READ_LOCAL_CONFIG_FAILED',

    SET_CODE_COLOR_SCHEME = 'SET_CODE_COLOR_SCHEME',
    SET_CODE_COLOR_SCHEME_SUCCESS = 'SET_CODE_COLOR_SCHEME_SUCCESS',
    SET_CODE_COLOR_SCHEME_FAILED = 'SET_CODE_COLOR_SCHEME_FAILED',

    HIDE_MENU_LABELS = 'HIDE_MENU_LABELS',
    HIDE_MENU_LABELS_SUCCESS = 'HIDE_MENU_LABELS_SUCCESS',
    HIDE_MENU_LABELS_FAILED = 'HIDE_MENU_LABELS_FAILED',

    UPLOAD_USER_PICTURE = 'UPLOAD_USER_PICTURE',
    UPLOAD_USER_PICTURE_SUCCESS = 'UPLOAD_USER_PICTURE_SUCCESS',
    UPLOAD_USER_PICTURE_FAILED = 'UPLOAD_USER_PICTURE_FAILED',

    MODIFY_USER_EMAIL = 'MODIFY_USER_EMAIL',
    MODIFY_USER_EMAIL_SUCCESS = 'MODIFY_USER_EMAIL_SUCCESS',
    MODIFY_USER_EMAIL_FAILED = 'MODIFY_USER_EMAIL_FAILED',
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
        usersByEmail: { [email: string]: string} // value is userID
    }
}

export type IFetchUserDataByEmailFailedAction = FailedAction<UserActionType.FETCH_USER_DATA_BY_EMAIL_FAILED>


export interface ICheckLocalUserAction {
    type: UserActionType.CHECK_LOCAL_USER
    payload: {}
}

export interface ICheckLocalUserSuccessAction {
    type: UserActionType.CHECK_LOCAL_USER_SUCCESS
    payload: {
        userID: string
        emails: string[]
        name: string
        username: string
        picture: string
    }
}

export type ICheckLocalUserFailedAction = FailedAction<UserActionType.CHECK_LOCAL_USER_FAILED>

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
        picture: string
    }
}

export type ICheckNodeUserFailedAction = FailedAction<UserActionType.CHECK_NODE_USER_FAILED>

export interface IGotNodeUsernameAction {
    type: UserActionType.GOT_NODE_USERNAME
    payload: {
        username: string
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

export interface ICloneSharedRepoAction {
    type: UserActionType.CLONE_SHARED_REPO
    payload: {
        repoID: string,
    }
}

export interface ICloneSharedRepoSuccessAction {
    type: UserActionType.CLONE_SHARED_REPO_SUCCESS
    payload: {}
}

export type ICloneSharedRepoFailedAction = FailedAction<UserActionType.CLONE_SHARED_REPO_FAILED>

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

export interface ISetCodeColorSchemeAction {
    type: UserActionType.SET_CODE_COLOR_SCHEME
    payload: {
        codeColorScheme: string,
    }
}

export interface ISetCodeColorSchemeSuccessAction {
    type: UserActionType.SET_CODE_COLOR_SCHEME_SUCCESS
    payload: {
        codeColorScheme: string,
    }
}

export type ISetCodeColorSchemeFailedAction = FailedAction<UserActionType.SET_CODE_COLOR_SCHEME_FAILED>

export interface IHideMenuLabelsAction {
    type: UserActionType.HIDE_MENU_LABELS
    payload: {
        menuLabelsHidden: boolean,
    }
}

export interface IHideMenuLabelsSuccessAction {
    type: UserActionType.HIDE_MENU_LABELS_SUCCESS
    payload: {
        menuLabelsHidden: boolean,
    }
}

export type IHideMenuLabelsFailedAction = FailedAction<UserActionType.HIDE_MENU_LABELS_FAILED>

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
        repoID: string | null
        discussionID: string | null
        commentTimestamp: number | null,
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

    ICheckLocalUserAction |
    ICheckLocalUserSuccessAction |
    ICheckLocalUserFailedAction |

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

    ICloneSharedRepoAction |
    ICloneSharedRepoSuccessAction |
    ICloneSharedRepoFailedAction |

    IIgnoreSharedRepoAction |
    IIgnoreSharedRepoSuccessAction |
    IIgnoreSharedRepoFailedAction |

    IReadLocalConfigAction |
    IReadLocalConfigSuccessAction |
    IReadLocalConfigFailedAction |

    ISetCodeColorSchemeAction |
    ISetCodeColorSchemeSuccessAction |
    ISetCodeColorSchemeFailedAction |

    IHideMenuLabelsAction |
    IHideMenuLabelsSuccessAction |
    IHideMenuLabelsFailedAction |

    ISawCommentAction |
    ISawCommentSuccessAction |
    ISawCommentFailedAction |

    IUploadUserPictureAction |
    IUploadUserPictureSuccessAction |
    IUploadUserPictureFailedAction |

    IModifyUserEmailAction |
    IModifyUserEmailSuccessAction |
    IModifyUserEmailFailedAction

export const login = (payload: ILoginAction['payload']): ILoginAction => ({ type: UserActionType.LOGIN, payload })
export const logout = (): ILogoutAction => ({ type: UserActionType.LOGOUT, payload: {} })
export const signup = (payload: ISignupAction['payload']): ISignupAction => ({ type: UserActionType.SIGNUP, payload })
export const fetchUserData = (payload: IFetchUserDataAction['payload']): IFetchUserDataAction => ({ type: UserActionType.FETCH_USER_DATA, payload })
export const fetchUserDataByEmail = (payload: IFetchUserDataByEmailAction['payload']): IFetchUserDataByEmailAction => ({ type: UserActionType.FETCH_USER_DATA_BY_EMAIL, payload })
export const checkLocalUser = () => ({ type: UserActionType.CHECK_LOCAL_USER, payload: {}})
export const checkNodeUser = () => ({ type: UserActionType.CHECK_NODE_USER, payload: {}})
export const gotNodeUsername = (payload: IGotNodeUsernameAction['payload']) => ({ type: UserActionType.GOT_NODE_USERNAME, payload})
export const checkBalanceAndHitFaucet = () => ({ type: UserActionType.CHECK_BALANCE_AND_HIT_FAUCET, payload: {}})

export const getSharedRepos = (payload: IGetSharedReposAction['payload']): IGetSharedReposAction => ({ type: UserActionType.FETCH_SHARED_REPOS, payload })
export const cloneSharedRepo = (payload: ICloneSharedRepoAction['payload']): ICloneSharedRepoAction => ({ type: UserActionType.CLONE_SHARED_REPO, payload })
export const ignoreSharedRepo = (payload: IIgnoreSharedRepoAction['payload']): IIgnoreSharedRepoAction => ({ type: UserActionType.IGNORE_SHARED_REPO, payload })

export const readLocalConfig = (payload: IReadLocalConfigAction['payload'] = {}): IReadLocalConfigAction => ({ type: UserActionType.READ_LOCAL_CONFIG, payload })
export const setCodeColorScheme = (payload: ISetCodeColorSchemeAction['payload']): ISetCodeColorSchemeAction => ({ type: UserActionType.SET_CODE_COLOR_SCHEME, payload })
export const hideMenuLabels = (payload: IHideMenuLabelsAction['payload']): IHideMenuLabelsAction => ({ type: UserActionType.HIDE_MENU_LABELS, payload })

export const sawComment = (payload: ISawCommentAction['payload']): ISawCommentAction => ({ type: UserActionType.SAW_COMMENT, payload })

export const uploadUserPicture = (payload: IUploadUserPictureAction['payload']): IUploadUserPictureAction => ({ type: UserActionType.UPLOAD_USER_PICTURE, payload })
export const modifyUserEmail = (payload: IModifyUserEmailAction['payload']): IModifyUserEmailAction => ({ type: UserActionType.MODIFY_USER_EMAIL, payload })

