import { dynamo } from '../config/aws'
import { makeID, getAll } from './utils'
import Comment from './comment'

const DiscussionTable = `${process.env.DYNAMODB_TABLE_PREFIX}_Discussions`
const DiscussionTableIndexByRepo = 'ByRepoSorted'
const Discussion = {}

Discussion.create = async ({ repoID, subject, userID, commentText }) => {
    let discussion
    while (true) {
        discussion = {
            discussionID: makeID(),
            repoID,
            userID,
            subject,
            created:      new Date().getTime(),
        }

        try {
            await dynamo.putAsync({
                TableName:           DiscussionTable,
                Item:                discussion,
                ConditionExpression: 'attribute_not_exists(discussionID)',
            })

            break
        } catch (err) {
            if (err.code === 'ConditionalCheckFailedException') {
                continue
            }
            console.error('Error creating Discussion ~>', err)
            throw err
        }
    }

    const { discussionID } = discussion
    const comment = await Comment.create({ repoID, discussionID, userID, text: commentText })

    return { discussion, comment }
}

Discussion.get = async (discussionIDs) => {
    const fetches = discussionIDs.map(discussionID => dynamo.getAsync({
        TableName: DiscussionTable,
        Key:       { discussionID },
    }))

    const resp = await Promise.all(fetches)
    return resp.map(row => row.Item)
}

Discussion.getAllForRepo = async (repoID) => {
    return getAll({
        TableName:                 DiscussionTable,
        IndexName:                 DiscussionTableIndexByRepo,
        KeyConditionExpression:    'repoID = :repoID',
        ExpressionAttributeValues: { ':repoID': repoID },
    })
}

Discussion.updateLastComment = async (discussionID, userID, commentTime) => {
    try {
        await dynamo.updateAsync({
            TableName:                 DiscussionTable,
            Key:                       { discussionID },
            UpdateExpression:          'SET lastCommentTime = :lastTime, lastCommentUser = :lastUser',
            ExpressionAttributeValues: {
                ':lastTime': newComment.created,
                ':lastUser': newComment.userID,
            },
        })
    } catch (err) {
        console.error('Error in Discussion.updateLastComment ~>', err)
        throw err
    }
}

Discussion.delete = async (discussionID) => {
    await dynamo.deleteAsync({
        TableName: DiscussionTable,
        Key:       { discussionID },
    })
}

export default Discussion

