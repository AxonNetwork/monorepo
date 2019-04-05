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
    const params = {
        TableName:                 RepoTable,
        Key:                       { repoID },
        UpdateExpression:          'SET #field = :value',
        ExpressionAttributeNames:  { '#field': field },
        ExpressionAttributeValues: { ':value': value },
        ReturnValues:              'UPDATED_NEW',
    }
    try {
        await dynamo.updateAsync(params)
    } catch (err) {
        console.error(`Error in Repo.update-${field} ~>`, err)
        throw err
    }
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
    const params = {
        TableName:                 RepoTable,
        Key:                       { repoID: metadata.repoID },
        UpdateExpression:          updateExpression,
        ExpressionAttributeValues: expressionAttrVals,
    }
    try {
        await dynamo.updateAsync(params)
    } catch (err) {
        console.error('Error in Repo.updateCacheFields ~>', err)
        throw err
    }
}

Repo.resetCache = async (repoID) => {
    const params = {
        TableName:        RepoTable,
        Key:              { repoID },
        UpdateExpression: 'REMOVE currentHEAD, firstVerifiedCommit, firstVerifiedTime, lastBlockNumber, lastVerifiedCommit, lastVerifiedTime',
    }
    try {
        await dynamo.updateAsync(params)
    } catch (err) {
        console.error('Error in Repo.resetCache ~>', err)
        throw err
    }
}

export default Repo
