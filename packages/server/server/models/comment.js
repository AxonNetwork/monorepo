import { dynamo } from '../config/aws'
import { makeID, getAll } from './utils'

const CommentTable = `${process.env.DYNAMODB_TABLE_PREFIX}_Comments`
const CommentTableIndexByDiscussion = 'ByDiscussionSorted'
const Comment = {}

Comment.create = async ({ repoID, userID, text, discussionID }) => {
    while (true) {
        const newComment = {
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

            return newComment
        } catch (err) {
            if (err.code === 'ConditionalCheckFailedException') {
                continue
            }
            console.error('Error creating Comment ~>', err)
            throw err
        }
    }
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

