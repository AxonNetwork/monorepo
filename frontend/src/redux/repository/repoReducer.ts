import { RepoActionType, IRepoAction } from './repoActions'
import { IRepo } from '../../common'

const initialState = {
    repos: {},
    selectedRepo: undefined,
    selectedFile: undefined,
    checkpointed: false,
    // hypothesis: null,
}

export interface IRepoState {
    repos: { [folderPath: string]: IRepo }
    selectedRepo: string | undefined
    selectedFile: {
        file: string
        isFolder: boolean
    } | undefined
    checkpointed: boolean
    // hypothesis: string | null
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
            }
        }

        case RepoActionType.FETCH_FULL_REPO_SUCCESS: {
            const { path } = action.payload
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [path]: {
                        ...(state.repos[path] || {}),
                        hasBeenFetched: true,
                    },
                }
            }
        }

        case RepoActionType.FETCH_REPO_FILES_SUCCESS: {
            const { path, files } = action.payload
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [path]: {
                        ...state.repos[path],
                        files,
                    }
                }
            }
        }

        case RepoActionType.FETCH_REPO_TIMELINE_SUCCESS: {
            const { path, timeline } = action.payload
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [path]: {
                        ...state.repos[path],
                        timeline,
                    }
                }
            }
        }

        case RepoActionType.GET_DIFF_SUCCESS: {
            const { commit, diff, filename, folderPath } = action.payload
            const timeline = ((state.repos[folderPath] || {}).timeline || []).map(e => {
                let diffs = { ...e.diffs }
                if (e.commit === commit) {
                    diffs[filename] = diff
                }
                return { ...e, diffs }
            })
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [folderPath]: {
                        ...state.repos[folderPath],
                        timeline,
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
            const { file, isFolder } = action.payload
            return {
                ...state,
                selectedFile: {
                    file,
                    isFolder,
                },
            }
        }

        // case RepoActionType.ADD_HYPOTHESIS: {
        //     return {
        //         ...state,
        //         hypothesis: action.hypothesis
        //     }

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
                        ]
                    }
                }
            }
        }

        default:
            return state
    }
}

export default repoReducer
