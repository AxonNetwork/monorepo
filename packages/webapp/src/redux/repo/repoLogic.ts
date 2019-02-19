import parseDiff from 'conscience-lib/utils/parseDiff'
import {
    RepoActionType,
    IFetchRepoFilesAction, IFetchRepoFilesSuccessAction,
    IFetchRepoTimelineAction, IFetchRepoTimelineSuccessAction,
    IFetchUpdatedRefEventsAction, IFetchUpdatedRefEventsSuccessAction,
    IFetchRepoUsersPermissionsAction, IFetchRepoUsersPermissionsSuccessAction,
    IGetDiffAction, IGetDiffSuccessAction,
    IUpdateUserPermissionsAction, IUpdateUserPermissionsSuccessAction,
    ISetRepoPublicAction, ISetRepoPublicSuccessAction,
} from 'conscience-components/redux/repo/repoActions'
import {
    fetchUserDataByUsername
} from 'conscience-components/redux/user/userActions'
import {
    getRepoListLogic,
    fetchFullRepoLogic,
} from 'conscience-components/redux/repo/repoLogic'
import { makeLogic } from 'conscience-components/redux/reduxUtils'
import { getRepoID } from 'conscience-components/env-specific'
import ServerRelay from 'conscience-lib/ServerRelay'
import keyBy from 'lodash/keyBy'
import union from 'lodash/union'



const fetchRepoFilesLogic = makeLogic<IFetchRepoFilesAction, IFetchRepoFilesSuccessAction>({
    type: RepoActionType.FETCH_REPO_FILES,
    async process({ action }) {
        const { uri } = action.payload
        const repoID = getRepoID(uri)
        const files = await ServerRelay.getRepoFiles(repoID)
        return { uri, files }
    },
})

const fetchRepoTimelineLogic = makeLogic<IFetchRepoTimelineAction, IFetchRepoTimelineSuccessAction>({
    type: RepoActionType.FETCH_REPO_TIMELINE,
    async process({ action }) {
        const { uri } = action.payload
        const repoID = getRepoID(uri)
        const timeline = await ServerRelay.getRepoTimeline(repoID)
        return { uri, timeline }
    },
})

const fetchUpdatedRefEventsLogic = makeLogic<IFetchUpdatedRefEventsAction, IFetchUpdatedRefEventsSuccessAction>({
    type: RepoActionType.FETCH_UPDATED_REF_EVENTS,
    async process({ action }) {
        const { uri } = action.payload
        const repoID = getRepoID(uri)
        const eventsList = await ServerRelay.getUpdatedRefEvents(repoID)
        const updatedRefEvents = keyBy(eventsList, 'commit')
        return { updatedRefEvents }
    },
})

const fetchRepoUsersPermissionsLogic = makeLogic<IFetchRepoUsersPermissionsAction, IFetchRepoUsersPermissionsSuccessAction>({
    type: RepoActionType.FETCH_REPO_USERS_PERMISSIONS,
    async process({ action }, dispatch) {
        const { uri } = action.payload
        const repoID = getRepoID(uri)
        const { admins, pushers, pullers, isPublic } = await ServerRelay.getRepoUsersPermissions(repoID)
        const usernames = union(admins, pushers, pullers)
        await dispatch(fetchUserDataByUsername({ usernames: usernames }))
        return { repoID, admins, pushers, pullers, isPublic }
    },
})

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

        const diff = await ServerRelay.getDiff({ repoID, commit })

        return { uri, commit, diff: parseDiff(diff) }
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

    // web-specific
    fetchRepoFilesLogic,
    fetchRepoTimelineLogic,
    fetchUpdatedRefEventsLogic,
    fetchRepoUsersPermissionsLogic,
    getDiffLogic,
    updateUserPermissionsLogic,
    setRepoPublicLogic,
]
