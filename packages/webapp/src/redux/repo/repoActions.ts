import { FailedAction } from '../reduxUtils'
import { IRepo } from 'conscience-lib/common'

export enum RepoActionType {
    GET_REPO_LIST = 'GET_REPO_LIST',
    GET_REPO_LIST_SUCCESS = 'GET_REPO_LIST_SUCCESS',
    GET_REPO_LIST_FAILED = 'GET_REPO_LIST_FAILED',

    GET_REPO = 'GET_REPO',
    GET_REPO_SUCCESS = 'GET_REPO_SUCCESS',
    GET_REPO_FAILED = 'GET_REPO_FAILED',

    GET_DIFF = 'GET_DIFF',
    GET_DIFF_SUCCESS = 'GET_DIFF_SUCCESS',
    GET_DIFF_FAILED = 'GET_DIFF_FAILED',

    ADD_COLLABORATOR = 'ADD_COLLABORATOR',
    ADD_COLLABORATOR_SUCCESS = 'ADD_COLLABORATOR_SUCCESS',
    ADD_COLLABORATOR_FAILED = 'ADD_COLLABORATOR_FAILED',

    REMOVE_COLLABORATOR = 'REMOVE_COLLABORATOR',
    REMOVE_COLLABORATOR_SUCCESS = 'REMOVE_COLLABORATOR_SUCCESS',
    REMOVE_COLLABORATOR_FAILED = 'REMOVE_COLLABORATOR_FAILED',

    CHANGE_USER_PERMISSIONS = 'CHANGE_USER_PERMISSIONS',
    CHANGE_USER_PERMISSIONS_SUCCESS = 'CHANGE_USER_PERMISSIONS_SUCCESS',
    CHANGE_USER_PERMISSIONS_FAILED = 'CHANGE_USER_PERMISSIONS_FAILED',
}

export interface IGetRepoListAction {
    type: RepoActionType.GET_REPO_LIST
    payload: {}
}

export interface IGetRepoListSuccessAction {
    type: RepoActionType.GET_REPO_LIST_SUCCESS
    payload: {
        repoList: string[]
    }
}

export type IGetRepoListFailedAction = FailedAction<RepoActionType.GET_REPO_LIST_FAILED>

export interface IGetRepoAction {
    type: RepoActionType.GET_REPO
    payload: {
        repoID: string
    }
}

export interface IGetRepoSuccessAction {
    type: RepoActionType.GET_REPO_SUCCESS
    payload: {
        repo: IRepo
    }
}

export type IGetRepoFailedAction = FailedAction<RepoActionType.GET_REPO_FAILED>

export interface IGetDiffAction {
    type: RepoActionType.GET_DIFF
    payload: {
        repoID: string
        commit: string
    }
}

export interface IGetDiffSuccessAction {
    type: RepoActionType.GET_DIFF_SUCCESS
    payload: {
        repoID: string
        commit: string
        diffs: {[filename: string]: string}
    }
}

export type IGetDiffFailedAction = FailedAction<RepoActionType.GET_DIFF_FAILED>

export interface IAddCollaboratorAction {
    type: RepoActionType.ADD_COLLABORATOR
    payload: {
        repoID: string
        email: string
    }
}

export interface IAddCollaboratorSuccessAction {
    type: RepoActionType.ADD_COLLABORATOR_SUCCESS
    payload: {
        repoID: string
        userID: string
    }
}

export type IAddCollaboratorFailedAction = FailedAction<RepoActionType.ADD_COLLABORATOR_FAILED>

export interface IRemoveCollaboratorAction {
    type: RepoActionType.REMOVE_COLLABORATOR
    payload: {
        repoID: string
        userID: string
    }
}

export interface IRemoveCollaboratorSuccessAction {
    type: RepoActionType.REMOVE_COLLABORATOR_SUCCESS
    payload: {
        repoID: string
        userID: string
    }
}

export type IRemoveCollaboratorFailedAction = FailedAction<RepoActionType.REMOVE_COLLABORATOR_FAILED>

export interface IChangeUserPermissionsAction {
    type: RepoActionType.CHANGE_USER_PERMISSIONS
    payload: {
        repoID: string
        userID: string
        admin: boolean
        pusher: boolean
        puller: boolean
    }
}

export interface IChangeUserPermissionsSuccessAction {
    type: RepoActionType.CHANGE_USER_PERMISSIONS_SUCCESS
    payload: {
        repoID: string
        userID: string
        admin: boolean
        pusher: boolean
        puller: boolean
    }
}

export type IChangeUserPermissionsFailedAction = FailedAction<RepoActionType.CHANGE_USER_PERMISSIONS_FAILED>

export type IRepoAction =
    IGetRepoListAction |
    IGetRepoListSuccessAction |
    IGetRepoListFailedAction |

    IGetRepoAction |
    IGetRepoSuccessAction |
    IGetRepoFailedAction |

    IGetDiffAction |
    IGetDiffSuccessAction |
    IGetDiffFailedAction |

    IAddCollaboratorAction |
    IAddCollaboratorSuccessAction |
    IAddCollaboratorFailedAction |

    IChangeUserPermissionsAction |
    IChangeUserPermissionsSuccessAction |
    IChangeUserPermissionsFailedAction |

    IRemoveCollaboratorAction |
    IRemoveCollaboratorSuccessAction |
    IRemoveCollaboratorFailedAction

export const getRepoList = (payload: IGetRepoListAction['payload']): IGetRepoListAction => ({ type: RepoActionType.GET_REPO_LIST, payload })
export const getRepo = (payload: IGetRepoAction['payload']): IGetRepoAction => ({ type: RepoActionType.GET_REPO, payload })

export const getDiff = (payload: IGetDiffAction['payload']): IGetDiffAction => ({ type: RepoActionType.GET_DIFF, payload })

export const addCollaborator = (payload: IAddCollaboratorAction['payload']): IAddCollaboratorAction => ({ type: RepoActionType.ADD_COLLABORATOR, payload })
export const removeCollaborator = (payload: IRemoveCollaboratorAction['payload']): IRemoveCollaboratorAction => ({ type: RepoActionType.REMOVE_COLLABORATOR, payload })
export const changeUserPermissions = (payload: IChangeUserPermissionsAction['payload']): IChangeUserPermissionsAction => ({ type: RepoActionType.CHANGE_USER_PERMISSIONS, payload })
