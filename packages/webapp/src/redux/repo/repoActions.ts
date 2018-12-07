import { FailedAction } from '../reduxUtils'
import { IRepo } from 'conscience-lib/common'

export enum RepoActionType {
    GET_REPO_LIST = 'GET_REPO_LIST',
    GET_REPO_LIST_SUCCESS = 'GET_REPO_LIST_SUCCESS',
    GET_REPO_LIST_FAILED = 'GET_REPO_LIST_FAILED',

    GET_REPO = 'GET_REPO',
    GET_REPO_SUCCESS = 'GET_REPO_SUCCESS',
    GET_REPO_FAILED = 'GET_REPO_FAILED',
}

export interface IGetRepoListAction {
    type: RepoActionType.GET_REPO_LIST
    payload: {}
}

export interface IGetRepoListSuccessAction {
    type: RepoActionType.GET_REPO_LIST_SUCCESS
    payload: {
        repos: {[repoID: string]: IRepo}
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

export type IRepoAction =
    IGetRepoListAction |
    IGetRepoListSuccessAction |
    IGetRepoListFailedAction |

    IGetRepoAction |
    IGetRepoSuccessAction |
    IGetRepoFailedAction

export const getRepoList = (payload: IGetRepoListAction['payload']): IGetRepoListAction => ({ type: RepoActionType.GET_REPO_LIST, payload })
export const getRepo = (payload: IGetRepoAction['payload']): IGetRepoAction => ({ type: RepoActionType.GET_REPO, payload })
