import Promise from 'bluebird'
import { dynamo } from '../config/aws'

const RepoTable = `${process.env.DYNAMODB_TABLE_PREFIX}_Repos`
const Repo = {}

Repo.create = async (repoID) => {
    try {
        await dynamo.putAsync({
            TableName: RepoTable,
            Item:      { repoID },
        })
    } catch (err) {
        console.error('Error creating Repo ~>', err)
        throw err
    }
}

Repo.shareWithUser = async (repoID, userID) => {
    const params = {
        TableName:                 RepoTable,
        Key:                       { repoID },
        UpdateExpression:          'add #users :user',
        ExpressionAttributeNames:  { '#users': 'users' },
        ExpressionAttributeValues: { ':user': dynamo.createSet([ userID ]) },
        ReturnValues:              'UPDATED_NEW',
    }

    try {
        await dynamo.updateAsync(params)
    } catch (err) {
        console.error('Error in Repo.share ~>', err)
        throw err
    }
}

Repo.unshareWithUser = async (repoID, userID) => {
    const params = {
        TableName:                 RepoTable,
        Key:                       { repoID },
        UpdateExpression:          'delete #users :user',
        ExpressionAttributeNames:  { '#users': 'users' },
        ExpressionAttributeValues: { ':user': dynamo.createSet([ userID ]) },
    }

    try {
        await dynamo.updateAsync(params)
    } catch (err) {
        console.error('Error in Repo.unshareWithUser ~>', err)
        throw err
    }
}

Repo.get = async (repoID) => {
    const result = (await dynamo.getAsync({
        TableName: RepoTable,
        Key:       { repoID },
    })).Item

    return {
        repoID:   result.repoID,
        users:    (result.users || {}).values || [],
        isPublic: !!result.isPublic,
    }
}

Repo.getSharedUsers = async (repoID) => {
    const result = await dynamo.getAsync({
        TableName: RepoTable,
        Key:       { repoID },
    })

    return ((result.Item || {}).users || {}).values || []
}

Repo.setPublic = async (repoID, isPublic) => {
    const params = {
        TableName:                 RepoTable,
        Key:                       { repoID },
        UpdateExpression:          'set #public = :isPublic',
        ExpressionAttributeNames:  { '#public': 'isPublic' },
        ExpressionAttributeValues: { ':isPublic': isPublic },
        ReturnValues:              'UPDATED_NEW',
    }

    try {
        await dynamo.updateAsync(params)
    } catch (err) {
        console.error('Error in Repo.setPublic ~>', err)
        throw err
    }
}

export default Repo
