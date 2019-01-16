import { FailedAction } from 'conscience-components/redux/reduxUtils'
import { IRepo } from 'conscience-lib/common'
import { RepoActionType, IRepoAction } from 'conscience-components/redux/repo/repoActions'

declare module 'conscience-components/redux/repo/repoActions' {
    export enum RepoActionType {
        GET_REPO = 'GET_REPO',
        GET_REPO_SUCCESS = 'GET_REPO_SUCCESS',
        GET_REPO_FAILED = 'GET_REPO_FAILED',
    }
}

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

export type IWebRepoAction =
    IRepoAction |

    IGetRepoAction |
    IGetRepoSuccessAction |
    IGetRepoFailedAction

export const getRepo = (payload: IGetRepoAction['payload']): IGetRepoAction => ({ type: RepoActionType.GET_REPO, payload })

