import { dynamo } from '../config/aws'
import { getAll } from './utils'

const CommitTable = `${process.env.DYNAMODB_TABLE_PREFIX}_CommitCache`
const CommitTableIndexByRepoSorted = 'ByRepoSorted'

const Commit = {}

Commit.addCommits = async (commits) => {
    const putRequests = commits.map(c => ({ PutRequest: { Item: c } }))
    const params = { RequestItems: { [CommitTable]: putRequests } }
    try {
        await dynamo.batchWriteAsync(params)
    } catch (err) {
        console.error('Error in Commit.addCommits ~>', err)
    }
}

Commit.get = async (repoID, commit) => {
    const params = {
        TableName: CommitTable,
        Key:       { repoID, commit },
    }
    try {
        const lastFetchedResp = await dynamo.getAsync(params)
        return lastFetchedResp.Item
    } catch (err) {
        console.error('Error in Commit.get ~>', err)
        throw err
    }
}

Commit.getPage = async (repoID, pageSize, lastCommitFetched) => {
    let timestamp
    if (lastCommitFetched !== undefined) {
        try {
            const lastFetchedResp = await dynamo.getAsync({
                TableName: CommitTable,
                Key:       { repoID, commit: lastCommitFetched },
            })
            timestamp = lastFetchedResp.Item.time
        } catch (err) {
            console.error('Error in Commit.getPage ~>', err)
            throw err
        }
    }

    const params = {
        TableName:                 CommitTable,
        IndexName:                 CommitTableIndexByRepoSorted,
        KeyConditionExpression:    'repoID = :repoID',
        ExpressionAttributeValues: { ':repoID': repoID },
        ScanIndexForward:          false,
        Limit:                     pageSize,
    }
    if (timestamp !== undefined) {
        params.KeyConditionExpression += ' and #time < :time'
        params.ExpressionAttributeNames = { '#time': 'time' }
        params.ExpressionAttributeValues[':time'] = timestamp
    }

    try {
        const resp = await dynamo.queryAsync(params)
        return resp.Items
    } catch (err) {
        console.error('Error in Commit.getPage ~>', err)
        throw err
    }
}

export default Commit
