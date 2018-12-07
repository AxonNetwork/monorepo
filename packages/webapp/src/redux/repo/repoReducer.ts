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

		default:
			return state
	}
}

export default repoReducer
