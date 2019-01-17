import fromPairs from 'lodash/fromPairs'
import { ITimelineEvent, RepoPage } from 'conscience-lib/common'
import { RepoActionType, IRepoAction } from 'conscience-components/redux/repo/repoActions'
import repoReducer, { IRepoState, initialState } from 'conscience-components/redux/repo/repoReducer'
import { DesktopRepoActionType, IDesktopRepoAction } from './repoActions'
import { getHash } from 'conscience-lib/utils'


const desktopInitialState = {
    ...initialState,
    reposByHash: {},
    repoPage: RepoPage.Home,
    selectedRepo: undefined,
    selectedFile: undefined,
    selectedCommit: undefined,
    timelinePage: {},
    checkpointed: false,
}

declare module 'conscience-components/redux/repo/repoReducer' {
    export interface IRepoState {
        reposByHash: { [hash: string]: string }
        selectedRepo: string | undefined
        repoPage: RepoPage
        selectedFile: {
            file: string
            isFolder: boolean
            mode: FileMode
            defaultEditorContents?: string | undefined,
        } | undefined
        selectedCommit: string | undefined
        timelinePage: { [repoID: string]: number }
        checkpointed: boolean
    }
}

const desktopRepoReducer = (state: IRepoState, action: IDesktopRepoAction): IRepoState => {
    switch (action.type) {
        case DesktopRepoActionType.CREATE_REPO_SUCCESS: {
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

        case DesktopRepoActionType.SELECT_REPO_SUCCESS: {
            const { path } = action.payload
            return {
                ...state,
                selectedRepo: path,
                selectedFile: undefined,
                selectedCommit: undefined,
            }
        }

        case DesktopRepoActionType.FETCH_FULL_REPO_SUCCESS: {
            const { path, repoID } = action.payload
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [path]: {
                        ...(state.repos[path] || {}),
                        repoID,
                        path,
                        hasBeenFetched: true,
                    },
                },
            }
        }

        case DesktopRepoActionType.FETCH_REPO_FILES_SUCCESS: {
            const { path, files } = action.payload
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [path]: {
                        ...(state.repos[path] || {}),
                        path,
                        files,
                    },
                },
            }
        }

        case DesktopRepoActionType.FETCH_REPO_TIMELINE_SUCCESS: {
            const { path, timeline } = action.payload
            const commits = {} as { [commit: string]: ITimelineEvent }
            const commitList = [] as string[]
            for (let commit of timeline) {
                commits[commit.commit] = commit
                commitList.push(commit.commit)
            }
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [path]: {
                        ...(state.repos[path] || {}),
                        path,
                        commits,
                        commitList,
                    },
                },
            }
        }

        case RepoActionType.GET_DIFF_SUCCESS: {
            const { commit, diffs, repoRoot } = action.payload
            if (!repoRoot) {
                throw new Error('repoReducer GET_DIFF_SUCCESS: repoRoot can never be null')
            }
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [repoRoot]: {
                        ...(state.repos[repoRoot] || {}),
                        path: repoRoot,
                        commits: {
                            ...((state.repos[repoRoot] || {}).commits || {}),
                            [commit]: {
                                ...(((state.repos[repoRoot] || {}).commits || {})[commit] || {}),
                                diffs,
                            },
                        },
                    },
                },
            }
        }

        case DesktopRepoActionType.CHECKPOINT_REPO: {
            return {
                ...state,
                checkpointed: false,
            }
        }

        case DesktopRepoActionType.SELECT_FILE: {
            const { selectedFile } = action.payload
            return {
                ...state,
                selectedFile,
            }
        }

        case DesktopRepoActionType.SELECT_COMMIT: {
            const { selectedCommit } = action.payload
            return {
                ...state,
                selectedCommit,
                repoPage: RepoPage.History,
            }
        }

        case DesktopRepoActionType.NAVIGATE_REPO_PAGE: {
            const { repoPage } = action.payload
            return {
                ...state,
                repoPage,
                selectedFile: undefined,
            }
        }

        case DesktopRepoActionType.FETCH_REPO_USERS_PERMISSIONS_SUCCESS: {
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

        case DesktopRepoActionType.PULL_REPO_SUCCESS: {
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

