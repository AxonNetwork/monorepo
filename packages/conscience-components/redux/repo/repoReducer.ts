import { RepoActionType, IRepoAction } from './repoActions'
import { IRepo, IRepoPermissions } from 'conscience-lib/common'

export const initialState = {
    repos: {},
    repoListByUser: {},
    repoPermissions: {},
}

export interface IRepoState {
    repos: { [repoID: string]: IRepo }
    repoListByUser: { [username: string]: string[] }
    repoPermissions: { [repoID: string]: IRepoPermissions }
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

        case RepoActionType.UPDATE_USER_PERMISSIONS_SUCCESS: {
            const { repoID, admins, pushers, pullers } = action.payload

            return {
                ...state,
                repoPermissions: {
                    ...state.repoPermissions,
                    [repoID]: {
                        admins: admins,
                        pushers: pushers,
                        pullers: pullers,
                    }
                }
            }
        }

        default:
            return state
    }
}

export default repoReducer

