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

    LOGOUT = 'LOGOUT',
    LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',
    LOGOUT_FAILED = 'LOGOUT_FAILED',

    CHECK_LOCAL_USER = 'CHECK_LOCAL_USER',
    CHECK_LOCAL_USER_SUCCESS = 'CHECK_LOCAL_USER_SUCCESS',
    CHECK_LOCAL_USER_FAILED = 'CHECK_LOCAL_USER_FAILED',

    FETCH_SHARED_REPOS = 'FETCH_SHARED_REPOS',
    FETCH_SHARED_REPOS_SUCCESS = 'FETCH_SHARED_REPOS_SUCCESS',
    FETCH_SHARED_REPOS_FAILED = 'FETCH_SHARED_REPOS_FAILED',

    CLONE_SHARED_REPO = 'CLONE_SHARED_REPO',
    CLONE_SHARED_REPO_SUCCESS = 'CLONE_SHARED_REPO_SUCCESS',
    CLONE_SHARED_REPO_FAILED = 'CLONE_SHARED_REPO_FAILED',

    IGNORE_SHARED_REPO = 'IGNORE_SHARED_REPO',
    IGNORE_SHARED_REPO_SUCCESS = 'IGNORE_SHARED_REPO_SUCCESS',
    IGNORE_SHARED_REPO_FAILED = 'IGNORE_SHARED_REPO_FAILED',

    READ_LOCAL_CONFIG = 'READ_LOCAL_CONFIG',
    READ_LOCAL_CONFIG_SUCCESS = 'READ_LOCAL_CONFIG_SUCCESS',
    READ_LOCAL_CONFIG_FAILED = 'READ_LOCAL_CONFIG_FAILED',

    SET_CODE_COLOR_SCHEME = 'SET_CODE_COLOR_SCHEME',
    SET_CODE_COLOR_SCHEME_SUCCESS = 'SET_CODE_COLOR_SCHEME_SUCCESS',
    SET_CODE_COLOR_SCHEME_FAILED = 'SET_CODE_COLOR_SCHEME_FAILED',
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
        email: string
        name: string,
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
        email: string
        password: string,
    }
}

export interface ISignupSuccessAction {
    type: UserActionType.SIGNUP_SUCCESS
    payload: {
        name: string
        email: string,
    }
}

export type ISignupFailedAction = FailedAction<UserActionType.SIGNUP_FAILED>

export interface IFetchUserDataAction {
    type: UserActionType.FETCH_USER_DATA
    payload: {
        emails: string[],
    }
}

export interface IFetchUserDataSuccessAction {
    type: UserActionType.FETCH_USER_DATA_SUCCESS
    payload: {
        users: { [email: string]: IUser },
    }
}

export type IFetchUserDataFailedAction = FailedAction<UserActionType.FETCH_USER_DATA_FAILED>

export interface ICheckLocalUserAction {
    type: UserActionType.CHECK_LOCAL_USER
    payload: {}
}

export interface ICheckLocalUserSuccessAction {
    type: UserActionType.CHECK_LOCAL_USER_SUCCESS
    payload: {
        email: string
        name: string,
    }
}

export type ICheckLocalUserFailedAction = FailedAction<UserActionType.CHECK_LOCAL_USER_FAILED>

export interface IGetSharedReposAction {
    type: UserActionType.FETCH_SHARED_REPOS
    payload: {
        email: string,
    }
}

export interface IGetSharedReposSuccessAction {
    type: UserActionType.FETCH_SHARED_REPOS_SUCCESS
    payload: {
        email: string
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
        repoID: string
        email: string | undefined,
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
    ICheckLocalUserAction |
    ICheckLocalUserSuccessAction |
    ICheckLocalUserFailedAction |
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
    ISetCodeColorSchemeFailedAction

export const login = (payload: ILoginAction['payload']): ILoginAction => ({ type: UserActionType.LOGIN, payload })
export const logout = (): ILogoutAction => ({ type: UserActionType.LOGOUT, payload: {} })
export const signup = (payload: ISignupAction['payload']): ISignupAction => ({ type: UserActionType.SIGNUP, payload })
export const fetchUserData = (payload: IFetchUserDataAction['payload']): IFetchUserDataAction => ({ type: UserActionType.FETCH_USER_DATA, payload })
export const checkLocalUser = () => ({ type: UserActionType.CHECK_LOCAL_USER, payload: {}})

export const getSharedRepos = (payload: IGetSharedReposAction['payload']): IGetSharedReposAction => ({ type: UserActionType.FETCH_SHARED_REPOS, payload })
export const cloneSharedRepo = (payload: ICloneSharedRepoAction['payload']): ICloneSharedRepoAction => ({ type: UserActionType.CLONE_SHARED_REPO, payload })
export const ignoreSharedRepo = (payload: IIgnoreSharedRepoAction['payload']): IIgnoreSharedRepoAction => ({ type: UserActionType.IGNORE_SHARED_REPO, payload })

export const readLocalConfig = (payload: IReadLocalConfigAction['payload'] = {}): IReadLocalConfigAction => ({ type: UserActionType.READ_LOCAL_CONFIG, payload })
export const setCodeColorScheme = (payload: ISetCodeColorSchemeAction['payload']): ISetCodeColorSchemeAction => ({ type: UserActionType.SET_CODE_COLOR_SCHEME, payload })



