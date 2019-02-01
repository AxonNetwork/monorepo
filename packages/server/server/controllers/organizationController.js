import Organization from '../models/organization'
import User from '../models/user'
import HTTPError from '../util/HTTPError'
import { pipeImageToS3, getUploadedImage, deleteImageFromS3, listS3Objects } from '../util/pictureUtils'
import path from 'path'

const organizationController = {}

organizationController.create = async (req, res, next) => {
    const { name } = req.body
    const { userID } = req.user
    if (!name) {
        throw new HTTPError(400, 'Missing name of organization')
    }

    const { orgID } = await Organization.create(name, userID)
    await Organization.addMember(orgID, userID)
    await User.joinOrganization(orgID, userID)

    const org = await Organization.get(orgID)

    return res.status(200).json(org)
}

organizationController.get = async (req, res, next) => {
    const { orgID } = req.params
    if (!orgID) {
        throw new HTTPError(400, 'Missing orgID')
    }
    const org = await Organization.get(orgID)

    return res.status(200).json(org)
}

organizationController.update = async (req, res, next) => {
    const { orgID, name, description, readme, featuredRepos } = req.body
    if (!orgID) {
        throw new HTTPError(400, 'Missing orgID')
    }
    if (name) {
        await Organization.updateField(orgID, 'name', name)
    }
    if (description) {
        await Organization.updateField(orgID, 'description', description)
    }
    if (readme) {
        await Organization.updateField(orgID, 'readme', readme)
    }
    if (featuredRepos) {
        await Organization.updateField(orgID, 'featuredRepos', featuredRepos)
    }

    const org = await Organization.get(orgID)

    return res.status(200).json(org)
}

organizationController.addMember = async (req, res, next) => {
    const { orgID, userID } = req.body
    if (!orgID) {
        throw new HTTPError(400, 'Missing orgID')
    } else if (!userID) {
        throw new HTTPError(400, 'Missing userID')
    }
    await Organization.addMember(orgID, userID)
    await User.joinOrganization(orgID, userID)

    res.status(200).json({})
}

organizationController.removeMember = async (req, res, next) => {
    const { orgID, userID } = req.body
    if (!orgID) {
        throw new HTTPError(400, 'Missing orgID')
    } else if (!userID) {
        throw new HTTPError(400, 'Missing userID')
    }
    await Organization.removeMember(orgID, userID)
    await User.exitOrganization(orgID, userID)

    res.status(200).json({})
}

organizationController.addRepo = async (req, res, next) => {
    const { orgID, repoID } = req.body
    if (!orgID) {
        throw new HTTPError(400, 'Missing orgID')
    } else if (!repoID) {
        throw new HTTPError(400, 'Missing repoID')
    }
    await Organization.addRepo(orgID, repoID)

    res.status(200).json({})
}

organizationController.removeRepo = async (req, res, next) => {
    const { orgID, repoID } = req.body
    if (!orgID) {
        throw new HTTPError(400, 'Missing orgID')
    } else if (!repoID) {
        throw new HTTPError(400, 'Missing repoID')
    }
    await Organization.removeMember(orgID, repoID)

    res.status(200).json({})
}

organizationController.uploadOrgPicture = async (req, res) => {
    const data = await getUploadedImage(req, { imageSizes: [ [ 512, 512 ], [ 256, 256 ], [ 128, 128 ] ] })
    const { orgID } = data.otherFields
    if (!data.filestreams) {
        return res.status(400).json({ error: 'no picture was uploaded' })
    }

    // Remove the old
    try {
        const oldPictures = await listS3Objects('conscience-org-photos', `${orgID}-picture-`)
        const deleteOps = oldPictures.map(filename => deleteImageFromS3(filename, 'conscience-org-photos'))
        await Promise.all(deleteOps)
    } catch (err) {}

    // Upload the new
    function makeFilename(file) {
        return `${orgID}-picture-${file.size}${path.extname(file.filename).toLowerCase()}`
    }
    const uploadOps = data.filestreams.map(file => pipeImageToS3(file.stream, makeFilename(file), 'conscience-org-photos'))
    const resp = await Promise.all(uploadOps)

    // Update the DB record
    const picture = { '512x512': resp[0].Location, '256x256': resp[1].Location, '128x128': resp[2].Location }
    await Organization.updateField(orgID, 'picture', picture)

    res.status(200).json({ picture, orgID })
}

organizationController.uploadOrgBanner = async (req, res) => {
    const data = await getUploadedImage(req)
    const { orgID } = data.otherFields
    if (!data.filestreams) {
        return res.status(400).json({ error: 'no picture was uploaded' })
    }

    // Remove the old
    try {
        const oldPictures = await listS3Objects('conscience-org-photos', `${orgID}-banner-`)
        const deleteOps = oldPictures.map(filename => deleteImageFromS3(filename, 'conscience-org-photos'))
        await Promise.all(deleteOps)
    } catch (err) {}

    // Upload the new
    function makeFilename(file) {
        return `${orgID}-banner-${file.size}${path.extname(file.filename).toLowerCase()}`
    }
    const uploadOps = data.filestreams.map(file => pipeImageToS3(file.stream, makeFilename(file), 'conscience-org-photos'))
    const resp = await Promise.all(uploadOps)

    // Update the DB record
    await Organization.updateField(orgID, 'banner', resp[0].Location)

    res.status(200).json({ banner: resp[0].Location, orgID })
}


export default organizationController
