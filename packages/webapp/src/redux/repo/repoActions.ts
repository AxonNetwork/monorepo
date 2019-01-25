import { FailedAction } from 'conscience-components/redux/reduxUtils'
import { IRepo, URI } from 'conscience-lib/common'
import { IRepoAction } from 'conscience-components/redux/repo/repoActions'

export enum WebRepoActionType {
    FETCH_FULL_REPO_FROM_SERVER = 'FETCH_FULL_REPO_FROM_SERVER',
    FETCH_FULL_REPO_FROM_SERVER_SUCCESS = 'FETCH_FULL_REPO_FROM_SERVER_SUCCESS',
    FETCH_FULL_REPO_FROM_SERVER_FAILED = 'FETCH_FULL_REPO_FROM_SERVER_FAILED',
}

export interface IFetchFullRepoFromServerAction {
    type: WebRepoActionType.FETCH_FULL_REPO_FROM_SERVER
    payload: {
        uri: URI
    }
}

export interface IFetchFullRepoFromServerSuccessAction {
    type: WebRepoActionType.FETCH_FULL_REPO_FROM_SERVER_SUCCESS
    payload: {
        uri: URI
        repo: IRepo
    }
}

export type IFetchFullRepoFromServerFailedAction = FailedAction<WebRepoActionType.FETCH_FULL_REPO_FROM_SERVER_FAILED>

export type IWebRepoAction =
    IRepoAction |

    IFetchFullRepoFromServerAction |
    IFetchFullRepoFromServerSuccessAction |
    IFetchFullRepoFromServerFailedAction

export const fetchFullRepoFromServer = (payload: IFetchFullRepoFromServerAction['payload']): IFetchFullRepoFromServerAction => ({ type: WebRepoActionType.FETCH_FULL_REPO_FROM_SERVER, payload })

