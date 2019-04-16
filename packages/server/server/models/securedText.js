import { dynamo } from '../config/aws'
import { getAll } from './utils'
import chunk from 'lodash/chunk'

const SecuredTextTable = `${process.env.DYNAMODB_TABLE_PREFIX}_SecuredTextCache`

const SecuredText = {}

SecuredText.addFiles = async (files) => {
    const putRequests = files.map(f => ({ PutRequest: { Item: f } }))
    const writePromises = chunk(putRequests, 25)
        .map(chunk => ({ RequestItems: { [SecuredTextTable]: chunk } }))
        .map(params => dynamo.batchWriteAsync(params))

    await Promise.all(writePromises)
}

SecuredText.getFilesForRepo = async (repoID, filesList) => {
    filesList = (filesList || []).filter(file => !!file && typeof file === 'string' && file.trim().length > 0)

    if (filesList.length === 0) {
        return []
    }

    const keys = filesList.map(file => ({ repoID, file }))
    // const keys = filesList
    //     .filter(file => !!file && typeof file === 'string' && file.trim().length > 0)
    //     .map(file => ({ repoID, file }))

    const readPromises = chunk(keys, 25)
        .map(chunk => ({ RequestItems: { [SecuredTextTable]: { Keys: chunk } } }))
        .map(params => dynamo.batchGetAsync(params))

    const resp = (await Promise.all(readPromises))
        .map(r => r.Responses[SecuredTextTable])
    const flat = [].concat.apply([], resp)
    return flat
}

SecuredText.getForFile = async (repoID, file) => {
    const resp = await dynamo.getAsync({
        TableName: SecuredTextTable,
        Key:       { repoID, file },
    })
    return resp.Item
}

export default SecuredText
