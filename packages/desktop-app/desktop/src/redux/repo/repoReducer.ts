import fromPairs from 'lodash/fromPairs'
import { URIType, LocalURI } from 'conscience-lib/common'
import { RepoActionType, IRepoAction } from 'conscience-components/redux/repo/repoActions'
import repoReducer, { IRepoState, initialState } from 'conscience-components/redux/repo/repoReducer'
import { getHash, uriToString } from 'conscience-lib/utils'


const desktopInitialState = {
    ...initialState,
    reposByHash: {},
    repoIDsByPath: {},
}

declare module 'conscience-components/redux/repo/repoReducer' {
    export interface IRepoState {
        reposByHash: { [hash: string]: string }
        repoIDsByPath: { [repoRoot: string]: string }
    }
}

const desktopRepoReducer = (state: IRepoState, action: IRepoAction): IRepoState => {
    switch (action.type) {
        case RepoActionType.INIT_REPO_SUCCESS: {
            const { path, repoID } = action.payload
            const uri = { type: URIType.Local, repoRoot: path } as LocalURI
            return {
                ...state,
                localRepoList: [
                    ...state.localRepoList,
                    uri
                ],
                reposByHash: {
                    ...state.reposByHash,
                    [getHash(path)]: path
                },
                repoIDsByPath: {
                    ...state.repoIDsByPath,
                    [path]: repoID
                }
            }
        }

        case RepoActionType.GET_LOCAL_REPO_LIST_SUCCESS: {
            const { localRepos } = action.payload
            const localRepoList = Object.keys(localRepos).map((path: string) => ({ type: URIType.Local, repoRoot: path } as LocalURI))
            const repoPairs = Object.keys(localRepos).map((path: string) => ([getHash(path), path]))
            const reposByHash = fromPairs(repoPairs)
            return {
                ...state,
                localRepoList,
                reposByHash,
                repoIDsByPath: localRepos,
            }
        }

        case RepoActionType.BEHIND_REMOTE: {
            const { uri } = action.payload
            const uriStr = uriToString(uri)
            return {
                ...state,
                isBehindRemoteByURI: {
                    ...state.isBehindRemoteByURI,
                    [uriStr]: true
                }
            }
        }

        case RepoActionType.PULL_REPO_SUCCESS: {
            const { uri } = action.payload
            const uriStr = uriToString(uri)
            return {
                ...state,
                isBehindRemoteByURI: {
                    ...state.isBehindRemoteByURI,
                    [uriStr]: false
                }
            }
        }

        default:
            return state
    }
}

export default function(state: IRepoState = desktopInitialState, action: IRepoAction): IRepoState {
    state = repoReducer(state, action as IRepoAction)
    state = desktopRepoReducer(state, action)
    return state
}

