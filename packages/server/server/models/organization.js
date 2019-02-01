import { dynamo } from '../config/aws'
import { makeID } from './utils'

const OrganizationTable = `${process.env.DYNAMODB_TABLE_PREFIX}_Organizations`

const Organization = {}

Organization.create = async (name, creator) => {
    while (true) {
        const org = {
            orgID:   makeID(),
            name,
            creator,
            created: new Date().getTime(),
        }

        try {
            await dynamo.putAsync({
                TableName:           OrganizationTable,
                Item:                org,
                ConditionExpression: 'attribute_not_exists(orgID)',
            })

            return { orgID: org.orgID, name, creator }
        } catch (err) {
            if (err.code === 'ConditionalCheckFailedException') {
                continue
            }
            console.error('Error creating organization ~>', err)
            throw err
        }
    }
}

Organization.get = async (orgID) => {
    const result = (await dynamo.getAsync({
        TableName: OrganizationTable,
        Key:       { orgID },
    })).Item

    return {
        orgID:         result.orgID,
        name:          result.name || '',
        description:   result.description || '',
        creator:       result.creator || '',
        picture:       result.picture || '',
        banner:        result.banner || '',
        members:       (result.members || {}).values || [],
        repos:         (result.repos || {}).values || [],
        readme:        result.readme || '',
        featuredRepos: result.featuredRepos || {},
    }
}

Organization.updateField = async (orgID, field, value) => {
    const params = {
        TableName:                 OrganizationTable,
        Key:                       { orgID },
        UpdateExpression:          'SET #field = :value',
        ExpressionAttributeNames:  { '#field': field },
        ExpressionAttributeValues: { ':value': value },
        ReturnValues:              'UPDATED_NEW',
    }
    try {
        await dynamo.updateAsync(params)
    } catch (err) {
        console.error(`Error in Organization.update-${field} ~>`, err)
        throw err
    }
}

Organization.addMember = async (orgID, userID) => {
    const params = {
        TableName:                 OrganizationTable,
        Key:                       { orgID },
        UpdateExpression:          'add #members :member',
        ExpressionAttributeNames:  { '#members': 'members' },
        ExpressionAttributeValues: { ':member': dynamo.createSet([ userID ]) },
        ReturnValues:              'UPDATED_NEW',
    }

    try {
        await dynamo.updateAsync(params)
    } catch (err) {
        console.error('Error in Organization.addMember ~>', err)
        throw err
    }
}

Organization.removeMember = async (orgID, userID) => {
    const params = {
        TableName:                 OrganizationTable,
        Key:                       { orgID },
        UpdateExpression:          'delete #members :member',
        ExpressionAttributeNames:  { '#members': 'members' },
        ExpressionAttributeValues: { ':member': dynamo.createSet([ userID ]) },
    }

    try {
        await dynamo.updateAsync(params)
    } catch (err) {
        console.error('Error in Organization.removeMember ~>', err)
        throw err
    }
}

Organization.addRepo = async (orgID, repoID) => {
    const params = {
        TableName:                 OrganizationTable,
        Key:                       { orgID },
        UpdateExpression:          'add #repos :repo',
        ExpressionAttributeNames:  { '#repos': 'repos' },
        ExpressionAttributeValues: { ':repo': dynamo.createSet([ repoID ]) },
        ReturnValues:              'UPDATED_NEW',
    }

    try {
        await dynamo.updateAsync(params)
    } catch (err) {
        console.error('Error in Organization.addRepo ~>', err)
        throw err
    }
}

Organization.removeRepo = async (orgID, repoID) => {
    const params = {
        TableName:                 OrganizationTable,
        Key:                       { orgID },
        UpdateExpression:          'delete #repos :repo',
        ExpressionAttributeNames:  { '#repos': 'repos' },
        ExpressionAttributeValues: { ':repo': dynamo.createSet([ repoID ]) },
    }

    try {
        await dynamo.updateAsync(params)
    } catch (err) {
        console.error('Error in Organization.removeRepo ~>', err)
        throw err
    }
}

export default Organization
