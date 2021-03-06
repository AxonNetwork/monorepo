import keyBy from 'lodash/keyBy'
import { makeLogic } from '../reduxUtils'
import {
    OrgActionType,
    ICreateOrgAction, ICreateOrgSuccessAction,
    IFetchOrgInfoAction, IFetchOrgInfoSuccessAction,
    IUpdateOrgAction, IUpdateOrgSuccessAction,
    IUploadOrgPictureAction, IUploadOrgPictureSuccessAction,
    IUploadOrgBannerAction, IUploadOrgBannerSuccessAction,
    IAddMemberToOrgAction, IAddMemberToOrgSuccessAction,
    IRemoveMemberFromOrgAction, IRemoveMemberFromOrgSuccessAction,
    IAddRepoToOrgAction, IAddRepoToOrgSuccessAction,
    IRemoveRepoFromOrgAction, IRemoveRepoFromOrgSuccessAction,
    IChangeOrgDescriptionAction, IChangeOrgDescriptionSuccessAction,
    IChangeOrgFeaturedReposAction, IChangeOrgFeaturedReposSuccessAction,
    IFetchShowcaseTimelineAction, IFetchShowcaseTimelineSuccessAction,
    IFetchOrgBlogsAction, IFetchOrgBlogsSuccessAction,
    ICreateOrgBlogAction, ICreateOrgBlogSuccessAction,
    IUpdateOrgColorsAction, IUpdateOrgColorsSuccessAction
} from './orgActions'
import { fetchUserData, addedOrg } from '../user/userActions'
// import { getRepo } from '../repo/repoActions'
import ServerRelay from 'conscience-lib/ServerRelay'
import { nonCacheImg } from 'conscience-lib/utils'
import { IOrgBlog } from 'conscience-lib/common'

const createOrgLogic = makeLogic<ICreateOrgAction, ICreateOrgSuccessAction>({
    type: OrgActionType.CREATE_ORG,
    async process({ action }, dispatch) {
        const { name } = action.payload
        const org = await ServerRelay.createOrg(name)
        const userID = org.members[0]
        const orgID = org.orgID
        await dispatch(addedOrg({ userID, orgID }))
        org.primaryColor = org.primaryColor || 'black'
        org.secondaryColor = org.secondaryColor || '#fafafa'
        return { org }
    },
})

const fetchOrgInfoLogic = makeLogic<IFetchOrgInfoAction, IFetchOrgInfoSuccessAction>({
    type: OrgActionType.FETCH_ORG_INFO,
    async process({ action }, dispatch) {
        const { orgID } = action.payload
        const org = await ServerRelay.fetchOrgInfo(orgID)
        // let promises = org.repos.map(repoID => dispatch(getRepo({ repoID })))
        // promises.push(dispatch(fetchUserData({ userIDs: org.members })))
        // await Promise.all(promises)
        await dispatch(fetchUserData({ userIDs: org.members }))
        org.primaryColor = org.primaryColor || 'black'
        org.secondaryColor = org.secondaryColor || '#fafafa'
        return { org }
    },
})

const updateOrgLogic = makeLogic<IUpdateOrgAction, IUpdateOrgSuccessAction>({
    type: OrgActionType.UPDATE_ORG,
    async process({ action }) {
        const { orgID, name, description, readme } = action.payload
        const org = await ServerRelay.updateOrg(orgID, name, description, readme)
        org.primaryColor = org.primaryColor || 'black'
        org.secondaryColor = org.secondaryColor || '#fafafa'
        return { org }
    },
})

const uploadOrgPicture = makeLogic<IUploadOrgPictureAction, IUploadOrgPictureSuccessAction>({
    type: OrgActionType.UPLOAD_ORG_PICTURE,
    async process({ action }) {
        const { orgID, fileInput } = action.payload
        const resp = await ServerRelay.uploadOrgPicture(orgID, fileInput)
        return { orgID, picture: resp.picture }
    },
})

const uploadOrgBanner = makeLogic<IUploadOrgBannerAction, IUploadOrgBannerSuccessAction>({
    type: OrgActionType.UPLOAD_ORG_BANNER,
    async process({ action }) {
        const { orgID, fileInput } = action.payload
        const resp = await ServerRelay.uploadOrgBanner(orgID, fileInput)
        const banner = nonCacheImg(resp.banner)
        return { orgID, banner }
    },
})

const addMemberToOrgLogic = makeLogic<IAddMemberToOrgAction, IAddMemberToOrgSuccessAction>({
    type: OrgActionType.ADD_MEMBER_TO_ORG,
    async process({ action }) {
        const { orgID, userID } = action.payload
        await ServerRelay.addMemberToOrg(orgID, userID)
        return { orgID, userID }
    },
})

const removeMemberFromOrgLogic = makeLogic<IRemoveMemberFromOrgAction, IRemoveMemberFromOrgSuccessAction>({
    type: OrgActionType.REMOVE_MEMBER_FROM_ORG,
    async process({ action }) {
        const { orgID, userID } = action.payload
        await ServerRelay.removeMemberFromOrg(orgID, userID)
        return { orgID, userID }
    },
})

const addRepoToOrgLogic = makeLogic<IAddRepoToOrgAction, IAddRepoToOrgSuccessAction>({
    type: OrgActionType.ADD_REPO_TO_ORG,
    async process({ action }) {
        const { orgID, repoID } = action.payload
        await ServerRelay.addRepoToOrg(orgID, repoID)
        return { orgID, repoID }
    },
})

const removeRepoFromOrgLogic = makeLogic<IRemoveRepoFromOrgAction, IRemoveRepoFromOrgSuccessAction>({
    type: OrgActionType.REMOVE_REPO_FROM_ORG,
    async process({ action }) {
        const { orgID, repoID } = action.payload
        await ServerRelay.removeRepoFromOrg(orgID, repoID)
        return { orgID, repoID }
    },
})

const changeOrgDescriptionLogic = makeLogic<IChangeOrgDescriptionAction, IChangeOrgDescriptionSuccessAction>({
    type: OrgActionType.CHANGE_ORG_DESCRIPTION,
    async process({ action }) {
        const { orgID, description } = action.payload
        await ServerRelay.changeOrgDescription(orgID, description)
        return { orgID, description }
    },
})

const changeOrgFeaturedReposLogic = makeLogic<IChangeOrgFeaturedReposAction, IChangeOrgFeaturedReposSuccessAction>({
    type: OrgActionType.CHANGE_ORG_FEATURED_REPOS,
    async process({ action }) {
        const { orgID, featuredRepos } = action.payload
        await ServerRelay.changeOrgFeaturedRepos(orgID, featuredRepos)
        return { orgID, featuredRepos }
    },
})

const fetchShowcaseTimelineLogic = makeLogic<IFetchShowcaseTimelineAction, IFetchShowcaseTimelineSuccessAction>({
    type: OrgActionType.FETCH_SHOWCASE_TIMELINE,
    async process({ action }) {
        const { orgID } = action.payload
        const timeline = await ServerRelay.fetchShowcaseTimeline(orgID)
        return { orgID, timeline }
    },
})

const fetchOrgBlogsLogic = makeLogic<IFetchOrgBlogsAction, IFetchOrgBlogsSuccessAction>({
    type: OrgActionType.FETCH_ORG_BLOGS,
    async process({ action }) {
        const { orgID } = action.payload
        const blogList = await ServerRelay.fetchOrgBlogs(orgID)
        const blogs = keyBy(blogList, b => `${b.created}`) as { [created: string]: IOrgBlog }
        return { orgID, blogs }
    },
})

const createOrgBlogLogic = makeLogic<ICreateOrgBlogAction, ICreateOrgBlogSuccessAction>({
    type: OrgActionType.CREATE_ORG_BLOG,
    async process({ action }) {
        const blog = await ServerRelay.createOrgBlog(action.payload.blog)
        return { blog }
    },
})

const updateOrgColorsLogic = makeLogic<IUpdateOrgColorsAction, IUpdateOrgColorsSuccessAction>({
    type: OrgActionType.UPDATE_ORG_COLORS,
    async process({ action }, dispatch) {
        const { orgID, primaryColor, secondaryColor } = action.payload
        await ServerRelay.updateOrgColors(orgID, primaryColor, secondaryColor)
        return { orgID, primaryColor, secondaryColor }
    },
})

export default [
    createOrgLogic,
    fetchOrgInfoLogic,
    updateOrgLogic,
    uploadOrgPicture,
    uploadOrgBanner,
    addMemberToOrgLogic,
    removeMemberFromOrgLogic,
    addRepoToOrgLogic,
    removeRepoFromOrgLogic,
    changeOrgDescriptionLogic,
    changeOrgFeaturedReposLogic,
    fetchShowcaseTimelineLogic,
    fetchOrgBlogsLogic,
    createOrgBlogLogic,
    updateOrgColorsLogic
]