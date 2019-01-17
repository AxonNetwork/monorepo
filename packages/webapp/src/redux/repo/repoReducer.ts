import { RepoActionType, IRepoAction } from 'conscience-components/redux/repo/repoActions'
import repoReducer, { initialState, IRepoState } from 'conscience-components/redux/repo/repoReducer'
import { WebRepoActionType, IWebRepoAction } from './repoActions'

const webInitialState = {
    ...initialState,
}

declare module 'conscience-components/redux/repo/repoReducer' {
    export interface IRepoState {
    }
}

const webRepoReducer = (state: IRepoState, action: IWebRepoAction): IRepoState => {
    switch (action.type) {
        case WebRepoActionType.GET_REPO_SUCCESS: {
            const { repo } = action.payload
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [repo.repoID]: repo
                }
            }
        }

        case RepoActionType.GET_DIFF_SUCCESS: {
            const { repoID, commit, diffs } = action.payload
            if (!repoID) {
                throw new Error('conscience-components repoReducer GET_DIFF_SUCCESS: repoID must be specified')
            }
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [repoID]: {
                        ...(state.repos[repoID] || {}),
                        path: repoID,
                        commits: {
                            ...((state.repos[repoID] || {}).commits || {}),
                            [commit]: {
                                ...(((state.repos[repoID] || {}).commits || {})[commit] || {}),
                                diffs,
                            },
                        },
                    },
                },
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
