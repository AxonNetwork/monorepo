import { keyBy } from 'lodash'
import { makeLogic } from '../reduxUtils'
import { DiscussionActionType, IGetDiscussionsAction, IGetDiscussionsSuccessAction, ICreateDiscussionAction, ICreateDiscussionSuccessAction, getDiscussions } from './discussionActions'
import { IDiscussion } from '../../common'
import ServerRelay from '../../lib/ServerRelay'

const getDiscussionsLogic = makeLogic<IGetDiscussionsAction, IGetDiscussionsSuccessAction>({
    type: DiscussionActionType.GET_DISCUSSIONS,
    async process({ action }) {
        const { repoID } = action.payload
        const discussionsList = await ServerRelay.getDiscussionsForRepo(action.payload.repoID)
        const discussions = keyBy(discussionsList, 'created') as {[created: number]: IDiscussion}
        return { repoID, discussions }
    }
})

const createDiscussionLogic = makeLogic<ICreateDiscussionAction, ICreateDiscussionSuccessAction>({
    type: DiscussionActionType.CREATE_DISCUSSION,
    async process({ action }, dispatch) {
        const { repoID, subject, commentText } = action.payload
        const { comment, discussion } = await ServerRelay.createDiscussion(repoID, subject, commentText)
        await dispatch(getDiscussions({ repoID }))
        return { comment, discussion }
    }
})

export default [
    getDiscussionsLogic,
    createDiscussionLogic,
]
