import * as parseDiff from 'parse-diff'
import { FailedAction } from '../reduxUtils'
import { URI } from 'conscience-lib/common'

export enum RepoActionType {
    GET_REPO_LIST = 'GET_REPO_LIST',
    GET_REPO_LIST_SUCCESS = 'GET_REPO_LIST_SUCCESS',
    GET_REPO_LIST_FAILED = 'GET_REPO_LIST_FAILED',

    GET_DIFF = 'GET_DIFF',
    GET_DIFF_SUCCESS = 'GET_DIFF_SUCCESS',
    GET_DIFF_FAILED = 'GET_DIFF_FAILED',

    UPDATE_USER_PERMISSIONS = 'UPDATE_USER_PERMISSIONS',
    UPDATE_USER_PERMISSIONS_SUCCESS = 'UPDATE_USER_PERMISSIONS_SUCCESS',
    UPDATE_USER_PERMISSIONS_FAILED = 'UPDATE_USER_PERMISSIONS_FAILED',

    CHECKPOINT_REPO = 'CHECKPOINT_REPO',
    CHECKPOINT_REPO_SUCCESS = 'CHECKPOINT_REPO_SUCCESS',
    CHECKPOINT_REPO_FAILED = 'CHECKPOINT_REPO_FAILED',

    CLONE_REPO = 'CLONE_REPO',
    CLONE_REPO_PROGRESS = 'CLONE_REPO_PROGRESS',
    CLONE_REPO_SUCCESS = 'CLONE_REPO_SUCCESS',
    CLONE_REPO_FAILED = 'CLONE_REPO_FAILED',

    PULL_REPO = 'PULL_REPO',
    PULL_REPO_PROGRESS = 'PULL_REPO_PROGRESS',
    PULL_REPO_SUCCESS = 'PULL_REPO_SUCCESS',
    PULL_REPO_FAILED = 'PULL_REPO_FAILED',
}

export interface IGetRepoListAction {
    type: RepoActionType.GET_REPO_LIST
    payload: {
        username: string
    }
}

export interface IGetRepoListSuccessAction {
    type: RepoActionType.GET_REPO_LIST_SUCCESS
    payload: {
        username: string
        repoList: string[]
    }
}

export type IGetRepoListFailedAction = FailedAction<RepoActionType.GET_REPO_LIST_FAILED>

export interface IGetDiffAction {
    type: RepoActionType.GET_DIFF
    payload: {
        // @@TODO: implement repoURI
        repoID?: string
        repoRoot?: string
        commit: string
    }
}

export interface IGetDiffSuccessAction {
    type: RepoActionType.GET_DIFF_SUCCESS
    payload: {
        // @@TODO: implement repoURI
        repoID?: string
        repoRoot?: string
        commit: string
        // diffs: { [filename: string]: string }
        diff: parseDiff.File[]
    }
}

export type IGetDiffFailedAction = FailedAction<RepoActionType.GET_DIFF_FAILED>

export interface IUpdateUserPermissionsAction {
    type: RepoActionType.UPDATE_USER_PERMISSIONS
    payload: {
        uri: URI
        username: string
        admin: boolean
        pusher: boolean
        puller: boolean
    }
}

export interface IUpdateUserPermissionsSuccessAction {
    type: RepoActionType.UPDATE_USER_PERMISSIONS_SUCCESS
    payload: {
        repoID: string
        admins: string[]
        pushers: string[]
        pullers: string[]
    }
}

export interface ICheckpointRepoAction {
    type: RepoActionType.CHECKPOINT_REPO
    payload: {
        uri: URI
        message: string,
    }
}

export interface ICheckpointRepoSuccessAction {
    type: RepoActionType.CHECKPOINT_REPO_SUCCESS
    payload: {}
}

export type ICheckpointRepoFailedAction = FailedAction<RepoActionType.CHECKPOINT_REPO_FAILED>

export interface ICloneRepoAction {
    type: RepoActionType.CLONE_REPO
    payload: {
        repoID: string,
    }
}

export interface ICloneRepoProgressAction {
    type: RepoActionType.CLONE_REPO_PROGRESS
    payload: {
        repoID: string,
        toFetch: number,
        fetched: number,
    }
}

export interface ICloneRepoSuccessAction {
    type: RepoActionType.CLONE_REPO_SUCCESS
    payload: {}
}

export type ICloneRepoFailedAction = FailedAction<RepoActionType.CLONE_REPO_FAILED>

export interface IPullRepoAction {
    type: RepoActionType.PULL_REPO
    payload: {
        uri: URI
    }
}

export interface IPullRepoProgressAction {
    type: RepoActionType.PULL_REPO_PROGRESS
    payload: {
        folderPath: string
        toFetch: number
        fetched: number
    }
}

export interface IPullRepoSuccessAction {
    type: RepoActionType.PULL_REPO_SUCCESS
    payload: {
        folderPath: string,
    }
}

export type IPullRepoFailedAction = FailedAction<RepoActionType.PULL_REPO_FAILED>

export type IUpdateUserPermissionsFailedAction = FailedAction<RepoActionType.UPDATE_USER_PERMISSIONS_FAILED>

export type IRepoAction =
    IGetRepoListAction |
    IGetRepoListSuccessAction |
    IGetRepoListFailedAction |

    IGetDiffAction |
    IGetDiffSuccessAction |
    IGetDiffFailedAction |

    IUpdateUserPermissionsAction |
    IUpdateUserPermissionsSuccessAction |
    IUpdateUserPermissionsFailedAction |

    ICheckpointRepoAction |
    ICheckpointRepoSuccessAction |
    ICheckpointRepoFailedAction |

    ICloneRepoAction |
    ICloneRepoProgressAction |
    ICloneRepoSuccessAction |
    ICloneRepoFailedAction |

    IPullRepoAction |
    IPullRepoProgressAction |
    IPullRepoSuccessAction |
    IPullRepoFailedAction

export const getRepoList = (payload: IGetRepoListAction['payload']): IGetRepoListAction => ({ type: RepoActionType.GET_REPO_LIST, payload })
export const getDiff = (payload: IGetDiffAction['payload']): IGetDiffAction => ({ type: RepoActionType.GET_DIFF, payload })
export const updateUserPermissions = (payload: IUpdateUserPermissionsAction['payload']): IUpdateUserPermissionsAction => ({ type: RepoActionType.UPDATE_USER_PERMISSIONS, payload })

export const checkpointRepo = (payload: ICheckpointRepoAction['payload']): ICheckpointRepoAction => ({ type: RepoActionType.CHECKPOINT_REPO, payload })
export const cloneRepo = (payload: ICloneRepoAction['payload']): ICloneRepoAction => ({ type: RepoActionType.CLONE_REPO, payload })
export const cloneRepoProgress = (payload: ICloneRepoProgressAction['payload']): ICloneRepoProgressAction => ({ type: RepoActionType.CLONE_REPO_PROGRESS, payload })
export const pullRepo = (payload: IPullRepoAction['payload']): IPullRepoAction => ({ type: RepoActionType.PULL_REPO, payload })
export const pullRepoProgress = (payload: IPullRepoProgressAction['payload']): IPullRepoProgressAction => ({ type: RepoActionType.PULL_REPO_PROGRESS, payload })
export const pullRepoSuccess = (payload: IPullRepoSuccessAction['payload']): IPullRepoSuccessAction => ({ type: RepoActionType.PULL_REPO_SUCCESS, payload })