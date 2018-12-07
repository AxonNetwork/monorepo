import {
	RepoActionType,
    IGetRepoListAction, IGetRepoListSuccessAction,
    IGetRepoAction, IGetRepoSuccessAction,
} from './repoActions'
import { makeLogic } from '../reduxUtils'
import ServerRelay from 'conscience-lib/ServerRelay'

const getRepoListLogic = makeLogic<IGetRepoListAction, IGetRepoListSuccessAction>({
    type: RepoActionType.GET_REPO_LIST,
    async process({ action }, dispatch) {
        const repos = {
        	protocol: {
        		repoID: "protocol"
        	}
        }

        return { repos }
    }
})

const getRepoLogic = makeLogic<IGetRepoAction, IGetRepoSuccessAction>({
    type: RepoActionType.GET_REPO,
    async process({ action }, dispatch) {
        const { repoID } = action.payload
        const repo = await ServerRelay.getRepo(repoID)
        return { repo }
    }
})

export default [
	getRepoListLogic,
	getRepoLogic,
]
