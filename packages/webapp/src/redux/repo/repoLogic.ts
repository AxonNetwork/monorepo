import parseDiff from 'conscience-lib/utils/parseDiff'
import {
    RepoActionType,
    IGetRepoListAction, IGetRepoListSuccessAction,
    IFetchFullRepoAction, IFetchFullRepoSuccessAction,
    IGetDiffAction, IGetDiffSuccessAction,
    IUpdateUserPermissionsAction, IUpdateUserPermissionsSuccessAction,
    fetchFullRepoFromServer
} from 'conscience-components/redux/repo/repoActions'
import { makeLogic } from 'conscience-components/redux/reduxUtils'
import { getRepo as getRepoFromURI } from 'conscience-components/env-specific'
import ServerRelay from 'conscience-lib/ServerRelay'
import {
    getRepoListLogic,
    fetchFullRepoFromServerLogic
} from 'conscience-components/redux/repo/repoLogic'

const fetchFullRepoLogic = makeLogic<IFetchFullRepoAction, IFetchFullRepoSuccessAction>({
    type: RepoActionType.FETCH_FULL_REPO,
    async process({ action }, dispatch) {
        const { uri } = action.payload
        await dispatch(fetchFullRepoFromServer({ uri }))
        return { uri }
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
    // imported from conscience-components
    getRepoListLogic,
    fetchFullRepoFromServerLogic,

    // web-specific
    fetchFullRepoLogic,
    fetchFullRepoFromServerLogic,
    getDiffLogic,
    updateUserPermissionsLogic,
]
