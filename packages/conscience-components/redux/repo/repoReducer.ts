import { RepoActionType, IRepoAction } from './repoActions'
import { IRepo } from 'conscience-lib/common'

export const initialState = {
    repos: {},
    repoListByUser: {},
}

export interface IRepoState {
    repos: { [repoID: string]: IRepo }
    repoListByUser: { [username: string]: string[] }
}

const repoReducer = (state: IRepoState = initialState, action: IRepoAction): IRepoState => {
    switch (action.type) {
        case RepoActionType.GET_REPO_LIST_SUCCESS: {
            const { username, repoList } = action.payload
            return {
                ...state,
                repoListByUser: {
                    ...state.repoListByUser,
                    [username]: repoList
                }
            }
        }

        // case RepoActionType.GET_REPO_SUCCESS: {
        //     const { repo } = action.payload
        //     return {
        //         ...state,
        //         repos: {
        //             ...state.repos,
        //             [repo.repoID]: repo
        //         }
        //     }
        // }

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

        case RepoActionType.UPDATE_USER_PERMISSIONS_SUCCESS: {
            const { repoID, admins, pushers, pullers } = action.payload

            return {
                ...state,
                repos: {
                    ...state.repos,
                    [repoID]: {
                        ...(state.repos[repoID] || {}),
                        admins: admins,
                        pushers: pushers,
                        pullers: pullers,
                    },
                },
            }
        }

        default:
            return state
    }
}

export default repoReducer
