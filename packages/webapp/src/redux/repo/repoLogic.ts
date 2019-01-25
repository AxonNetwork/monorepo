import union from 'lodash/union'
import parseDiff from 'conscience-lib/utils/parseDiff'
import {
    RepoActionType,
    IGetRepoListAction, IGetRepoListSuccessAction,
    IFetchFullRepoAction, IFetchFullRepoSuccessAction,
    IGetDiffAction, IGetDiffSuccessAction,
    IUpdateUserPermissionsAction, IUpdateUserPermissionsSuccessAction,
    // fetchFullRepo
} from 'conscience-components/redux/repo/repoActions'
import {
    WebRepoActionType,
    IFetchFullRepoFromServerAction, IFetchFullRepoFromServerSuccessAction,
    fetchFullRepoFromServer
} from './repoActions'
import { makeLogic } from 'conscience-components/redux/reduxUtils'
import { getDiscussions } from 'conscience-components/redux/discussion/discussionActions'
import { fetchUserDataByUsername } from 'conscience-components/redux/user/userActions'
import { getRepo as getRepoFromURI, getRepoID } from 'conscience-components/env-specific'
import ServerRelay from 'conscience-lib/ServerRelay'

const getRepoListLogic = makeLogic<IGetRepoListAction, IGetRepoListSuccessAction>({
    type: RepoActionType.GET_REPO_LIST,
    async process({ action }, dispatch) {
        const { username } = action.payload
        const repoList = await ServerRelay.getRepoList(username)
        // await Promise.all(repoList.map(repoID => dispatch(fetchFullRepo({ repoID }))))
        return { username, repoList }
    }
})

const fetchFullRepoLogic = makeLogic<IFetchFullRepoAction, IFetchFullRepoSuccessAction>({
    type: RepoActionType.FETCH_FULL_REPO,
    async process({ action }, dispatch) {
        const { uri } = action.payload
        await dispatch(fetchFullRepoFromServer({ uri }))
        return { uri }
    },
})

const fetchFullRepoFromServerLogic = makeLogic<IFetchFullRepoFromServerAction, IFetchFullRepoFromServerSuccessAction>({
    type: WebRepoActionType.FETCH_FULL_REPO_FROM_SERVER,
    async process({ action }, dispatch) {
        const { uri } = action.payload
        const repoID = getRepoID(uri)
        const repo = await ServerRelay.getRepo(repoID)
        if (repo instanceof Error) {
            return repo
        }
        const { admins, pushers, pullers } = repo
        const usernames = union(admins, pushers, pullers)
        await dispatch(getDiscussions({ uri }))
        await dispatch(fetchUserDataByUsername({ usernames }))
        return { uri, repo }
    },
})

const getDiffLogic = makeLogic<IGetDiffAction, IGetDiffSuccessAction>({
    type: RepoActionType.GET_DIFF,
    async process({ action, getState }, dispatch) {
        const { uri, commit } = action.payload
        const repoID = (getRepoFromURI(uri) || {}).repoID
        if (repoID === undefined) {
            throw new Error("could not find repo ${repoID}")
        }

        const state = getState()
        if (state.repo.diffsByCommitHash[commit]) {
            return
        }

        const diff = await ServerRelay.getDiff({ repoID, commit })
        const parsed = parseDiff(diff)

        return { uri, commit, diff: parsed }
    }
})

const updateUserPermissionsLogic = makeLogic<IUpdateUserPermissionsAction, IUpdateUserPermissionsSuccessAction>({
    type: RepoActionType.UPDATE_USER_PERMISSIONS,
    async process({ action }, dispatch) {
        const { uri, username, admin, pusher, puller } = action.payload
        const repoID = (getRepoFromURI(uri) || {}).repoID
        const { admins, pushers, pullers } = await ServerRelay.updateUserPermissions(repoID, username, admin, pusher, puller)
        return { repoID, admins, pushers, pullers }
    }
})

export default [
    getRepoListLogic,
    fetchFullRepoLogic,
    fetchFullRepoFromServerLogic,
    getDiffLogic,
    updateUserPermissionsLogic,
]
