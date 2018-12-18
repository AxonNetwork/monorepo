import { RepoActionType, IRepoAction } from './repoActions'
import { IRepo } from 'conscience-lib/common'
import { uniq } from 'lodash'

const initialState = {
	repos: {},
	repoList: [],
}

export interface IRepoState {
	repos: {[repoID: string]: IRepo}
	repoList: string[]
}

const repoReducer = (state: IRepoState = initialState, action: IRepoAction): IRepoState => {
	switch(action.type) {
		case RepoActionType.GET_REPO_LIST_SUCCESS: {
			return {
				...state,
				repoList: action.payload.repoList
			}
		}

		case RepoActionType.GET_REPO_SUCCESS: {
			const { repo } = action.payload
			return {
				...state,
				repos: {
					...state.repos,
					[repo.repoID]: repo
				}
			}
		}

		case RepoActionType.GET_FILE_CONTENTS_SUCCESS:
		case RepoActionType.SAVE_FILE_CONTENTS_SUCCESS: {
			const { repoID, filename, file } = action.payload
			return {
				...state,
				repos: {
					...state.repos,
					[repoID]: {
						...state.repos[repoID],
						files: {
							...state.repos[repoID].files,
							[filename]: file
						}
					}
				}
			}
		}

        case RepoActionType.GET_DIFF_SUCCESS: {
            const { repoID, commit, diffs } = action.payload
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

        case RepoActionType.ADD_COLLABORATOR_SUCCESS: {
        	const { repoID, userID } = action.payload
        	return {
        		...state,
        		repos: {
        			...state.repos,
        			[repoID]: {
        				...(state.repos[repoID] || {}),
        				sharedUsers: [
        					...((state.repos[repoID] || {}).sharedUsers || []),
    						userID
        				]
        			}
        		}
        	}
        }

        case RepoActionType.REMOVE_COLLABORATOR_SUCCESS: {
            const { repoID, userID } = action.payload
            const sharedUsers = uniq(((state.repos[repoID] || {}).sharedUsers || []).filter(id => id !== userID))
            return {
                ...state,
                repos: {
                    ...state.repos,
                    [repoID]: {
                        ...(state.repos[repoID] || {}),
                        path: repoID,
                        sharedUsers,
                    },
                },
            }
        }

		default:
			return state
	}
}

export default repoReducer
