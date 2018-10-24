import { keyBy } from 'lodash'
import { makeLogic } from '../reduxUtils'
import { DiscussionActionType,
    IGetDiscussionsAction, IGetDiscussionsSuccessAction,
    ICreateDiscussionAction, ICreateDiscussionSuccessAction,
    IGetCommentsForDiscussionAction, IGetCommentsForDiscussionSuccessAction,
    ICreateCommentAction, ICreateCommentSuccessAction,
    selectDiscussion, getCommentsForDiscussion } from './discussionActions'
import { navigateRepoPage } from 'redux/repository/repoActions'
import { fetchUserData, sawComment } from 'redux/user/userActions'
import { RepoPage } from 'redux/repository/repoReducer'
import { IDiscussion, IComment } from 'common'
import ServerRelay from 'lib/ServerRelay'


const getDiscussionsLogic = makeLogic<IGetDiscussionsAction, IGetDiscussionsSuccessAction>({
    type: DiscussionActionType.GET_DISCUSSIONS,
    async process({ action }, dispatch) {
        const { repoID } = action.payload
        const discussionsList = await ServerRelay.getDiscussionsForRepo(action.payload.repoID)
        const discussions = keyBy(discussionsList, 'discussionID') as {[discussionID: string]: IDiscussion}

        // @@TODO: do this in the component or something
        for (let discussionID of Object.keys(discussions)) {
            dispatch(getCommentsForDiscussion({ discussionID }))
        }

        return { repoID, discussions }
    },
})

const createDiscussionLogic = makeLogic<ICreateDiscussionAction, ICreateDiscussionSuccessAction>({
    type: DiscussionActionType.CREATE_DISCUSSION,
    async process({ action }, dispatch) {
        const { repoID, subject, commentText } = action.payload
        const { comment, discussion } = await ServerRelay.createDiscussion(repoID, subject, commentText)
        dispatch(selectDiscussion({ discussionID: discussion.discussionID }))
        dispatch(navigateRepoPage({ repoPage: RepoPage.Discussion }))
        return { comment, discussion }
    },
})

const getCommentsForDiscussionLogic = makeLogic<IGetCommentsForDiscussionAction, IGetCommentsForDiscussionSuccessAction>({
    type: DiscussionActionType.GET_COMMENTS_FOR_DISCUSSION,
    async process({ action }, dispatch) {
        const { discussionID } = action.payload
        const commentsList = await ServerRelay.getCommentsForDiscussion(discussionID)
        const comments = keyBy(commentsList, 'commentID') as {[commentID: string]: IComment}

        let userIDs = commentsList.map(c => c.userID)
        dispatch(fetchUserData({ userIDs }))

        return { discussionID, comments }
    },
})

const createCommentLogic = makeLogic<ICreateCommentAction, ICreateCommentSuccessAction>({
    type: DiscussionActionType.CREATE_COMMENT,
    async process({ action }, dispatch) {
        const { repoID, discussionID, text, callback } = action.payload
        try {
            const comment = await ServerRelay.createComment(repoID, discussionID, text)
            callback()
            dispatch(sawComment({ repoID, discussionID, commentTimestamp: comment.created }))
            return { comment }
        } catch (err) {
            callback(err)
            throw err
        }
    },
})

export default [
    getDiscussionsLogic,
    createDiscussionLogic,
    getCommentsForDiscussionLogic,
    createCommentLogic,
]
