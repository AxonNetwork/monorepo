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
    try {
        await Promise.all(writePromises)
    } catch (err) {
        console.error('Error in SecuredText.addFiles ~>', err)
    }
}

SecuredText.getFilesForRepo = async (repoID, filesList) => {
    if (!filesList || filesList.length === 0) {
        return []
    }
    const keys = filesList.map(file => ({ repoID, file }))
    const readPromises = chunk(keys, 25)
        .map(chunk => ({ RequestItems: { [SecuredTextTable]: { Keys: chunk } } }))
        .map(params => dynamo.batchGetAsync(params))
    try {
        const resp = (await Promise.all(readPromises))
            .map(r => r.Responses[SecuredTextTable])
        const flat = [].concat.apply([], resp)
        return flat
    } catch (err) {
        console.error('Error in SecuredText.getFilesForRepo ~>', err)
        throw err
    }
}

SecuredText.getForFile = async (repoID, file) => {
    const params = {
        TableName: SecuredTextTable,
        Key:       { repoID, file },
    }
    try {
        const resp = await dynamo.getAsync(params)
        return resp.Item
    } catch (err) {
        console.error('Error in SecuredText.getForFile ~>', err)
        throw err
    }
}

export default SecuredText
