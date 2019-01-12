import {
	RepoActionType,
    IGetRepoListAction, IGetRepoListSuccessAction,
    IGetRepoAction, IGetRepoSuccessAction,
    IGetDiffAction, IGetDiffSuccessAction,
    IAddCollaboratorAction, IAddCollaboratorSuccessAction,
    IRemoveCollaboratorAction, IRemoveCollaboratorSuccessAction,
    getRepo,
} from './repoActions'
import { makeLogic } from '../reduxUtils'
import { getDiscussions } from '../discussion/discussionActions'
import { fetchUserData, fetchUserDataByUsername } from '../user/userActions'
import ServerRelay from 'conscience-lib/ServerRelay'
import { union } from 'lodash'

const getRepoListLogic = makeLogic<IGetRepoListAction, IGetRepoListSuccessAction>({
    type: RepoActionType.GET_REPO_LIST,
    async process({ action }, dispatch) {
        const repoList = await ServerRelay.getRepoList()
        await Promise.all(repoList.map(repoID => dispatch(getRepo({ repoID }))))
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
        const { admins, pushers, pullers } = repo
        const usernames = union(admins, pushers, pullers)
        dispatch(getDiscussions({ repoID }))
        dispatch(fetchUserDataByUsername({ usernames }))
        return { repo }
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
    getDiffLogic,
    addCollaboratorLogic,
    removeCollaboratorLogic,
]
