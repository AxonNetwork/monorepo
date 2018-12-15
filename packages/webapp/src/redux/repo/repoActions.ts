import { FailedAction } from '../reduxUtils'
import { IRepo, IRepoFile } from 'conscience-lib/common'

export enum RepoActionType {
    GET_REPO_LIST = 'GET_REPO_LIST',
    GET_REPO_LIST_SUCCESS = 'GET_REPO_LIST_SUCCESS',
    GET_REPO_LIST_FAILED = 'GET_REPO_LIST_FAILED',

    GET_REPO = 'GET_REPO',
    GET_REPO_SUCCESS = 'GET_REPO_SUCCESS',
    GET_REPO_FAILED = 'GET_REPO_FAILED',

    GET_FILE_CONTENTS = 'GET_FILE_CONTENTS',
    GET_FILE_CONTENTS_SUCCESS = 'GET_FILE_CONTENTS_SUCCESS',
    GET_FILE_CONTENTS_FAILED = 'GET_FILE_CONTENTS_FAILED',

    SAVE_FILE_CONTENTS = 'SAVE_FILE_CONTENTS',
    SAVE_FILE_CONTENTS_SUCCESS = 'SAVE_FILE_CONTENTS_SUCCESS',
    SAVE_FILE_CONTENTS_FAILED = 'SAVE_FILE_CONTENTS_FAILED',

    GET_DIFF = 'GET_DIFF',
    GET_DIFF_SUCCESS = 'GET_DIFF_SUCCESS',
    GET_DIFF_FAILED = 'GET_DIFF_FAILED',
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

export interface IGetFileContentsAction {
    type: RepoActionType.GET_FILE_CONTENTS
    payload: {
        repoID: string
        filename: string
        callback?: (error?: Error) => void
    }
}

export interface IGetFileContentsSuccessAction {
    type: RepoActionType.GET_FILE_CONTENTS_SUCCESS
    payload: {
        repoID: string
        filename: string
        file: IRepoFile
    }
}

export type IGetFileContentsFailedAction = FailedAction<RepoActionType.GET_FILE_CONTENTS_FAILED>

export interface ISaveFileContentsAction {
    type: RepoActionType.SAVE_FILE_CONTENTS
    payload: {
        repoID: string
        filename: string
        contents: string
        callback: (error?: Error) => void
    }
}

export interface ISaveFileContentsSuccessAction {
    type: RepoActionType.SAVE_FILE_CONTENTS_SUCCESS
    payload: {
        repoID: string
        filename: string
        file: IRepoFile
    }
}

export type ISaveFileContentsFailedAction = FailedAction<RepoActionType.SAVE_FILE_CONTENTS_FAILED>

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

export type IRepoAction =
    IGetRepoListAction |
    IGetRepoListSuccessAction |
    IGetRepoListFailedAction |

    IGetRepoAction |
    IGetRepoSuccessAction |
    IGetRepoFailedAction |

    IGetFileContentsAction |
    IGetFileContentsSuccessAction |
    IGetFileContentsFailedAction |

    ISaveFileContentsAction |
    ISaveFileContentsSuccessAction |
    ISaveFileContentsFailedAction |

    IGetDiffAction |
    IGetDiffSuccessAction |
    IGetDiffFailedAction

export const getRepoList = (payload: IGetRepoListAction['payload']): IGetRepoListAction => ({ type: RepoActionType.GET_REPO_LIST, payload })
export const getRepo = (payload: IGetRepoAction['payload']): IGetRepoAction => ({ type: RepoActionType.GET_REPO, payload })
export const getFileContents = (payload: IGetFileContentsAction['payload']): IGetFileContentsAction => ({ type: RepoActionType.GET_FILE_CONTENTS, payload })
export const saveFileContents = (payload: ISaveFileContentsAction['payload']): ISaveFileContentsAction => ({ type: RepoActionType.SAVE_FILE_CONTENTS, payload })
export const getDiff = (payload: IGetDiffAction['payload']): IGetDiffAction => ({ type: RepoActionType.GET_DIFF, payload })
