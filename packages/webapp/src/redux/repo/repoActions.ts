import { FailedAction } from 'conscience-components/redux/reduxUtils'
import { IRepo } from 'conscience-lib/common'
import { IRepoAction } from 'conscience-components/redux/repo/repoActions'

export enum WebRepoActionType {
    GET_REPO = 'GET_REPO',
    GET_REPO_SUCCESS = 'GET_REPO_SUCCESS',
    GET_REPO_FAILED = 'GET_REPO_FAILED',
}

export interface IGetRepoAction {
    type: WebRepoActionType.GET_REPO
    payload: {
        repoID: string
    }
}

export interface IGetRepoSuccessAction {
    type: WebRepoActionType.GET_REPO_SUCCESS
    payload: {
        repo: IRepo
    }
}

export type IGetRepoFailedAction = FailedAction<WebRepoActionType.GET_REPO_FAILED>

export type IWebRepoAction =
    IRepoAction |

    IGetRepoAction |
    IGetRepoSuccessAction |
    IGetRepoFailedAction

export const getRepo = (payload: IGetRepoAction['payload']): IGetRepoAction => ({ type: WebRepoActionType.GET_REPO, payload })

