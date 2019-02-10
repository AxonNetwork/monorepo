import HTTPError from '../util/HTTPError'
import Comment from '../models/comment'

const commentController = {}

commentController.createComment = async (req, res, next) => {
    const { userID } = req.user
    const { text, discussionID, repoID } = req.body

    if (!text || !discussionID || !repoID) {
        throw new HTTPError(400, 'Missing field.  "text", "discussionID", and "repoID" are all required')
    } else if (!userID) {
        throw new HTTPError(403, 'Unauthorized')
    }

    const newComment = await Comment.create({ repoID, discussionID, userID, text })
    return res.status(200).json({ newComment })
}

commentController.get = async (req, res, next) => {
    let { commentID } = req.query
    if (!commentID) {
        throw new HTTPError(400, 'Missing field: commentID')
    }

    if (typeof commentID === 'string') {
        commentID = [ commentID ]
    }

    const comments = await Comment.get(commentID)
    return res.status(200).json({ comments })
}

commentController.getAllForDiscussion = async (req, res, next) => {
    const { discussionID } = req.query

    if (!discussionID) {
        throw new HTTPError(400, 'Missing field: discussionID')
    }

    const comments = await Comment.getAllForDiscussion(discussionID)
    return res.status(200).json({ comments })
}

commentController.deleteComment = async (req, res, next) => {
    const { commentID } = req.body
    if (!commentID) {
        throw new HTTPError(400, 'Missing field: commentID')
    }

    await Comment.delete(commentID)
    return res.status(200).json({})
}

export default commentController

