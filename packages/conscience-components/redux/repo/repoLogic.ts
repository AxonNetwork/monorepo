import {
    RepoActionType,
    IGetRepoListAction, IGetRepoListSuccessAction,
} from './repoActions'
import { makeLogic } from 'conscience-components/redux/reduxUtils'
import ServerRelay from 'conscience-lib/ServerRelay'

const getRepoListLogic = makeLogic<IGetRepoListAction, IGetRepoListSuccessAction>({
    type: RepoActionType.GET_REPO_LIST,
    async process({ action, getState }, dispatch) {
        const { userID } = action.payload
        const repoList = await ServerRelay.getSharedRepos(userID)
        return { userID, repoList }
    }
})

export {
    getRepoListLogic,
}
