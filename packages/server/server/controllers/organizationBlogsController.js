import OrganizationBlogs from '../models/organization-blogs'
import Organization from '../models/organization'
import HTTPError from '../util/HTTPError'

const organizationBlogsController = {}

organizationBlogsController.create = async (req, res, next) => {
    const { orgID } = req.params
    const { title, body, author } = req.body
    if (!orgID) {
        throw new HTTPError(400, 'Missing orgID')
    } else if (!title) {
        throw new HTTPError(400, 'Missing title')
    } else if (!body) {
        throw new HTTPError(400, 'Missing body')
    } else if (!author) {
        throw new HTTPError(400, 'Missing author')
    } else if ((req.user.orgs || []).indexOf(orgID) === -1) {
        throw new HTTPError(403, 'You don\'t belong to this organization')
    }

    const blog = await OrganizationBlogs.create({ orgID, title, body, author })
    return res.status(200).json(blog)
}

organizationBlogsController.get = async (req, res, next) => {
    let { orgID, created } = req.params
    if (!orgID) {
        throw new HTTPError(400, 'Missing orgID')
    } else if (!created) {
        throw new HTTPError(400, 'Missing created')
    }

    created = parseInt(created, 10)
    if (isNaN(created)) {
        throw new HTTPError(400, 'created must be a number')
    }

    const blog = await OrganizationBlogs.get(orgID, created)
    return res.status(200).json(blog)
}

organizationBlogsController.getMany = async (req, res, next) => {
    const { orgID } = req.params
    if (!orgID) {
        throw new HTTPError(400, 'Missing orgID')
    }

    const blogs = await OrganizationBlogs.getMany(orgID)
    return res.status(200).json(blogs)
}

organizationBlogsController.update = async (req, res, next) => {
    let { orgID, created } = req.params
    const { title, body, author } = req.body
    if (!orgID) {
        throw new HTTPError(400, 'Missing orgID')
    } else if (!created) {
        throw new HTTPError(400, 'Missing created')
    } else if ((req.user.orgs || []).indexOf(orgID) === -1) {
        throw new HTTPError(403, 'You don\'t belong to this organization')
    }

    created = parseInt(created, 10)
    if (isNaN(created)) {
        throw new HTTPError(400, 'created must be a number')
    }

    const org = await OrganizationBlogs.update({ orgID, created, title, body, author })
    return res.status(200).json(org)
}

export default organizationBlogsController
