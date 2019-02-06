import { SearchActionType, ISearchAction } from './searchActions'
import { ISearchResults } from 'conscience-lib/common'

export const initialState = {
    query: null,
    results: null,
}

export interface ISearchState {
    query: string | null
    results: ISearchResults | null
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
            const results = action.payload
            return {
                ...state,
                results,
            }
        }

        default:
            return state
    }
}

export default searchReducer
