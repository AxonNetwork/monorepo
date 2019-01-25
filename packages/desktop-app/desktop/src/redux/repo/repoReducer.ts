import fromPairs from 'lodash/fromPairs'
import { ITimelineEvent, URIType, LocalURI } from 'conscience-lib/common'
import { RepoActionType, IRepoAction } from 'conscience-components/redux/repo/repoActions'
import repoReducer, { IRepoState, initialState } from 'conscience-components/redux/repo/repoReducer'
import { DesktopRepoActionType, IDesktopRepoAction } from './repoActions'
import { getHash } from 'conscience-lib/utils'


const desktopInitialState = {
    ...initialState,
    reposByHash: {},
    timelinePage: {},
    localRepoList: [],
    repoIDsByPath: {}
}

declare module 'conscience-components/redux/repo/repoReducer' {
    export interface IRepoState {
        reposByHash: { [hash: string]: string }
        timelinePage: { [repoID: string]: number }
        localRepoList: LocalURI[]
        repoIDsByPath: { [repoRoot: string]: string }
    }
}

const desktopRepoReducer = (state: IRepoState, action: IDesktopRepoAction): IRepoState => {
    switch (action.type) {
        case RepoActionType.CREATE_REPO_SUCCESS: {
            const { repoID, path } = action.payload
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [path]: {
                        ...(state.repos[path] || {}),
                        path,
                        repoID,
                    },
                },
                reposByHash: {
                    ...state.reposByHash,
                    [getHash(path)]: path
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

        case DesktopRepoActionType.GET_LOCAL_REPOS_SUCCESS: {
            const { repos } = action.payload
            const repoPairs = Object.keys(repos).map((path: string) => ([getHash(path), path]))
            const reposByHash = fromPairs(repoPairs)
            return {
                ...state,
                repos: {
                    ...state.repos,
                    ...repos,
                },
                reposByHash: {
                    ...state.reposByHash,
                    ...reposByHash,
                }
            }
        }

        case RepoActionType.PULL_REPO_SUCCESS: {
            const { folderPath } = action.payload
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [folderPath]: {
                        ...state.repos[folderPath],
                        path: folderPath,
                        behindRemote: false,
                    },
                },
            }
        }

        case DesktopRepoActionType.BEHIND_REMOTE: {
            const { path } = action.payload
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [path]: {
                        ...state.repos[path],
                        path,
                        behindRemote: true,
                    },
                },
            }
        }

        case DesktopRepoActionType.CHANGE_TIMELINE_PAGE: {
            const { repoID, page } = action.payload
            return {
                ...state,
                timelinePage: {
                    ...state.timelinePage,
                    [repoID]: page,
                },
            }
        }

        default:
            return state
    }
}

export default function(state: IRepoState = desktopInitialState, action: IDesktopRepoAction): IRepoState {
    state = repoReducer(state, action as IRepoAction)
    state = desktopRepoReducer(state, action)
    return state
}

