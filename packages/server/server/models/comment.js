import { dynamo } from '../config/aws'
import { makeID, getAll } from './utils'
import Discussion from './discussion'

const DiscussionTable = `${process.env.DYNAMODB_TABLE_PREFIX}_Discussions`
const CommentTable = `${process.env.DYNAMODB_TABLE_PREFIX}_Comments`
const CommentTableIndexByDiscussion = 'ByDiscussionSorted'
const Comment = {}

Comment.create = async ({ repoID, userID, text, discussionID }) => {
    let newComment
    while (true) {
        newComment = {
            commentID: makeID(),
            repoID,
            userID,
            text,
            discussionID,
            created:   new Date().getTime(),
        }

        try {
            await dynamo.putAsync({
                TableName:           CommentTable,
                Item:                newComment,
                ConditionExpression: 'attribute_not_exists(commentID)',
            })

            break
        } catch (err) {
            if (err.code === 'ConditionalCheckFailedException') {
                continue
            }
            throw err
        }
    }

    await Discussion.updateLastComment(discussionID, newComment.userID, newComment.created)

    return newComment
}

Comment.get = async (commentIDs) => {
    const fetches = commentIDs.map(commentID => dynamo.getAsync({
        TableName: CommentTable,
        Key:       { commentID },
    }))

    const resp = await Promise.all(fetches)
    return resp.map(row => row.Item)
}

Comment.getAllForDiscussion = async (discussionID) => {
    return getAll({
        TableName:                 CommentTable,
        IndexName:                 CommentTableIndexByDiscussion,
        KeyConditionExpression:    'discussionID = :discussionID',
        ExpressionAttributeValues: { ':discussionID': discussionID },
    })
}

Comment.delete = async (commentID) => {
    await dynamo.deleteAsync({
        TableName: CommentTable,
        Key:       { commentID },
    })
}

export default Comment

