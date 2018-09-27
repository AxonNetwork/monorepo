import { makeLogic } from '../reduxUtils'
import { IComment } from '../../common'
import { CommentActionType, IGetCommentsForRepoAction, IGetCommentsForRepoSuccessAction, ICreateCommentAction, ICreateCommentSuccessAction } from './commentActions'
import ServerRelay from '../../lib/ServerRelay'

const getCommentsForRepoLogic = makeLogic<IGetCommentsForRepoAction, IGetCommentsForRepoSuccessAction>({
    type: CommentActionType.GET_COMMENTS_FOR_REPO,
    async process({ action }) {
        const { repoID } = action.payload
        const commentsList = await ServerRelay.getCommentsForRepo(repoID)

        // Convert to an object
        const comments = commentsList.reduce((into, each) => {
            into[`${each.attachedTo.type}/${each.attachedTo.subject}`] = each
            return into
        }, {} as {[id: string]: IComment})

        return { repoID, comments }
    }
})

const createCommentLogic = makeLogic<ICreateCommentAction, ICreateCommentSuccessAction>({
    type: CommentActionType.CREATE_COMMENT,
    async process({ action }) {
        const { repoID, text, attachedTo } = action.payload
        const comment = await ServerRelay.createComment(repoID, text, attachedTo)
        return { comment }
    }
})

export default [
    getCommentsForRepoLogic,
    createCommentLogic,
]
