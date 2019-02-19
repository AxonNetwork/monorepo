import {
    RepoActionType,
    IGetRepoListAction, IGetRepoListSuccessAction,
    IFetchFullRepoAction, IFetchFullRepoSuccessAction,
    fetchRepoFiles, fetchRepoTimeline, fetchUpdatedRefEvents, fetchRepoUsersPermissions,
    fetchLocalRefs, fetchRemoteRefs,
    watchRepo,
} from './repoActions'
import { makeLogic } from 'conscience-components/redux/reduxUtils'
import { getDiscussionsForRepo } from 'conscience-components/redux/discussion/discussionActions'
import ServerRelay from 'conscience-lib/ServerRelay'

const getRepoListLogic = makeLogic<IGetRepoListAction, IGetRepoListSuccessAction>({
    type: RepoActionType.GET_REPO_LIST,
    async process({ action, getState }, dispatch) {
        const { userID } = action.payload
        const repoList = await ServerRelay.getSharedRepos(userID)
        return { userID, repoList }
    }
})

const fetchFullRepoLogic = makeLogic<IFetchFullRepoAction, IFetchFullRepoSuccessAction>({
    type: RepoActionType.FETCH_FULL_REPO,
    async process({ action }, dispatch) {
        const { uri } = action.payload
        await Promise.all([
            dispatch(fetchRepoFiles({ uri: { ...uri, commit: 'working' } })),
            dispatch(fetchRepoTimeline({ uri })),
            dispatch(fetchUpdatedRefEvents({ uri })),
            dispatch(getDiscussionsForRepo({ uri })),
            dispatch(fetchRepoUsersPermissions({ uri })),
            dispatch(fetchLocalRefs({ uri })),
            dispatch(fetchRemoteRefs({ uri })),
        ])
        await dispatch(watchRepo({ uri }))
        return { uri }
    },
})

export {
    getRepoListLogic,
    fetchFullRepoLogic,
}
