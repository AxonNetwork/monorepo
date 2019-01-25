import { RepoActionType, IRepoAction } from 'conscience-components/redux/repo/repoActions'
import repoReducer, { initialState, IRepoState } from 'conscience-components/redux/repo/repoReducer'
import { WebRepoActionType, IWebRepoAction } from './repoActions'
import { uriToString } from 'conscience-lib/utils'

const webInitialState = {
    ...initialState,
}

declare module 'conscience-components/redux/repo/repoReducer' {
    export interface IRepoState {
    }
}

const webRepoReducer = (state: IRepoState, action: IWebRepoAction): IRepoState => {
    switch (action.type) {
        case WebRepoActionType.FETCH_FULL_REPO_FROM_SERVER_SUCCESS: {
            const { uri, repo } = action.payload
            const uriStr = uriToString(uri)
            return {
                ...state,
                filesByURI: {
                    ...state.filesByURI,
                    [uriStr]: repo.files || {}
                },
                commitListsByURI: {
                    ...state.commitListsByURI,
                    [uriStr]: repo.commitList || []
                },
                commits: {
                    ...state.commits,
                    ...repo.commits
                },
                permissionsByID: {
                    ...state.permissionsByID,
                    [repo.repoID]: {
                        admins: repo.admins || [],
                        pushers: repo.pushers || [],
                        pullers: repo.pullers || []
                    }
                }
            }
        }

        case WebRepoActionType.FETCH_FULL_REPO_FROM_SERVER_FAILED: {
            const { original } = action.payload
            const { uri } = original.payload
            return {
                ...state,
                failedToFetchByURI: {
                    ...state.failedToFetchByURI,
                    [uriToString(uri)]: true
                }
            }
        }

        // case WebRepoActionType.GET_REPO_SUCCESS: {
        //     const { repo } = action.payload
        //     return {
        //         ...state,
        //         repos: {
        //             ...state.repos,
        //             [repo.repoID]: repo
        //         },
        //         repoPermissions: {
        //             ...state.repoPermissions,
        //             [repo.repoID]: {
        //                 admins: repo.admins || [],
        //                 pushers: repo.pushers || [],
        //                 pullers: repo.pullers || [],
        //             }
        //         }
        //     }
        // }

        case RepoActionType.GET_DIFF_SUCCESS: {
            const { commit, diff } = action.payload
            return {
                ...state,
                diffsByCommitHash: {
                    ...state.diffsByCommitHash,
                    [commit]: diff,
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
