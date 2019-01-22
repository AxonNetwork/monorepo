import union from 'lodash/union'
import {
    RepoActionType,
    IGetRepoListAction, IGetRepoListSuccessAction,
    IGetDiffAction, IGetDiffSuccessAction,
    IUpdateUserPermissionsAction, IUpdateUserPermissionsSuccessAction,
} from 'conscience-components/redux/repo/repoActions'
import { WebRepoActionType, IGetRepoAction, IGetRepoSuccessAction, getRepo } from './repoActions'
import { makeLogic } from 'conscience-components/redux/reduxUtils'
import { getDiscussions } from 'conscience-components/redux/discussion/discussionActions'
import { fetchUserDataByUsername } from 'conscience-components/redux/user/userActions'
import ServerRelay from 'conscience-lib/ServerRelay'
import { URIType } from 'conscience-lib/common'

const getRepoListLogic = makeLogic<IGetRepoListAction, IGetRepoListSuccessAction>({
    type: RepoActionType.GET_REPO_LIST,
    async process({ action }, dispatch) {
        const { username } = action.payload
        const repoList = await ServerRelay.getRepoList(username)
        await Promise.all(repoList.map(repoID => dispatch(getRepo({ repoID }))))
        return { username, repoList }
    }
})

const getRepoLogic = makeLogic<IGetRepoAction, IGetRepoSuccessAction>({
    type: WebRepoActionType.GET_REPO,
    async process({ action }, dispatch) {
        const { repoID } = action.payload
        const repo = await ServerRelay.getRepo(repoID)
        if (repo instanceof Error) {
            return repo
        }
        const { admins, pushers, pullers } = repo
        const usernames = union(admins, pushers, pullers)
        dispatch(getDiscussions({ uri: { type: URIType.Network, repoID } }))
        dispatch(fetchUserDataByUsername({ usernames }))
        return { repo }
    }
})

const getDiffLogic = makeLogic<IGetDiffAction, IGetDiffSuccessAction>({
    type: RepoActionType.GET_DIFF,
    async process({ action }, dispatch) {
        const { repoID, commit } = action.payload
        if (!repoID) {
            throw new Error('repoLogic.getDiffLogic: repoID must be specified')
        }
        const resp = await ServerRelay.getDiff(repoID, commit)
        const diffs = resp.diffs
        return { repoID, commit, diffs }
    }
})

const updateUserPermissionsLogic = makeLogic<IUpdateUserPermissionsAction, IUpdateUserPermissionsSuccessAction>({
    type: RepoActionType.UPDATE_USER_PERMISSIONS,
    async process({ action }, dispatch) {
        const { repoID, username, admin, pusher, puller } = action.payload
        const { admins, pushers, pullers } = await ServerRelay.updateUserPermissions(repoID, username, admin, pusher, puller)
        return { repoID, admins, pushers, pullers }
    }
})

export default [
    getRepoListLogic,
    getRepoLogic,
    getDiffLogic,
    updateUserPermissionsLogic,
]
