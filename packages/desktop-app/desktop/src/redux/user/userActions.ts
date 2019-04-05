import { ISharedRepoInfo, IUploadedPicture, IUserProfile } from 'conscience-lib/common'
import { FailedAction } from 'conscience-components/redux/reduxUtils'
import { IUserDataContents } from 'lib/UserData'
import { IUserAction } from 'conscience-components/redux/user/userActions'
import { AutoUpdateState } from './userReducer'

export enum DesktopUserActionType {
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

    READ_LOCAL_CONFIG = 'READ_LOCAL_CONFIG',
    READ_LOCAL_CONFIG_SUCCESS = 'READ_LOCAL_CONFIG_SUCCESS',
    READ_LOCAL_CONFIG_FAILED = 'READ_LOCAL_CONFIG_FAILED',

    SET_LOCAL_CONFIG = 'SET_LOCAL_CONFIG',
    SET_LOCAL_CONFIG_SUCCESS = 'SET_LOCAL_CONFIG_SUCCESS',
    SET_LOCAL_CONFIG_FAILED = 'SET_LOCAL_CONFIG_FAILED',

    SET_AUTOUPDATE_STATE = 'SET_AUTOUPDATE_STATE',
}

export interface ICheckNodeUserAction {
    type: DesktopUserActionType.CHECK_NODE_USER
    payload: {}
}

export interface ICheckNodeUserSuccessAction {
    type: DesktopUserActionType.CHECK_NODE_USER_SUCCESS
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

export type ICheckNodeUserFailedAction = FailedAction<DesktopUserActionType.CHECK_NODE_USER_FAILED>

export interface IGotNodeUsernameAction {
    type: DesktopUserActionType.GOT_NODE_USERNAME
    payload: {
        username: string,
    }
}

export interface ICheckBalanceAndHitFaucetAction {
    type: DesktopUserActionType.CHECK_BALANCE_AND_HIT_FAUCET
    payload: {}
}

export interface ICheckBalanceAndHitFaucetSuccessAction {
    type: DesktopUserActionType.CHECK_BALANCE_AND_HIT_FAUCET_SUCCESS
    payload: {
        balance: number,
    }
}

export type ICheckBalanceAndHitFaucetFailedAction = FailedAction<DesktopUserActionType.CHECK_BALANCE_AND_HIT_FAUCET_FAILED>


export interface IGetSharedReposAction {
    type: DesktopUserActionType.FETCH_SHARED_REPOS
    payload: {
        userID: string,
    }
}

export interface IGetSharedReposSuccessAction {
    type: DesktopUserActionType.FETCH_SHARED_REPOS_SUCCESS
    payload: {
        sharedRepos: { [repoID: string]: ISharedRepoInfo },
    }
}

export type IGetSharedReposFailedAction = FailedAction<DesktopUserActionType.FETCH_SHARED_REPOS_FAILED>

export interface IIgnoreSharedRepoAction {
    type: DesktopUserActionType.IGNORE_SHARED_REPO
    payload: {
        repoID: string,
    }
}

export interface IIgnoreSharedRepoSuccessAction {
    type: DesktopUserActionType.IGNORE_SHARED_REPO_SUCCESS
    payload: {
        repoID: string,
    }
}

export type IIgnoreSharedRepoFailedAction = FailedAction<DesktopUserActionType.IGNORE_SHARED_REPO_FAILED>

export interface IUnshareRepoFromSelfAction {
    type: DesktopUserActionType.UNSHARE_REPO_FROM_SELF
    payload: {
        repoID: string,
    }
}

export interface IUnshareRepoFromSelfSuccessAction {
    type: DesktopUserActionType.UNSHARE_REPO_FROM_SELF_SUCCESS
    payload: {
        repoID: string,
    }
}

export type IUnshareRepoFromSelfFailedAction = FailedAction<DesktopUserActionType.UNSHARE_REPO_FROM_SELF_FAILED>

export interface IReadLocalConfigAction {
    type: DesktopUserActionType.READ_LOCAL_CONFIG
    payload: {}
}

export interface IReadLocalConfigSuccessAction {
    type: DesktopUserActionType.READ_LOCAL_CONFIG_SUCCESS
    payload: {
        config: IUserDataContents,
    }
}

export type IReadLocalConfigFailedAction = FailedAction<DesktopUserActionType.READ_LOCAL_CONFIG_FAILED>

export interface ISetLocalConfigAction {
    type: DesktopUserActionType.SET_LOCAL_CONFIG
    payload: {
        config: IUserDataContents,
    }
}

export interface ISetLocalConfigSuccessAction {
    type: DesktopUserActionType.SET_LOCAL_CONFIG_SUCCESS
    payload: {
        config: IUserDataContents,
    }
}

export type ISetLocalConfigFailedAction = FailedAction<DesktopUserActionType.SET_LOCAL_CONFIG_FAILED>

export interface ISetAutoUpdateStateAction {
    type: DesktopUserActionType.SET_AUTOUPDATE_STATE
    payload: {
        state: AutoUpdateState
    }
}

export type IDesktopUserAction =
    IUserAction |

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

    IReadLocalConfigAction |
    IReadLocalConfigSuccessAction |
    IReadLocalConfigFailedAction |

    ISetLocalConfigAction |
    ISetLocalConfigSuccessAction |
    ISetLocalConfigFailedAction |

    ISetAutoUpdateStateAction

export const checkNodeUser = () => ({ type: DesktopUserActionType.CHECK_NODE_USER, payload: {} })
export const gotNodeUsername = (payload: IGotNodeUsernameAction['payload']) => ({ type: DesktopUserActionType.GOT_NODE_USERNAME, payload })
export const checkBalanceAndHitFaucet = () => ({ type: DesktopUserActionType.CHECK_BALANCE_AND_HIT_FAUCET, payload: {} })

export const getSharedRepos = (payload: IGetSharedReposAction['payload']): IGetSharedReposAction => ({ type: DesktopUserActionType.FETCH_SHARED_REPOS, payload })

export const ignoreSharedRepo = (payload: IIgnoreSharedRepoAction['payload']): IIgnoreSharedRepoAction => ({ type: DesktopUserActionType.IGNORE_SHARED_REPO, payload })
export const unshareRepoFromSelf = (payload: IUnshareRepoFromSelfAction['payload']): IUnshareRepoFromSelfAction => ({ type: DesktopUserActionType.UNSHARE_REPO_FROM_SELF, payload })

export const readLocalConfig = (payload: IReadLocalConfigAction['payload'] = {}): IReadLocalConfigAction => ({ type: DesktopUserActionType.READ_LOCAL_CONFIG, payload })
export const setLocalConfig = (payload: ISetLocalConfigAction['payload']): ISetLocalConfigAction => ({ type: DesktopUserActionType.SET_LOCAL_CONFIG, payload })

export const setAutoUpdateState = (payload: ISetAutoUpdateStateAction['payload']): ISetAutoUpdateStateAction => ({ type: DesktopUserActionType.SET_AUTOUPDATE_STATE, payload })


