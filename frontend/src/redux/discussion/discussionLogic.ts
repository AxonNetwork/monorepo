import { keyBy } from 'lodash'
import { makeLogic } from '../reduxUtils'
import { DiscussionActionType,
    IGetDiscussionsAction, IGetDiscussionsSuccessAction,
    ICreateDiscussionAction, ICreateDiscussionSuccessAction,
    IGetCommentsForRepoAction, IGetCommentsForRepoSuccessAction,
    ICreateCommentAction, ICreateCommentSuccessAction,
    selectDiscussion } from './discussionActions'
import { navigateRepoPage } from 'redux/repository/repoActions'
import { fetchUserData } from 'redux/user/userActions'
import { RepoPage } from 'redux/repository/repoReducer'
import { IDiscussion } from 'common'
import ServerRelay from 'lib/ServerRelay'

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

const getCommentsForRepoLogic = makeLogic<IGetCommentsForRepoAction, IGetCommentsForRepoSuccessAction>({
    type: DiscussionActionType.GET_COMMENTS_FOR_REPO,
    async process({ action }, dispatch) {
        const { repoID } = action.payload
        const commentsList = await ServerRelay.getCommentsForRepo(repoID)
        const comments = keyBy(commentsList, (comment) => `${comment.attachedTo.type}/${comment.attachedTo.subject}/${comment.created}`)

        let emails = commentsList.map(c => c.user)
        dispatch(fetchUserData({ emails }))

        return { repoID, comments }
    },
})

const createCommentLogic = makeLogic<ICreateCommentAction, ICreateCommentSuccessAction>({
    type: DiscussionActionType.CREATE_COMMENT,
    async process({ action }) {
        const { repoID, text, attachedTo } = action.payload
        const comment = await ServerRelay.createComment(repoID, text, attachedTo)
        return { comment }
    },
})

export default [
    getDiscussionsLogic,
    createDiscussionLogic,
    getCommentsForRepoLogic,
    createCommentLogic,
]
