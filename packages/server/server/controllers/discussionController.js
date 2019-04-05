import HTTPError from '../util/HTTPError'
import Discussion from '../models/discussion'

const discussionController = {}

discussionController.createDiscussion = async (req, res, next) => {
    const { userID } = req.user
    const { repoID, subject, commentText } = req.body
    console.log('hi', { userID, repoID, subject, commentText })

    if (!repoID || !subject || !commentText) {
        throw new HTTPError(400, 'Missing field.  "repoID", "subject", and "commentText" are all required')
    } else if (!userID) {
        throw new HTTPError(403, 'Unauthorized')
    }

    const { discussion, comment } = await Discussion.create({ repoID, subject, userID, commentText })
    return res.status(200).json({ discussion, comment })
}

discussionController.get = async (req, res, next) => {
    let { discussionID } = req.query
    if (!discussionID) {
        throw new HTTPError(400, 'Missing field: discussionID')
    }

    if (typeof discussionID === 'string') {
        discussionID = [ discussionID ]
    }

    const discussions = await Discussion.get(discussionID)
    return res.status(200).json({ discussions })
}

discussionController.getAllForRepo = async (req, res, next) => {
    const { repoID } = req.query
    if (!repoID) {
        throw new HTTPError(400, 'Missing field: repoID')
    }

    const discussions = await Discussion.getAllForRepo(repoID)
    return res.status(200).json({ discussions })
}

discussionController.deleteDiscussion = async (req, res, next) => {
    const { discussionID } = req.body
    if (!discussionID) {
        throw new HTTPError(400, 'Missing field: discussionID')
    }

    await Discussion.delete(repoID, discussionID)
    return res.status(200).json({})
}

export default discussionController

