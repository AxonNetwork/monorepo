import { FailedAction } from '../reduxUtils'
import { ISearchUserResult, ISearchResults } from 'conscience-lib/common'

export enum SearchActionType {
    SEARCH = 'SEARCH',
    SEARCH_SUCCESS = 'SEARCH_SUCCESS',
    SEARCH_FAILED = 'SEARCH_FAILED',

    SEARCH_USERS = 'SEARCH_USERS',
    SEARCH_USERS_SUCCESS = 'SEARCH_USERS_SUCCESS',
    SEARCH_USERS_FAILED = 'SEARCH_USERS_FAILED',

    CLEAR_SEARCH = 'CLEAR_SEARCH',
}

export interface IDoSearchAction {
    type: SearchActionType.SEARCH
    payload: {
        query: string
    }
}

export interface IDoSearchSuccessAction {
    type: SearchActionType.SEARCH_SUCCESS
    payload: {
        results: ISearchResults
    }
}

export type IDoSearchFailedAction = FailedAction<SearchActionType.SEARCH_FAILED>

export interface IDoSearchUsersAction {
    type: SearchActionType.SEARCH_USERS
    payload: {
        query: string
    }
}

export interface IDoSearchUsersSuccessAction {
    type: SearchActionType.SEARCH_USERS_SUCCESS
    payload: {
        results: ISearchUserResult[]
    }
}

export type IDoSearchUsersFailedAction = FailedAction<SearchActionType.SEARCH_USERS_FAILED>


export interface IClearSearchAction {
    type: SearchActionType.CLEAR_SEARCH
    payload: {}
}


export type ISearchAction =
    IDoSearchAction |
    IDoSearchSuccessAction |
    IDoSearchFailedAction |

    IDoSearchUsersAction |
    IDoSearchUsersSuccessAction |
    IDoSearchUsersFailedAction |

    IClearSearchAction


export const search = (payload: IDoSearchAction['payload']): IDoSearchAction => ({ type: SearchActionType.SEARCH, payload })
export const searchUsers = (payload: IDoSearchUsersAction['payload']): IDoSearchUsersAction => ({ type: SearchActionType.SEARCH_USERS, payload })
export const clearSearch = (payload: IClearSearchAction['payload']): IClearSearchAction => ({ type: SearchActionType.CLEAR_SEARCH, payload })
