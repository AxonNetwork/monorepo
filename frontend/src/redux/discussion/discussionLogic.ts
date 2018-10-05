import { keyBy } from 'lodash'
import { makeLogic } from '../reduxUtils'
import { DiscussionActionType,
    IGetDiscussionsAction, IGetDiscussionsSuccessAction,
    ICreateDiscussionAction, ICreateDiscussionSuccessAction,
    getDiscussions, selectDiscussion } from './discussionActions'
import { navigateRepoPage } from 'redux/repository/repoActions'
import { RepoPage } from 'redux/repository/repoReducer'
import { IDiscussion } from '../../common'
import ServerRelay from '../../lib/ServerRelay'

const getDiscussionsLogic = makeLogic<IGetDiscussionsAction, IGetDiscussionsSuccessAction>({
    type: DiscussionActionType.GET_DISCUSSIONS,
    async process({ action }) {
        const { repoID } = action.payload
        const discussionsList = await ServerRelay.getDiscussionsForRepo(action.payload.repoID)
        const discussions = keyBy(discussionsList, 'created') as {[created: number]: IDiscussion}
        return { repoID, discussions }
    },
})

const createDiscussionLogic = makeLogic<ICreateDiscussionAction, ICreateDiscussionSuccessAction>({
    type: DiscussionActionType.CREATE_DISCUSSION,
    async process({ action }, dispatch) {
        const { repoID, subject, commentText } = action.payload
        const { comment, discussion } = await ServerRelay.createDiscussion(repoID, subject, commentText)
        dispatch(selectDiscussion({ created: discussion.created }))
        dispatch(navigateRepoPage({ repoPage: RepoPage.Discussion }))
        return { comment, discussion }
    },
})

export default [
    getDiscussionsLogic,
    createDiscussionLogic,
    // createDiscussionSuccessLogic,
]
