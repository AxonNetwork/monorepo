import {
	RepoActionType,
    IGetRepoListAction, IGetRepoListSuccessAction,
    IGetRepoAction, IGetRepoSuccessAction,
    IGetFileContentsAction, IGetFileContentsSuccessAction,
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

const getFileContents = makeLogic<IGetFileContentsAction, IGetFileContentsSuccessAction>({
    type: RepoActionType.GET_FILE_CONTENTS,
    async process({ action }, dispatch) {
        const { repoID, filename } = action.payload
        const resp = await ServerRelay.getFileContents(repoID, filename)
        const contents = resp.contents
        return { repoID, filename, contents}
    }
})

export default [
	getRepoListLogic,
	getRepoLogic,
    getFileContents,
]
