import { dynamo } from '../config/aws'
import { getAll } from './utils'

const UpdatedRefEventTable = `${process.env.DYNAMODB_TABLE_PREFIX}_UpdatedRefEventCache`

const UpdatedRefEvent = {}

UpdatedRefEvent.create = async (evt) => {
    if (!UpdatedRefEvent) {
        return
    }
    const blockNumber = evt.blockNumber.toNumber()
    const item = {
        commit: evt.commit || '',
        repoID: evt.repoID || '',
        txHash: evt.txHash || '',
        time:   evt.time.toNumber(),
        blockNumber,
    }
    try {
        await dynamo.putAsync({
            TableName: UpdatedRefEventTable,
            Item:      item,
        })
    } catch (err) {
        console.error('Error in UpdatedRefEvent.create ~>', err)
    }
}

UpdatedRefEvent.getByCommit = async (commit) => {
    const resp = dynamo.getAsync({
        TableName: UpdatedRefEventTable,
        key:       { commit },
    })
    return resp.Item
}

UpdatedRefEvent.getAllForRepo = async (repoID) => {
    return getAll({
        TableName:                 UpdatedRefEventTable,
        KeyConditionExpression:    'repoID = :repoID',
        ExpressionAttributeValues: { ':repoID': repoID },
    })
}

UpdatedRefEvent.getCursor = async () => {
    return 0
}

export default UpdatedRefEvent
