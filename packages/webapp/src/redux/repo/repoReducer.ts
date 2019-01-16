import { RepoActionType, IRepoAction } from 'conscience-components/redux/repo/repoActions'
import repoReducer, { initialState, IRepoState } from 'conscience-components/redux/repo/repoReducer'
import { IWebRepoAction } from './repoActions'

const webInitialState = {
    ...initialState,
}

declare module 'conscience-components/redux/repo/repoReducer' {
    export interface IRepoState {
    }
}

const webRepoReducer = (state: IRepoState, action: IWebRepoAction): IRepoState => {
    switch (action.type) {
        case RepoActionType.GET_REPO_SUCCESS: {
            const { repo } = action.payload
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [repo.repoID]: repo
                }
            }
        }

        default:
            return state
    }
}

export default function(state: IRepoState = webInitialState, action: IWebRepoAction): IRepoState {
    state = repoReducer(state, action as IRepoAction)
    state = webRepoReducer(state, action)
    return state
}
