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

    await Promise.all(writePromises)
}

Commit.get = async (repoID, commit) => {
    const resp = await dynamo.getAsync({
        TableName: CommitTable,
        Key:       { repoID, commit },
    })
    return resp.Item
}

Commit.batchGet = async (repoID, commits) => {
    if (!isArray(commits)) {
        commits = [ commits ]
    }
    const keys = commits.map(commit => ({ repoID, commit }))
    const readPromises = chunk(keys, 25)
        .map(chunk => ({ RequestItems: { [CommitTable]: { Keys: chunk } } }))
        .map(params => dynamo.batchGetAsync(params))

    const resp = (await Promise.all(readPromises))
        .map(r => r.Responses[CommitTable])
    const flat = [].concat.apply([], resp)
    return flat
}

Commit.getMostRecent = async (repoID, count) => {
    const resp = await dynamo.queryAsync({
        TableName:                 CommitTable,
        IndexName:                 CommitTableIndexSortedByTime,
        KeyConditionExpression:    'repoID = :repoID',
        ExpressionAttributeValues: { ':repoID': repoID },
        ScanIndexForward:          false,
        Limit:                     count,
    })
    return resp.Items
}

export default Commit
