import { FETCHED_REPO, SELECT_REPO, FETCHED_FULL_REPO, FETCHED_FILES, FETCHED_FILE, FETCHED_TIMELINE, GET_DIFF_SUCCESS, REMOVED_FILE, REPO_WATCHER_ADDED,
    CHECKPOINT_REPO, SELECT_FILE, UNSELECT_FILE,
    ADD_HYPOTHESIS, ADD_COLLABORATOR_SUCCESS, CREATE_REPO_SUCCESS, BEHIND_REMOTE} from './repoActions'

const initialState = {
    repos: {}
}

const repoReducer = (state = initialState, action) => {
    switch(action.type){
        case CREATE_REPO_SUCCESS:
        case FETCHED_REPO:
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [action.repo.folderPath]: action.repo
                }
            }
        case SELECT_REPO:
            return {
                ...state,
                selectedRepo: action.repo.folderPath,
                selectedFile: undefined
            }
        case FETCHED_FULL_REPO:
            return action.payload
        case FETCHED_FILES:
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [action.folderPath]: {
                        ...state.repos[action.folderPath],
                        files: action.files
                    }
                }
            }
        case FETCHED_TIMELINE:
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
        case GET_DIFF_SUCCESS:
            const updatedTimeline = state.repos[action.folderPath].timeline.map(e=>{
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

        case REMOVED_FILE:
            const {[action.filename]: toRemove, ...withoutRemoved} = state.files
            return {
                ...state,
                files: withoutRemoved
            }

        case CHECKPOINT_REPO:
            return {
                ...state,
                checkpointed: false
            }

        case SELECT_FILE:
            return {
                ...state,
                selectedFile: {
                    file: action.file,
                    isFolder: action.isFolder
                }
            }

        case UNSELECT_FILE:
            return {
                ...state,
                selectedFile: undefined
            }

        case BEHIND_REMOTE:
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

        case REPO_WATCHER_ADDED:
            return {
                ...state,
                watcher: action.watcher
            }

        case ADD_HYPOTHESIS:
            return {
                ...state,
                hypothesis: action.hypothesis
            }

        case ADD_COLLABORATOR_SUCCESS:
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [action.folderPath]: {
                        ...(state.repos[action.folderPath] || {}),
                        sharedUsers:[
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
