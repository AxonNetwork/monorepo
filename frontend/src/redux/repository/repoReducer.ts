import { RepoActionType, IRepoAction } from './repoActions'
import { IRepo } from '../../common'

const initialState = {
    repos: {},
    selectedRepo: null,
    selectedFile: null,
    checkpointed: false,
    hypothesis: null,
}

export interface IRepoState {
    repos: { [folderPath: string]: IRepo & { behindRemote: boolean } }
    selectedRepo: string | null
    selectedFile: {
        file: string
        isFolder: boolean
    } | null
    checkpointed: boolean
    hypothesis: string | null
}

const repoReducer = (state: IRepoState = initialState, action: IRepoAction): IRepoState => {
    switch (action.type) {
        case RepoActionType.CREATE_REPO_SUCCESS:
        case RepoActionType.FETCHED_REPO:
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [action.repo.folderPath]: action.repo,
                }
            }

        case RepoActionType.SELECT_REPO:
            return {
                ...state,
                selectedRepo: action.repo.folderPath,
                selectedFile: null,
            }

        case RepoActionType.FETCHED_FILES:
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [action.folderPath]: {
                        ...state.repos[action.folderPath],
                        files: action.files,
                    }
                }
            }

        case RepoActionType.FETCHED_TIMELINE:
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [action.folderPath]: {
                        ...state.repos[action.folderPath],
                        timeline: action.timeline
                    }
                }
            }

        case RepoActionType.GET_DIFF_SUCCESS:
            const updatedTimeline = state.repos[action.folderPath].timeline.map(e => {
                let diffs = {
                    ...e.diffs,
                }
                if (e.commit === action.commit) {
                    diffs[action.filename] = action.diff
                }
                return {
                    ...e,
                    diffs,
                }
            })
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [action.folderPath]: {
                        ...state.repos[action.folderPath],
                        timeline: updatedTimeline,
                    }
                }
            }

        case RepoActionType.CHECKPOINT_REPO:
            return {
                ...state,
                checkpointed: false
            }

        case RepoActionType.SELECT_FILE:
            return {
                ...state,
                selectedFile: {
                    file: action.file,
                    isFolder: action.isFolder
                }
            }

        case RepoActionType.BEHIND_REMOTE:
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [action.folderPath]: {
                        ...state.repos[action.folderPath],
                        behindRemote: true
                    }
                }
            }

        case RepoActionType.ADD_HYPOTHESIS:
            return {
                ...state,
                hypothesis: action.hypothesis
            }

        case RepoActionType.ADD_COLLABORATOR_SUCCESS:
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [action.folderPath]: {
                        ...(state.repos[action.folderPath] || {}),
                        sharedUsers: [
                            ...((state.repos[action.folderPath] || {}).sharedUsers || []),
                            action.email,
                        ]
                    }
                }
            }

        default:
            return state
    }
}

export default repoReducer
