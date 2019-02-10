import {
    RepoActionType,
    IGetRepoListAction, IGetRepoListSuccessAction,
    IFetchFullRepoAction, IFetchFullRepoSuccessAction,
    IFetchFullRepoFromServerAction, IFetchFullRepoFromServerSuccessAction,
    fetchRepoFiles, fetchRepoTimeline, fetchRepoUsersPermissions,
    fetchLocalRefs, fetchRemoteRefs, fetchFullRepoFromServer,
    watchRepo,
} from './repoActions'
import { makeLogic } from 'conscience-components/redux/reduxUtils'
import { getDiscussionsForRepo } from 'conscience-components/redux/discussion/discussionActions'
import { fetchUserDataByUsername } from 'conscience-components/redux/user/userActions'
import { getRepoID } from 'conscience-components/env-specific'
import { URIType } from 'conscience-lib/common'
import ServerRelay from 'conscience-lib/ServerRelay'
import union from 'lodash/union'

const getRepoListLogic = makeLogic<IGetRepoListAction, IGetRepoListSuccessAction>({
    type: RepoActionType.GET_REPO_LIST,
    async process({ action }, dispatch) {
        const { username } = action.payload
        const repoList = await ServerRelay.getRepoList(username)
        return { username, repoList }
    }
})

const fetchFullRepoLogic = makeLogic<IFetchFullRepoAction, IFetchFullRepoSuccessAction>({
    type: RepoActionType.FETCH_FULL_REPO,
    async process({ action }, dispatch) {
        const { uri } = action.payload
        if (uri.type === URIType.Local) {
            await Promise.all([
                dispatch(fetchRepoFiles({ uri })),
                dispatch(fetchRepoTimeline({ uri })),
                dispatch(getDiscussionsForRepo({ uri })),
                dispatch(fetchRepoUsersPermissions({ uri })),
                dispatch(fetchLocalRefs({ uri })),
                dispatch(fetchRemoteRefs({ uri })),
            ])
        } else {
            await dispatch(fetchFullRepoFromServer({ uri }))
        }
        await dispatch(watchRepo({ uri }))
        return { uri }
    },
})

const fetchFullRepoFromServerLogic = makeLogic<IFetchFullRepoFromServerAction, IFetchFullRepoFromServerSuccessAction>({
    type: RepoActionType.FETCH_FULL_REPO_FROM_SERVER,
    async process({ action }, dispatch) {
        const { uri } = action.payload
        const repoID = getRepoID(uri)
        const repo = await ServerRelay.getRepo(repoID)
        if (repo instanceof Error) {
            return repo
        }
        const { admins, pushers, pullers } = repo
        const usernames = union(admins, pushers, pullers)
        await dispatch(getDiscussionsForRepo({ uri }))
        await dispatch(fetchUserDataByUsername({ usernames }))
        return { uri, repo }
    },
})

export {
    getRepoListLogic,
    fetchFullRepoLogic,
    fetchFullRepoFromServerLogic,
}
