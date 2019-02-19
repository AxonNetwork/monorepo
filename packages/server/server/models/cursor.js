import { dynamo } from '../config/aws'

const CursorsTable = `${process.env.DYNAMODB_TABLE_PREFIX}_Cursors`

const Cursors = {}

Cursors.get = async (serverID) => {
    const row = (await dynamo.getAsync({
        TableName: CursorsTable,
        Key:       { serverID },
    })).Item
    if (row !== undefined) {
        return row
    }

    // if cursors don't exist, add a blank row
    try {
        const cursors = { serverID }
        await dynamo.putAsync({
            TableName: CursorsTable,
            Item:      cursors,
        })
        return cursors
    } catch (err) {
        console.error('Error creating cursors row ~>', err)
    }
}

Cursors.setRefLogCursor = async (serverID, cursor) => {
    try {
        await dynamo.updateAsync({
            TableName:                 CursorsTable,
            Key:                       { serverID },
            UpdateExpression:          'SET refLog = :refLog',
            ConditionExpression:       'refLog < :refLog',
            ExpressionAttributeValues: { ':refLog': cursor },
        })
    } catch (err) {
        if (err.code !== 'ConditionalCheckFailedException') {
            console.error('Error in Cursors.setRefLogCursor ~> ', err)
        }
    }
}

export default Cursors
