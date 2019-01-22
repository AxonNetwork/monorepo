import { keyBy } from 'lodash'
import { makeLogic } from '../reduxUtils'
import {
    DiscussionActionType,
    IGetDiscussionsAction, IGetDiscussionsSuccessAction,
    ICreateDiscussionAction, ICreateDiscussionSuccessAction,
    IGetCommentsForDiscussionAction, IGetCommentsForDiscussionSuccessAction,
    ICreateCommentAction, ICreateCommentSuccessAction,
    getCommentsForDiscussion
} from './discussionActions'
import { push as pushToHistory } from 'connected-react-router'
import { fetchUserData, sawComment } from '../user/userActions'
import { getRepo } from '../../env-specific'
import { getDiscussionURL } from '../../navigation'
import { IDiscussion, IComment } from 'conscience-lib/common'
import ServerRelay from 'conscience-lib/ServerRelay'


const getDiscussionsLogic = makeLogic<IGetDiscussionsAction, IGetDiscussionsSuccessAction>({
    type: DiscussionActionType.GET_DISCUSSIONS,
    async process({ action }, dispatch) {
        const { uri } = action.payload
        const repoID = (getRepo(uri) || {}).repoID
        const discussionsList = await ServerRelay.getDiscussionsForRepo(repoID)
        const discussions = keyBy(discussionsList, 'discussionID') as { [discussionID: string]: IDiscussion }

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
        const { uri, subject, commentText } = action.payload
        const repoID = (getRepo(uri) || {}).repoID
        const { comment, discussion } = await ServerRelay.createDiscussion(repoID, subject, commentText)

        const url = getDiscussionURL(uri, discussion.discussionID)
        dispatch(pushToHistory(url))

        return { comment, discussion }
    },
})

const getCommentsForDiscussionLogic = makeLogic<IGetCommentsForDiscussionAction, IGetCommentsForDiscussionSuccessAction>({
    type: DiscussionActionType.GET_COMMENTS_FOR_DISCUSSION,
    async process({ action }, dispatch) {
        const { discussionID } = action.payload
        const commentsList = await ServerRelay.getCommentsForDiscussion(discussionID)
        const comments = keyBy(commentsList, 'commentID') as { [commentID: string]: IComment }

        let userIDs = commentsList.map(c => c.userID)
        dispatch(fetchUserData({ userIDs }))

        return { discussionID, comments }
    },
})

const createCommentLogic = makeLogic<ICreateCommentAction, ICreateCommentSuccessAction>({
    type: DiscussionActionType.CREATE_COMMENT,
    async process({ action }, dispatch) {
        const { uri, discussionID, text, callback } = action.payload
        const repoID = (getRepo(uri) || {}).repoID
        try {
            const comment = await ServerRelay.createComment(repoID, discussionID, text)
            dispatch(sawComment({ uri, discussionID, commentTimestamp: comment.created }))
            callback()
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