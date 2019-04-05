import { SearchActionType, ISearchAction } from './searchActions'
import { ISearchCommentResult, ISearchFileResult, ISearchUserResult } from 'conscience-lib/common'

export const initialState = {
    query: null,
    results: null,
}

export interface ISearchState {
    query: string | null
    results: {
        comments?: ISearchCommentResult[]
        files?: ISearchFileResult[]
        users?: ISearchUserResult[]
    } | null
}

const searchReducer = (state: ISearchState = initialState, action: ISearchAction): ISearchState => {
    switch (action.type) {
        case SearchActionType.SEARCH: {
            return {
                ...state,
                query: action.payload.query,
                results: null,
            }
        }

        case SearchActionType.SEARCH_SUCCESS: {
            const { results } = action.payload
            return {
                ...state,
                results,
            }
        }

        case SearchActionType.SEARCH_USERS: {
            return {
                ...state,
                query: action.payload.query,
                results: null,
            }
        }

        case SearchActionType.SEARCH_USERS_SUCCESS: {
            const userResults = action.payload.results
            return {
                ...state,
                results: {
                    ...(state.results || {}),
                    users: userResults
                }
            }
        }

        case SearchActionType.CLEAR_SEARCH: {
            return {
                ...state,
                results: null
            }
        }

        default:
            return state
    }
}

export default searchReducer
