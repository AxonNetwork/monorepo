import Promise from 'bluebird'
import { dynamo } from '../config/aws'

const RepoTable = `${process.env.DYNAMODB_TABLE_PREFIX}_Repos`
const Repo = {}

Repo.create = async (repoID) => {
    await dynamo.putAsync({
        TableName: RepoTable,
        Item:      { repoID },
    })
}

Repo.shareWithUser = async (repoID, userID) => {
    await dynamo.updateAsync({
        TableName:                 RepoTable,
        Key:                       { repoID },
        UpdateExpression:          'add #users :user',
        ExpressionAttributeNames:  { '#users': 'users' },
        ExpressionAttributeValues: { ':user': dynamo.createSet([ userID ]) },
        ReturnValues:              'UPDATED_NEW',
    })
}

Repo.unshareWithUser = async (repoID, userID) => {
    await dynamo.updateAsync({
        TableName:                 RepoTable,
        Key:                       { repoID },
        UpdateExpression:          'delete #users :user',
        ExpressionAttributeNames:  { '#users': 'users' },
        ExpressionAttributeValues: { ':user': dynamo.createSet([ userID ]) },
    })
}

Repo.get = async (repoID) => {
    const result = (await dynamo.getAsync({
        TableName: RepoTable,
        Key:       { repoID },
    })).Item

    if (!result) {
        return null
    }

    return {
        repoID:              result.repoID,
        users:               (result.users || {}).values || [],
        firstVerifiedTime:   result.firstVerifiedTime,
        firstVerifiedCommit: result.firstVerifiedCommit,
        lastVerifiedTime:    result.lastVerifiedTime,
        lastVerifiedCommit:  result.lastVerifiedCommit,
        currentHEAD:         result.currentHEAD,
        blockNumber:         result.blockNumber,
    }
}

Repo.getSharedUsers = async (repoID) => {
    const result = await dynamo.getAsync({
        TableName: RepoTable,
        Key:       { repoID },
    })

    return ((result.Item || {}).users || {}).values || []
}

Repo.updateField = async (repoID, field, value) => {
    await dynamo.updateAsync({
        TableName:                 RepoTable,
        Key:                       { repoID },
        UpdateExpression:          'SET #field = :value',
        ExpressionAttributeNames:  { '#field': field },
        ExpressionAttributeValues: { ':value': value },
        ReturnValues:              'UPDATED_NEW',
    })
}

Repo.updateCacheFields = async (metadata) => {
    let updateExpression = 'SET currentHEAD = :currentHEAD'
    const expressionAttrVals = { ':currentHEAD': metadata.currentHEAD }
    if (metadata.lastBlockNumber !== undefined) {
        updateExpression += ', lastBlockNumber = :lastBlockNumber'
        expressionAttrVals[':lastBlockNumber'] = metadata.lastBlockNumber
    }
    if (metadata.lastVerifiedTime !== undefined) {
        updateExpression += ', lastVerifiedTime = :lastVerifiedTime'
        updateExpression += ', lastVerifiedCommit = :lastVerifiedCommit'
        expressionAttrVals[':lastVerifiedTime'] = metadata.lastVerifiedTime
        expressionAttrVals[':lastVerifiedCommit'] = metadata.lastVerifiedCommit
    }
    if (metadata.firstVerifiedTime !== undefined) {
        updateExpression += ', firstVerifiedTime = :firstVerifiedTime'
        updateExpression += ', firstVerifiedCommit = :firstVerifiedCommit'
        expressionAttrVals[':firstVerifiedTime'] = metadata.firstVerifiedTime
        expressionAttrVals[':firstVerifiedCommit'] = metadata.firstVerifiedCommit
    }

    await dynamo.updateAsync({
        TableName:                 RepoTable,
        Key:                       { repoID: metadata.repoID },
        UpdateExpression:          updateExpression,
        ExpressionAttributeValues: expressionAttrVals,
    })
}

Repo.resetCache = async (repoID) => {
    await dynamo.updateAsync({
        TableName:        RepoTable,
        Key:              { repoID },
        UpdateExpression: 'REMOVE currentHEAD, firstVerifiedCommit, firstVerifiedTime, lastBlockNumber, lastVerifiedCommit, lastVerifiedTime',
    })
}

export default Repo
