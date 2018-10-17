import { RepoActionType, IRepoAction } from './repoActions'
import { IRepo, ITimelineEvent } from '../../common'

export enum RepoPage {
    Files,
    Manuscript,
    History,
    Discussion,
    Settings,
}


const initialState = {
    repos: {},
    repoPage: RepoPage.Files,
    selectedRepo: undefined,
    selectedFile: undefined,
    selectedCommit: undefined,
    checkpointed: false,
}

export interface IRepoState {
    repos: { [folderPath: string]: IRepo }
    selectedRepo: string | undefined
    repoPage: RepoPage
    selectedFile: {
        file: string
        isFolder: boolean,
    } | undefined
    selectedCommit: string | undefined
    checkpointed: boolean
}

const repoReducer = (state: IRepoState = initialState, action: IRepoAction): IRepoState => {
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
            }
        }

        case RepoActionType.GET_LOCAL_REPOS_SUCCESS: {
            const { repos } = action.payload
            return {
                ...state,
                repos: {
                    ...state.repos,
                    ...repos,
                },
            }
        }

        case RepoActionType.SELECT_REPO_SUCCESS: {
            const { path } = action.payload
            return {
                ...state,
                selectedRepo: path,
                selectedFile: undefined,
                selectedCommit: undefined,
            }
        }

        case RepoActionType.FETCH_FULL_REPO_SUCCESS: {
            const { path, repoID } = action.payload
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [path]: {
                        ...(state.repos[path] || {}),
                        repoID: repoID,
                        hasBeenFetched: true,
                    },
                },
            }
        }

        case RepoActionType.FETCH_REPO_FILES_SUCCESS: {
            const { path, files } = action.payload
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [path]: {
                        ...(state.repos[path] || {}),
                        files,
                    },
                },
            }
        }

        case RepoActionType.FETCH_REPO_TIMELINE_SUCCESS: {
            const { path, timeline } = action.payload
            const commits = {} as {[commit: string]: ITimelineEvent}
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
                        commits,
                        commitList,
                    },
                },
            }
        }

        case RepoActionType.GET_DIFF_SUCCESS: {
            const { commit, diffs, repoRoot } = action.payload
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [repoRoot]: {
                        ...(state.repos[repoRoot] || {}),
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

        case RepoActionType.CHECKPOINT_REPO: {
            return {
                ...state,
                checkpointed: false,
            }
        }

        case RepoActionType.SELECT_FILE: {
            const { selectedFile } = action.payload
            return {
                ...state,
                selectedFile,
            }
        }

        case RepoActionType.SELECT_COMMIT: {
            const { selectedCommit } = action.payload
            return {
                ...state,
                selectedCommit,
            }
        }

        case RepoActionType.NAVIGATE_REPO_PAGE: {
            const { repoPage } = action.payload
            return {
                ...state,
                repoPage,
            }
        }

        case RepoActionType.FETCH_REPO_SHARED_USERS_SUCCESS: {
            const { path, sharedUsers } = action.payload
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [path]: {
                        ...state.repos[path],
                        sharedUsers: sharedUsers,
                    },
                },
            }
        }

        case RepoActionType.ADD_COLLABORATOR_SUCCESS: {
            const { folderPath, email } = action.payload
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [folderPath]: {
                        ...(state.repos[folderPath] || {}),
                        sharedUsers: [
                            ...((state.repos[folderPath] || {}).sharedUsers || []),
                            email,
                        ],
                    },
                },
            }
        }

        case RepoActionType.REMOVE_COLLABORATOR_SUCCESS: {
            const { folderPath, email } = action.payload
            const sharedUsers = ((state.repos[folderPath] || {}).sharedUsers || []).filter(e => e !== email)
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [folderPath]: {
                        ...(state.repos[folderPath] || {}),
                        sharedUsers: sharedUsers,
                    },
                },
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
                        behindRemote: false
                    }
                }
            }
        }

        case RepoActionType.BEHIND_REMOTE: {
            const { path } = action.payload
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [path]: {
                        ...state.repos[path],
                        behindRemote: true,
                    },
                },
            }
        }

        default:
            return state
    }
}

export default repoReducer