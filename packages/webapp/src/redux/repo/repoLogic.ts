import {
	RepoActionType,
    IGetRepoListAction, IGetRepoListSuccessAction,
    IGetRepoAction, IGetRepoSuccessAction,
    IGetFileContentsAction, IGetFileContentsSuccessAction,
    ISaveFileContentsAction, ISaveFileContentsSuccessAction,
    IGetDiffAction, IGetDiffSuccessAction,
} from './repoActions'
import { makeLogic } from '../reduxUtils'
import { getDiscussions } from '../discussion/discussionActions'
import ServerRelay from 'conscience-lib/ServerRelay'

const getRepoListLogic = makeLogic<IGetRepoListAction, IGetRepoListSuccessAction>({
    type: RepoActionType.GET_REPO_LIST,
    async process({ action }, dispatch) {
        const repos = {
        	protocol: {
        		repoID: "protocol"
        	},
            testmcjones: {
                repoID: "testmcjones"
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
        dispatch(getDiscussions({ repoID }))
        return { repo }
    }
})

const getFileContentsLogic = makeLogic<IGetFileContentsAction, IGetFileContentsSuccessAction>({
    type: RepoActionType.GET_FILE_CONTENTS,
    async process({ action }, dispatch) {
        const { repoID, filename } = action.payload
        const resp = await ServerRelay.getFileContents(repoID, filename)
        const contents = resp.contents
        return { repoID, filename, contents}
    }
})

const saveFileContentsLogic = makeLogic<ISaveFileContentsAction, ISaveFileContentsSuccessAction>({
    type: RepoActionType.SAVE_FILE_CONTENTS,
    async process({ action }, dispatch) {
        const { repoID, filename, contents, callback } = action.payload
        try{
            await ServerRelay.saveFileContents(repoID, filename, contents)
        }catch(err){
            callback(err)
        }
        callback()
        return { repoID, filename, contents}
    }
})

const getDiffLogic = makeLogic<IGetDiffAction, IGetDiffSuccessAction>({
    type: RepoActionType.GET_DIFF,
    async process({ action }, dispatch) {
        const { repoID, commit } = action.payload
        const resp = await ServerRelay.getDiff(repoID, commit)
        const diffs = resp.diffs
        return { repoID, commit, diffs}
    }
})

export default [
	getRepoListLogic,
	getRepoLogic,
    getFileContentsLogic,
    saveFileContentsLogic,
    getDiffLogic,
]
