import { dynamo } from '../config/aws'
import { getAll } from './utils'
import chunk from 'lodash/chunk'
import isArray from 'lodash/isArray'

const CommitTable = `${process.env.DYNAMODB_TABLE_PREFIX}_CommitCache`
const CommitTableIndexByRepoSorted = 'ByRepoSorted'

const Commit = {}

Commit.addCommits = async (commits) => {
    const putRequests = commits.map(c => ({ PutRequest: { Item: c } }))
    const writePromises = chunk(putRequests, 25)
        .map(req => ({ RequestItems: { [CommitTable]: req } }))
        .map(params => dynamo.batchWriteAsync(params))
    try {
        await Promise.all(writePromises)
    } catch (err) {
        console.error('Error in Commit.addCommits ~>', err)
    }
}

Commit.get = async (repoID, commits) => {
    if (!isArray(commits)) {
        commits = [ commits ]
    }
    const keys = commits.map(commit => ({ repoID, commit }))
    const writePromises = chunk(keys, 25)
        .map(req => ({ RequestItems: { [CommitTable]: { Keys: keys } } }))
        .map(params => dynamo.batchGetAsync(params))
    try {
        const resp = (await Promise.all(writePromises))
            .map(r => r.Responses[CommitTable])
        const flat = [].concat.apply([], resp)
        return flat
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
