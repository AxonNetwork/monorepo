import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import validator from 'validator'
import rules from 'password-rules'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import async from 'async'
import Mailgun from 'mailgun-js'
import sharp from 'sharp'
import Busboy from 'busboy'
import HTTPError from '../util/HTTPError'
import passportAuthenticateAsync from '../util/passportAuth'
import { pipeImageToS3, getUploadedImage, deleteImageFromS3 } from '../util/pictureUtils'
import User from '../models/user'
import { AWS } from '../config/aws'
import { getUserRegistryContract } from '../eth'

// For some reason, this module doesn't like being imported.  It ends up being `undefined`.
const ethJSUtil = require('ethereumjs-util')

const userController = {}

userController.whoAmI = async (req, res, next) => {
    const { userID, emails, name, username, picture, orgs, profile } = req.user
    const user = req.user
    return res.status(200).json({ userID, emails, name, username, picture, orgs, profile })
}

userController.login = async (req, res, next) => {
    const { user, info } = await passportAuthenticateAsync('local', req, res, next)
    if (!user) {
        throw new HTTPError(403, 'Username or password is invalid')
    }
    const { token } = await reqLoginAsync(req, user)

    const { userID, emails, name, username, picture, orgs, profile, mnemonic } = user
    return res.status(200).json({ userID, emails, name, username, picture, orgs, profile, jwt: token, mnemonic })
}

userController.loginWithKey = async (req, res, next) => {
    const { username, hexSignature } = req.body
    if (!username || !hexSignature) {
        throw new HTTPError(400, 'Missing either username or signature')
    }

    const match = await usernameMatchesSignature(username, hexSignature)
    if (!match) {
        throw new HTTPError(403, 'Signature does not match provided username')
    }

    const user = await User.getByUsername(username)
    if (user === undefined) {
        throw new HTTPError(403, 'User does not exist')
    }
    const { token } = await reqLoginAsync(req, user)

    const { userID, emails, name, picture, orgs, profile, mnemonic } = user
    return res.status(200).json({ userID, emails, name, username, picture, orgs, profile, jwt: token })
}

userController.createUser = async (req, res, next) => {
    // Validate the request.
    const { password, email, name, username, hexSignature, mnemonic } = req.body

    if (!password || !name || !email || !username || !hexSignature || !mnemonic) {
        throw new HTTPError(400, 'Missing field.  "email", "name", "password", "hexSignature", and "mnemonic" are all required')
    } else if (!validator.isEmail(email || '')) {
        throw new HTTPError(400, 'Not a valid email')
    }
    const passwordRules = rules(password, { requireNumber: false })
    if (passwordRules) {
        throw new HTTPError(400, passwordRules.sentence)
    }

    const match = await usernameMatchesSignature(username, hexSignature)
    if (!match) {
        throw new HTTPError(403, 'Signature does not match provided username')
    }

    // Create the user and log them in.
    const { userID } = await User.create(email, password, name, username, mnemonic)
    const { user, info } = await passportAuthenticateAsync('local', req, res, next)
    if (!user) {
        throw new HTTPError(400, 'Username or password is invalid')
    }
    const { token } = await reqLoginAsync(req, user)

    return res.status(200).json({ userID, emails: [ email ], name, username, picture: null, orgs: [], profile: null, jwt: token })
}

userController.getSettings = async (req, res, next) => {
    const { userID } = req.user
    const settings = await User.getSettings(userID)
    return res.status(200).json(settings)
}

userController.updateSettings = async (req, res, next) => {
    const { userID } = req.user
    let { settings } = req.body

    await User.verifySettingsExist(userID)

    for (const key in settings) {
        await User.updateSetting(userID, key, settings[key])
    }

    settings = await User.getSettings(userID)

    return res.status(200).json(settings)
}

userController.sawComment = async (req, res, next) => {
    const { userID } = req.user
    const { repoID, discussionID, commentTimestamp } = req.body
    if (!repoID || !discussionID || !commentTimestamp) {
        throw new HTTPError(400, 'Missing either repoID, discussionID, or signature')
    }

    await User.verifySettingsExist(userID)
    const settings = await User.getSettings(userID)
    const newestViewed = settings.newestViewedCommentTimestamp
    const maxTimestamp = Math.max(commentTimestamp, (newestViewed[repoID] || {})[discussionID] || 0)
    let updatedRepo
    if (newestViewed[repoID] === undefined) {
        updatedRepo = { [discussionID]: maxTimestamp }
    } else {
        updatedRepo = {
            ...newestViewed[repoID],
            [discussionID]: maxTimestamp,
        }
    }
    const updated = {
        ...newestViewed,
        [repoID]: updatedRepo,
    }

    await User.updateSetting(userID, 'newestViewedCommentTimestamp', updated)

    return res.status(200).json({})
}

userController.getUsers = async (req, res, next) => {
    let { userIDs } = req.query
    if (userIDs === null || userIDs === undefined) {
        throw new HTTPError(400, 'missing "userIDs" querystring param')
    }

    if (!_.isArray(userIDs)) {
        userIDs = [ userIDs ]
    }

    let users = await Promise.all(userIDs.map(userID => User.get(userID)))

    users = users.filter(u => !!u)

    return res.status(200).json(users)
}

userController.getUsersByEmail = async (req, res, next) => {
    let { emails } = req.query
    if (emails === null || emails === undefined) {
        throw new HTTPError(400, 'missing "emails" querystring param')
    }

    if (!_.isArray(emails)) {
        emails = [ emails ]
    }

    const users = await Promise.all(emails.map(email => User.getByEmail(email)))

    return res.status(200).json(users)
}

userController.getUsersByUsername = async (req, res, next) => {
    let { usernames } = req.query
    if (usernames === null || usernames === undefined) {
        throw new HTTPError(400, 'missing "usernames" querystring param')
    }

    if (!_.isArray(usernames)) {
        usernames = [ usernames ]
    }

    const users = await Promise.all(usernames.map(username => User.getByUsername(username)))

    return res.status(200).json(users)
}

userController.uploadProfilePicture = async (req, res) => {
    const { userID } = req.user
    const data = await getUploadedImage(req, { imageSizes: [ [ 512, 512 ], [ 256, 256 ], [ 128, 128 ] ] })
    // const filename = userID + path.extname(data.filename)
    if (!data.filestreams) {
        return res.status(400).json({ error: 'no picture was uploaded' })
    }

    // Remove the old
    try {
        const oldPictures = await listS3Objects('conscience-user-photos', `${userID}-picture-`)
        const deleteOps = oldPictures.map(filename => deleteImageFromS3(filename, 'conscience-user-photos'))
        await Promise.all(deleteOps)
    } catch (err) {}

    // Upload the new
    function makeFilename(file) {
        return `${userID}-picture-${file.size}${path.extname(file.filename).toLowerCase()}`
    }
    const uploadOps = data.filestreams.map(file => pipeImageToS3(file.stream, makeFilename(file), 'conscience-user-photos'))
    const resp = await Promise.all(uploadOps)

    // Update the DB record
    const picture = {
        '512x512': resp[0].Location,
        '256x256': resp[1].Location,
        '128x128': resp[2].Location,
    }
    await User.setProfilePictureFilenames(userID, picture)

    res.status(200).json({ picture, userID })
}

userController.updateUserProfile = async (req, res) => {
    const { userID } = req.user
    const { profile } = req.body
    if (!profile) {
        throw new HTTPError(400, 'Missing field. "profile" is required')
    }

    await User.updateUserProfile(userID, profile)
    const user = await User.get(userID)

    res.status(200).json(user)
}

userController.modifyEmail = async (req, res) => {
    const { userID } = req.user
    const { email, add } = req.body
    if (!email || (add === null || add === undefined)) {
        throw new HTTPError(400, 'Missing field.  "email" and "add" are required')
    } else if (!validator.isEmail(email || '')) {
        throw new HTTPError(400, 'Not a valid email')
    } else if (!userID) {
        throw new HTTPError(403, 'Not logged in')
    }

    if (add) {
        await User.addEmail(userID, email)
    } else {
        await User.removeEmail(userID, email)
    }

    res.status(200).json({})
}

userController.removeEmail = async (req, res) => {
    const { userID } = req.user
    const { email } = req.body

    await User.removeEmail(userID, email)

    res.status(200).json({})
}

userController.logout = (req, res) => {
    req.logOut()
    req.session.destroy()
    res.redirect('/')
}

userController.getSharedRepos = async (req, res, next) => {
    try {
        const { userID } = req.query
        const sharedRepos = await User.getSharedRepos(userID)

        res.status(200).json({ sharedRepos })
    } catch (err) {
        throw new HTTPError(400, err)
    }
}

userController.getOrganizations = async (req, res, next) => {
    const { userID } = req.user
    const orgs = await User.getOrganizations(userID)
    return res.status(200).json({ orgs })
}

userController.sendFeedbackEmail = async (req, res, next) => {
    const { subject, message } = req.body

    const messageWithDetails = `
        <strong>userID:</strong> ${req.user.userID}<br/>
        <strong>emails:</strong> ${req.user.emails.join(', ')}<br/>
        <strong>name:</strong> ${req.user.name}<br/>
        <br/>
        <strong>Message:</strong><br/>
        <pre>${message}</pre>
    `

    const mailgun = new Mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN })
    const data = {
        from:    'frustrated-user@conscience.network',
        to:      'bryn@conscience.network',
        subject: 'Contact form: ' + subject,
        html:    messageWithDetails,
    }

    mailgun.messages().send(data, (err, body) => {
        if (err) {
            console.error("got an error: ", err)
            req.bugsnag.notify(err, {
                metadata: { subject, message },
            })
        }
        return res.status(200).json({})
    })
}

/**
 * Utility functions
 */

async function usernameMatchesSignature(username, hexSignature) {
    const signature = Buffer.from(hexSignature, 'hex')
    const sigParams = ethJSUtil.fromRpcSig(signature)
    const pubkey = ethJSUtil.ecrecover(ethJSUtil.keccak(username, 256), sigParams.v, sigParams.r, sigParams.s)
    const addrBuf = ethJSUtil.pubToAddress(pubkey)
    const addr = ethJSUtil.bufferToHex(addrBuf)

    const userRegistry = await getUserRegistryContract()
    const addrByName = await userRegistry.getAddressForUsername(username)
    console.log('usernameMatchesSignature', addr, addrByName)

    return addr === addrByName
}

function reqLoginAsync(req, user) {
    return new Promise((resolve, reject) => {
        req.login(user, { session: false }, (err) => {
            if (err) return reject(err)
            const token = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET)

            return resolve({ token })
        })
    })
}

export default userController

