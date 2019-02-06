import { FailedAction } from '../reduxUtils'
import { ISearchResults } from 'conscience-lib/common'

export enum SearchActionType {
    SEARCH = 'SEARCH',
    SEARCH_SUCCESS = 'SEARCH_SUCCESS',
    SEARCH_FAILED = 'SEARCH_FAILED',
}

export interface IDoSearchAction {
    type: SearchActionType.SEARCH
    payload: {
        query: string
    }
}

export interface IDoSearchSuccessAction {
    type: SearchActionType.SEARCH_SUCCESS
    payload: ISearchResults
}

export type IDoSearchFailedAction = FailedAction<SearchActionType.SEARCH_FAILED>

export type ISearchAction =
    IDoSearchAction |
    IDoSearchSuccessAction |
    IDoSearchFailedAction


export const search = (payload: IDoSearchAction['payload']): IDoSearchAction => ({ type: SearchActionType.SEARCH, payload })




