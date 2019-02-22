import { dynamo } from '../config/aws'
import { getAll } from './utils'

const SecuredTextTable = `${process.env.DYNAMODB_TABLE_PREFIX}_SecuredTextCache`

const SecuredText = {}

SecuredText.addFiles = async (files) => {
    // console.log(objects)
    const putRequests = files.map(f => ({ PutRequest: { Item: f } }))
    const params = { RequestItems: { [SecuredTextTable]: putRequests } }
    try {
        await dynamo.batchWriteAsync(params)
    } catch (err) {
        console.error('Error in SecuredText.addFiles ~>', err)
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
