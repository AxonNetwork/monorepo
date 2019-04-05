import { dynamo } from '../config/aws'
import { makeID, getAll } from './utils'
import nonemptyString from '../util/nonemptyString'

const OrganizationBlogsTable = `${process.env.DYNAMODB_TABLE_PREFIX}_OrganizationBlogs`

const OrganizationBlogs = {}

OrganizationBlogs.create = async ({ orgID, title, body, author }) => {
    if (!nonemptyString(orgID)) {
        throw new Error('orgID: bad value')
    } else if (!nonemptyString(title)) {
        throw new Error('title: bad value')
    } else if (!nonemptyString(body)) {
        throw new Error('body: bad value')
    } else if (!nonemptyString(author)) {
        throw new Error('author: bad value')
    }

    while (true) {
        const blog = {
            orgID,
            title,
            body,
            author,
            created: new Date().getTime(),
        }

        try {
            await dynamo.putAsync({
                TableName:           OrganizationBlogsTable,
                Item:                blog,
                ConditionExpression: 'attribute_not_exists(created)',
            })

            return blog
        } catch (err) {
            if (err.code === 'ConditionalCheckFailedException') {
                continue
            }
            console.error('Error creating organization ~>', err)
            throw err
        }
    }
}

OrganizationBlogs.get = async (orgID, created) => {
    const result = (await dynamo.getAsync({
        TableName: OrganizationBlogsTable,
        Key:       { orgID, created },
    })).Item

    return result
}

OrganizationBlogs.getMany = async (orgID) => {
    return getAll({
        TableName:                 OrganizationBlogsTable,
        KeyConditionExpression:    'orgID = :orgID',
        ExpressionAttributeValues: { ':orgID': orgID },
    })
}

OrganizationBlogs.update = async ({ orgID, created, title, body, author }) => {
    if (!nonemptyString(orgID)) {
        throw new Error('orgID: bad value')
    } else if (typeof created !== 'number') {
        throw new Error('created: bad value')
    } else if (title !== undefined && !nonemptyString(title)) {
        throw new Error('title: bad value')
    } else if (body !== undefined && !nonemptyString(body)) {
        throw new Error('body: bad value')
    } else if (author !== undefined && !nonemptyString(author)) {
        throw new Error('author: bad value')
    }

    const ExpressionAttributeNames = {}
    const ExpressionAttributeValues = {}
    const updateExpressionParts = []
    if (title) {
        ExpressionAttributeNames['#title'] = 'title'
        ExpressionAttributeValues[':title'] = title
        updateExpressionParts.push('#title = :title')
    }
    if (body) {
        ExpressionAttributeNames['#body'] = 'body'
        ExpressionAttributeValues[':body'] = body
        updateExpressionParts.push('#body = :body')
    }
    if (author) {
        ExpressionAttributeNames['#author'] = 'author'
        ExpressionAttributeValues[':author'] = author
        updateExpressionParts.push('#author = :author')
    }

    const params = {
        TableName:        OrganizationBlogsTable,
        Key:              { orgID, created },
        UpdateExpression: `SET ${updateExpressionParts.join(', ')}`,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues:     'UPDATED_NEW',
    }
    let org
    try {
        org = await dynamo.updateAsync(params)
    } catch (err) {
        console.error(`Error in OrganizationBlogs.update-${field} ~>`, err)
        throw err
    }

    return org.Attributes
}

export default OrganizationBlogs
