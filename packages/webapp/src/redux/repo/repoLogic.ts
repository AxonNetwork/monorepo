import {
	RepoActionType,
    IGetRepoListAction, IGetRepoListSuccessAction,
    IGetRepoAction, IGetRepoSuccessAction,
    IGetFileContentsAction, IGetFileContentsSuccessAction,
    ISaveFileContentsAction, ISaveFileContentsSuccessAction,
    IGetDiffAction, IGetDiffSuccessAction,
    IAddCollaboratorAction, IAddCollaboratorSuccessAction,
    IRemoveCollaboratorAction, IRemoveCollaboratorSuccessAction,
} from './repoActions'
import { makeLogic } from '../reduxUtils'
import { getDiscussions } from '../discussion/discussionActions'
import { fetchUserData } from '../user/userActions'
import ServerRelay from 'conscience-lib/ServerRelay'

const getRepoListLogic = makeLogic<IGetRepoListAction, IGetRepoListSuccessAction>({
    type: RepoActionType.GET_REPO_LIST,
    async process({ action }, dispatch) {
        const repoList = await ServerRelay.getRepoList()
        return { repoList }
    }
})

const getRepoLogic = makeLogic<IGetRepoAction, IGetRepoSuccessAction>({
    type: RepoActionType.GET_REPO,
    async process({ action }, dispatch) {
        const { repoID } = action.payload
        const repo = await ServerRelay.getRepo(repoID)
        if(repo instanceof Error){
            return repo
        }
        dispatch(getDiscussions({ repoID }))
        dispatch(fetchUserData({ userIDs: repo.sharedUsers || [] }))
        return { repo }
    }
})

const getFileContentsLogic = makeLogic<IGetFileContentsAction, IGetFileContentsSuccessAction>({
    type: RepoActionType.GET_FILE_CONTENTS,
    async process({ action }, dispatch) {
        const { repoID, filename, callback } = action.payload
        const resp = await ServerRelay.getFile(repoID, filename)
        const { exists, file } = resp
        if(!exists) {
            const err = new Error('file does not exist')
            if(callback){
                callback(err)
            }
            return err
        }
        if(callback){
            callback()
        }
        return { repoID, filename, file }
    }
})

const saveFileContentsLogic = makeLogic<ISaveFileContentsAction, ISaveFileContentsSuccessAction>({
    type: RepoActionType.SAVE_FILE_CONTENTS,
    async process({ action }, dispatch) {
        const { repoID, filename, contents, callback } = action.payload
        let file
        try{
            file = await ServerRelay.saveFileContents(repoID, filename, contents)
        }catch(err){
            callback(err)
            return err
        }
        callback()
        return { repoID, filename, file }
    }
})

const getDiffLogic = makeLogic<IGetDiffAction, IGetDiffSuccessAction>({
    type: RepoActionType.GET_DIFF,
    async process({ action }, dispatch) {
        const { repoID, commit } = action.payload
        const resp = await ServerRelay.getDiff(repoID, commit)
        const diffs = resp.diffs
        return { repoID, commit, diffs }
    }
})

const addCollaboratorLogic = makeLogic<IAddCollaboratorAction, IAddCollaboratorSuccessAction>({
    type: RepoActionType.ADD_COLLABORATOR,
    async process({ action }, dispatch) {
        const { repoID, email } = action.payload
        const { userID } = await ServerRelay.shareRepo(repoID, undefined, email)
        await dispatch(fetchUserData({ userIDs: [userID] }))
        return { repoID, userID }
    }
})

const removeCollaboratorLogic = makeLogic<IRemoveCollaboratorAction, IRemoveCollaboratorSuccessAction>({
    type: RepoActionType.REMOVE_COLLABORATOR,
    async process({ action }, dispatch) {
        const { repoID, userID } = action.payload
        await ServerRelay.unshareRepo(repoID, userID)
        return { repoID, userID }
    }
})

export default [
	getRepoListLogic,
	getRepoLogic,
    getFileContentsLogic,
    saveFileContentsLogic,
    getDiffLogic,
    addCollaboratorLogic,
    removeCollaboratorLogic,
]
