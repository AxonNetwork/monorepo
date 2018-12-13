import { RepoActionType, IRepoAction } from './repoActions'
import { IRepo } from 'conscience-lib/common'

const initialState = {
	repos: {},
}

export interface IRepoState {
	repos: {[repoID: string]: IRepo}
}

const repoReducer = (state: IRepoState = initialState, action: IRepoAction): IRepoState => {
	switch(action.type) {
		case RepoActionType.GET_REPO_LIST_SUCCESS: {
			return {
				repos: action.payload.repos
			}
		}

		case RepoActionType.GET_REPO_SUCCESS: {
			const { repo } = action.payload
			return {
				repos: {
					...state.repos,
					[repo.repoID]: repo
				}
			}
		}

		case RepoActionType.GET_FILE_CONTENTS_SUCCESS:
		case RepoActionType.SAVE_FILE_CONTENTS_SUCCESS: {
			const { repoID, filename, contents } = action.payload
			return {
				repos: {
					...state.repos,
					[repoID]: {
						...state.repos[repoID],
						files: {
							...state.repos[repoID].files,
							[filename]: {
								...(state.repos[repoID].files || {})[filename],
								contents: contents
							}
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

		default:
			return state
	}
}

export default repoReducer
