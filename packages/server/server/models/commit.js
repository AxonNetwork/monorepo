import { dynamo } from '../config/aws'
import { getAll } from './utils'
import chunk from 'lodash/chunk'
import isArray from 'lodash/isArray'

const CommitTable = `${process.env.DYNAMODB_TABLE_PREFIX}_CommitCache`
const CommitTableIndexSortedByTime = 'SortedByTime'

const Commit = {}

Commit.addCommits = async (commits) => {
    const putRequests = commits.map(c => ({ PutRequest: { Item: c } }))
    const writePromises = chunk(putRequests, 25)
        .map(chunk => ({ RequestItems: { [CommitTable]: chunk } }))
        .map(params => dynamo.batchWriteAsync(params))
    try {
        await Promise.all(writePromises)
    } catch (err) {
        console.error('Error in Commit.addCommits ~>', err)
    }
}

Commit.get = async (repoID, commit) => {
    try {
        const resp = await dynamo.getAsync({
            TableName: CommitTable,
            Key:       { repoID, commit },
        })
        return resp.Item
    } catch (err) {
        console.error('Error in Commit.get ~>', err)
        throw err
    }
}

Commit.batchGet = async (repoID, commits) => {
    if (!isArray(commits)) {
        commits = [ commits ]
    }
    const keys = commits.map(commit => ({ repoID, commit }))
    const readPromises = chunk(keys, 25)
        .map(chunk => ({ RequestItems: { [CommitTable]: { Keys: chunk } } }))
        .map(params => dynamo.batchGetAsync(params))
    try {
        const resp = (await Promise.all(readPromises))
            .map(r => r.Responses[CommitTable])
        const flat = [].concat.apply([], resp)
        return flat
    } catch (err) {
        console.error('Error in Commit.batchGet ~>', err)
        throw err
    }
}

Commit.getMostRecent = async (repoID, count) => {
    const params = {
        TableName:                 CommitTable,
        IndexName:                 CommitTableIndexSortedByTime,
        KeyConditionExpression:    'repoID = :repoID',
        ExpressionAttributeValues: { ':repoID': repoID },
        ScanIndexForward:          false,
        Limit:                     count,
    }

    try {
        const resp = await dynamo.queryAsync(params)
        return resp.Items
    } catch (err) {
        console.error('Error in Commit.getMostRecent ~>', err)
        throw err
    }
}

export default Commit
