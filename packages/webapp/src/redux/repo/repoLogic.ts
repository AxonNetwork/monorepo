import parseDiff from 'conscience-lib/utils/parseDiff'
import {
    RepoActionType,
    IGetDiffAction, IGetDiffSuccessAction,
    IUpdateUserPermissionsAction, IUpdateUserPermissionsSuccessAction,
    ISetRepoPublicAction, ISetRepoPublicSuccessAction,
} from 'conscience-components/redux/repo/repoActions'
import {
    getRepoListLogic,
    fetchFullRepoLogic,
    fetchFullRepoFromServerLogic,
} from 'conscience-components/redux/repo/repoLogic'
import { makeLogic } from 'conscience-components/redux/reduxUtils'
import { getRepoID } from 'conscience-components/env-specific'
import ServerRelay from 'conscience-lib/ServerRelay'


const getDiffLogic = makeLogic<IGetDiffAction, IGetDiffSuccessAction>({
    type: RepoActionType.GET_DIFF,
    async process({ action, getState }, dispatch) {
        const { uri, commit } = action.payload
        const repoID = getRepoID(uri)
        if (repoID === undefined) {
            throw new Error("could not find repo ${repoID}")
        }

        const state = getState()
        if (state.repo.diffsByCommitHash[commit]) {
            return
        }
        console.log("GET DIFF")
        console.log(repoID)
        console.log(commit)

        const diff = await ServerRelay.getDiff({ repoID, commit })
        const parsed = parseDiff(diff)

        return { uri, commit, diff: parsed }
    }
})

const updateUserPermissionsLogic = makeLogic<IUpdateUserPermissionsAction, IUpdateUserPermissionsSuccessAction>({
    type: RepoActionType.UPDATE_USER_PERMISSIONS,
    async process({ action }, dispatch) {
        const { uri, username, admin, pusher, puller } = action.payload
        const repoID = getRepoID(uri)
        const { admins, pushers, pullers } = await ServerRelay.updateUserPermissions(repoID, username, admin, pusher, puller)
        return { repoID, admins, pushers, pullers }
    }
})

const setRepoPublicLogic = makeLogic<ISetRepoPublicAction, ISetRepoPublicSuccessAction>({
    type: RepoActionType.SET_REPO_PUBLIC,
    async process({ action }, dispatch) {
        const { repoID, isPublic } = action.payload
        await ServerRelay.setRepoPublic(repoID, isPublic)
        return { repoID, isPublic }
    },
})

export default [
    // imported from conscience-components
    getRepoListLogic,
    fetchFullRepoLogic,
    fetchFullRepoFromServerLogic,

    // web-specific
    getDiffLogic,
    updateUserPermissionsLogic,
    setRepoPublicLogic,
]
