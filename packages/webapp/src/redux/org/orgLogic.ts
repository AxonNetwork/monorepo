import { makeLogic } from '../reduxUtils'
import { OrgActionType,
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
} from './orgActions'
import { fetchUserData, addedOrg } from '../user/userActions'
import { getRepo } from '../repo/repoActions'
import ServerRelay from 'conscience-lib/ServerRelay'
import { nonCacheImg } from 'conscience-lib/utils'

const createOrgLogic = makeLogic<ICreateOrgAction, ICreateOrgSuccessAction>({
    type: OrgActionType.CREATE_ORG,
    async process({ action, getState }, dispatch){
        const { name } = action.payload
        const org = await ServerRelay.createOrg(name)
        const userID = org.members[0]
        const orgID = org.orgID
        await dispatch(addedOrg({ userID, orgID }))
        return { org }
    }
})

const fetchOrgInfoLogic = makeLogic<IFetchOrgInfoAction, IFetchOrgInfoSuccessAction>({
    type: OrgActionType.FETCH_ORG_INFO,
    async process({ action}, dispatch){
        const { orgID } = action.payload
        const org = await ServerRelay.fetchOrgInfo(orgID)
        let promises = org.repos.map(repoID => dispatch(getRepo({ repoID })))
        promises.push(dispatch(fetchUserData({ userIDs: org.members })))
        await Promise.all(promises)
        return { org }
    }
})

const updateOrgLogic = makeLogic<IUpdateOrgAction, IUpdateOrgSuccessAction>({
    type: OrgActionType.UPDATE_ORG,
    async process({ action}){
        const { orgID, name, description, readme } = action.payload
        const org = await ServerRelay.updateOrg(orgID, name, description, readme)
        return { org }
    }
})

const uploadOrgPicture  = makeLogic<IUploadOrgPictureAction, IUploadOrgPictureSuccessAction>({
    type: OrgActionType.UPLOAD_ORG_PICTURE,
    async process({ action}){
        const { orgID, fileInput } = action.payload
        const resp = await ServerRelay.uploadOrgPicture(orgID, fileInput)
        const picture = nonCacheImg(resp.picture)
        return { orgID, picture }
    }
})

const uploadOrgBanner  = makeLogic<IUploadOrgBannerAction, IUploadOrgBannerSuccessAction>({
    type: OrgActionType.UPLOAD_ORG_BANNER,
    async process({ action}){
        const { orgID, fileInput } = action.payload
        const resp = await ServerRelay.uploadOrgBanner(orgID, fileInput)
        const banner = nonCacheImg(resp.banner)
        return { orgID, banner }
    }
})

const addMemberToOrgLogic = makeLogic<IAddMemberToOrgAction, IAddMemberToOrgSuccessAction>({
    type: OrgActionType.ADD_MEMBER_TO_ORG,
    async process({ action}){
        const { orgID, email } = action.payload
        const user = (await ServerRelay.fetchUsersByEmail([ email ]))[0]
        if (user === undefined) {
            throw new Error('user does not exist')
        }
        const userID = user.userID
        await ServerRelay.addMemberToOrg(orgID, userID)
        return { orgID, userID }
    }
})

const removeMemberFromOrgLogic = makeLogic<IRemoveMemberFromOrgAction, IRemoveMemberFromOrgSuccessAction>({
    type: OrgActionType.REMOVE_MEMBER_FROM_ORG,
    async process({ action}){
        const { orgID, userID } = action.payload
        await ServerRelay.removeMemberFromOrg(orgID, userID)
        return { orgID, userID }
    }
})

const addRepoToOrgLogic = makeLogic<IAddRepoToOrgAction, IAddRepoToOrgSuccessAction>({
    type: OrgActionType.ADD_REPO_TO_ORG,
    async process({ action}){
        const { orgID, repoID } = action.payload
        await ServerRelay.addRepoToOrg(orgID, repoID)
        return { orgID, repoID }
    }
})

const removeRepoFromOrgLogic = makeLogic<IRemoveRepoFromOrgAction, IRemoveRepoFromOrgSuccessAction>({
    type: OrgActionType.REMOVE_REPO_FROM_ORG,
    async process({ action}){
        const { orgID, repoID } = action.payload
        await ServerRelay.removeRepoFromOrg(orgID, repoID)
        return { orgID, repoID }
    }
})

const changeOrgDescriptionLogic = makeLogic<IChangeOrgDescriptionAction, IChangeOrgDescriptionSuccessAction>({
    type: OrgActionType.CHANGE_ORG_DESCRIPTION,
    async process({ action}){
        const { orgID, description } = action.payload
        await ServerRelay.changeOrgDescription(orgID, description)
        return { orgID, description }
    }
})

const changeOrgFeaturedReposLogic = makeLogic<IChangeOrgFeaturedReposAction, IChangeOrgFeaturedReposSuccessAction>({
    type: OrgActionType.CHANGE_ORG_FEATURED_REPOS,
    async process({ action}){
        const { orgID, featuredRepos } = action.payload
        await ServerRelay.changeOrgFeaturedRepos(orgID, featuredRepos)
        return { orgID, featuredRepos }
    }
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
]