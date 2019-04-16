import Promise from 'bluebird'
import { dynamo } from '../config/aws'
import { makeID, getAll } from './utils'

let bcrypt = require('bcrypt')

bcrypt = Promise.promisifyAll(bcrypt, { suffix: 'Async' })
const SALT_WORK_FACTOR = 12

const UserTable = `${process.env.DYNAMODB_TABLE_PREFIX}_Users`
const UserSettingsTable = `${process.env.DYNAMODB_TABLE_PREFIX}_UserSettings`
const UserProfilesTable = `${process.env.DYNAMODB_TABLE_PREFIX}_UserProfiles`
const UserEmailsTable = `${process.env.DYNAMODB_TABLE_PREFIX}_UserEmails`
const UserEmailsTableIndexByUser = 'ByUser'

const User = {}


User.create = async (email, password, name, username, mnemonic) => {
    const resp = await dynamo.getAsync({
        TableName: UserEmailsTable,
        Key:       { email },
    })
    if (resp.Item !== undefined) {
        throw new Error('email already registered')
    }

    const salt = await bcrypt.genSaltAsync(SALT_WORK_FACTOR)
    const passwordHash = await bcrypt.hashAsync(password, salt)

    let userID
    while (true) {
        userID = makeID()
        const newUser = {
            userID,
            passwordHash,
            name,
            username,
            mnemonic,
            created: new Date().getTime(),
        }

        try {
            await dynamo.putAsync({
                TableName:           UserTable,
                Item:                newUser,
                ConditionExpression: 'attribute_not_exists(userID)',
            })
            break

        } catch (err) {
            if (err.code === 'ConditionalCheckFailedException') {
                continue
            }
            throw err
        }
    }

    await dynamo.putAsync({
        TableName: UserEmailsTable,
        Item:      { email, userID },
    })

    return { userID, emails: [ email ], passwordHash, name, username }
}

User.get = async (userID, opts) => {
    if (!opts) {
        opts = {}
    }
    opts.filterPassword = opts.filterPassword === undefined ? true : opts.filterPassword
    opts.filterMnemonic = opts.filterMnemonic === undefined ? true : opts.filterMnemonic

    const user = (await dynamo.getAsync({
        TableName: UserTable,
        Key:       { userID },
    })).Item

    if (user === undefined) {
        return undefined
    }

    const emailResult = await getAll({
        TableName:                 UserEmailsTable,
        IndexName:                 UserEmailsTableIndexByUser,
        KeyConditionExpression:    'userID = :userID',
        ExpressionAttributeValues: { ':userID': userID },
    })

    // Normalize the return value from Dynamo (convert Sets to arrays, filter private fields, etc.)
    user.userID = user.userID || null,
    user.name = user.name || null,
    user.username = user.username || null,
    user.picture = user.picture || null,
    user.repos = (user.repos || {}).values || [],
    user.orgs = (user.orgs || {}).values || [],
    user.emails = emailResult.map(row => row.email)
    user.profile = await User.getUserProfile(userID)
    if (opts.filterPassword) {
        delete user.passwordHash
    }
    if (opts.filterMnemonic) {
        delete user.mnemonic
    }

    return user
}

User.getByUsername = async (username, opts) => {
    const result = await dynamo.queryAsync({
        TableName:                 UserTable,
        KeyConditionExpression:    'username = :username',
        ExpressionAttributeValues: { ':username': username },
        IndexName:                 'ByUsername',
    })
    if (result.Items.length < 1) {
        return undefined
    }
    // username is unique
    const userID = result.Items[0].userID
    return User.get(userID, opts)
}

User.getByEmail = async (email, opts) => {
    const row = (await dynamo.getAsync({
        TableName: UserEmailsTable,
        Key:       { email },
    })).Item

    if (row === undefined) {
        return undefined
    }

    return User.get(row.userID, opts)
}

User.addRepo = async (repoID, userID) => {
    await dynamo.updateAsync({
        TableName:                 UserTable,
        Key:                       { userID },
        UpdateExpression:          'add #repos :repo',
        ExpressionAttributeNames:  { '#repos': 'repos' },
        ExpressionAttributeValues: { ':repo': dynamo.createSet([ repoID ]) },
        ReturnValues:              'UPDATED_NEW',
    })
}

User.unshareRepo = async (repoID, userID) => {
    await dynamo.updateAsync({
        TableName:                 UserTable,
        Key:                       { userID },
        UpdateExpression:          'delete repos :repo',
        ExpressionAttributeValues: { ':repo': dynamo.createSet([ repoID ]) },
    })
}

User.joinOrganization = async (orgID, userID) => {
    await dynamo.updateAsync({
        TableName:                 UserTable,
        Key:                       { userID },
        UpdateExpression:          'add #orgs :org',
        ExpressionAttributeNames:  { '#orgs': 'orgs' },
        ExpressionAttributeValues: { ':org': dynamo.createSet([ orgID ]) },
        ReturnValues:              'UPDATED_NEW',
    })
}

User.exitOrganization = async (orgID, userID) => {
    await dynamo.updateAsync({
        TableName:                 UserTable,
        Key:                       { userID },
        UpdateExpression:          'delete orgs :org',
        ExpressionAttributeValues: { ':org': dynamo.createSet([ orgID ]) },
    })
}

User.getOrganizations = async (userID) => {
    const result = await dynamo.getAsync({
        TableName: UserTable,
        Key:       { userID },
    })
    return (result.Item.orgs || { values: [] }).values
}


User.getSharedRepos = async (userID) => {
    const result = await dynamo.getAsync({
        TableName: UserTable,
        Key:       { userID },
    })
    return (result.Item.repos || { values: [] }).values
}

// `filenames` must be an object keyed by the dimensions of each version of the resized profile
// picture.  For example:
// {
//     '512x512': 'http://...',
//     '256x256': 'http://...',
//     '128x128': 'http://...',
// }
User.setProfilePictureFilenames = async (userID, filenames) => {
    await dynamo.updateAsync({
        TableName:                 UserTable,
        Key:                       { userID },
        UpdateExpression:          'set picture = :picture',
        ExpressionAttributeValues: { ':picture': filenames },
    })
}

User.getUserProfile = async (userID) => {
    let profile = (await dynamo.getAsync({
        TableName: UserProfilesTable,
        Key:       { userID },
    })).Item

    if (profile === undefined) {
        profile = {}
    }

    return {
        geolocation: profile.geolocation || '',
        bio:         profile.bio || '',
        orcid:       profile.orcid || '',
        university:  profile.university || '',
        interests:   profile.interests || [],
    }
}

User.updateUserProfile = async (userID, profile) => {
    const keys = Object.keys(profile)
    const updates = []
    const expressionAttrVals = {}
    let updated = false
    for (const key in profile) {
        if (profile[key] && profile[key].length > 0) {
            updated = true
            updates.push(`${key} = :${key}`)
            expressionAttrVals[`:${key}`] = profile[key]
        }
    }
    const updateExpression = `SET ${updates.join(', ')}`

    await dynamo.updateAsync({
        TableName:                 UserProfilesTable,
        Key:                       { userID },
        UpdateExpression:          updateExpression,
        ExpressionAttributeValues: expressionAttrVals,
    })
}

// @@TODO: make sure email doesn't already exist
// @@TODO: verification email
User.addEmail = async (userID, email) => {
    await dynamo.putAsync({
        TableName: UserEmailsTable,
        Item:      { email, userID },
    })
}

User.removeEmail = async (userID, email) => {
    await dynamo.deleteAsync({
        TableName: UserEmailsTable,
        Key:       { email },
    })
}

User.verifySettingsExist = async (userID) => {
    const settings = await User.getSettings(userID)
    if (settings !== undefined) {
        return
    }

    await dynamo.putAsync({
        TableName: UserSettingsTable,
        Item:      { userID },
    })
}

User.getSettings = async (userID) => {
    const result = await dynamo.getAsync({
        TableName: UserSettingsTable,
        Key:       { userID },
    })
    const item = result.Item || {}
    return {
        codeColorScheme:              item.codeColorScheme || 'pojoaque',
        menuLabelsHidden:             item.menuLabelsHidden || false,
        fileExtensionsHidden:         item.fileExtensionsHidden || false,
        newestViewedCommentTimestamp: item.newestViewedCommentTimestamp || {},
    }
}

User.updateSetting = async (userID, field, value) => {
    await dynamo.updateAsync({
        TableName:                 UserSettingsTable,
        Key:                       { userID },
        UpdateExpression:          'SET #field = :value',
        ExpressionAttributeNames:  { '#field': field },
        ExpressionAttributeValues: { ':value': value },
        ReturnValues:              'UPDATED_NEW',
    })
}

export default User
