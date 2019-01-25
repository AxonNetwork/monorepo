import {
    RepoActionType,
    IGetRepoListAction, IGetRepoListSuccessAction,
    IFetchFullRepoFromServerAction, IFetchFullRepoFromServerSuccessAction,
} from './repoActions'
import { makeLogic } from 'conscience-components/redux/reduxUtils'
import { getDiscussions } from 'conscience-components/redux/discussion/discussionActions'
import { fetchUserDataByUsername } from 'conscience-components/redux/user/userActions'
import { getRepoID } from 'conscience-components/env-specific'
import ServerRelay from 'conscience-lib/ServerRelay'
import union from 'lodash/union'

const getRepoListLogic = makeLogic<IGetRepoListAction, IGetRepoListSuccessAction>({
    type: RepoActionType.GET_REPO_LIST,
    async process({ action }, dispatch) {
        const { username } = action.payload
        const repoList = await ServerRelay.getRepoList(username)
        // await Promise.all(repoList.map(repoID => dispatch(fetchFullRepo({ repoID }))))
        return { username, repoList }
    }
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
        await dispatch(getDiscussions({ uri }))
        await dispatch(fetchUserDataByUsername({ usernames }))
        return { uri, repo }
    },
})

export {
    getRepoListLogic,
    fetchFullRepoFromServerLogic,
}
