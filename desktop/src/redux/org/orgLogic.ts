import { makeLogic } from '../reduxUtils'
import { OrgActionType,
    IFetchOrgInfoAction, IFetchOrgInfoSuccessAction,
    IUpdateOrgAction, IUpdateOrgSuccessAction,
    IUploadOrgPictureAction, IUploadOrgPictureSuccessAction,
    IAddMemberToOrgAction, IAddMemberToOrgSuccessAction,
    IRemoveMemberFromOrgAction, IRemoveMemberFromOrgSuccessAction,
    IAddRepoToOrgAction, IAddRepoToOrgSuccessAction,
    IRemoveRepoFromOrgAction, IRemoveRepoFromOrgSuccessAction,
    IChangeOrgDescriptionAction, IChangeOrgDescriptionSuccessAction,
} from './orgActions'
import { fetchUserData } from '../user/userActions'
import ServerRelay from 'lib/ServerRelay'

const fetchOrgInfoLogic = makeLogic<IFetchOrgInfoAction, IFetchOrgInfoSuccessAction>({
    type: OrgActionType.FETCH_ORG_INFO,
    async process({ action}, dispatch){
        const { orgID } = action.payload
        const org = await ServerRelay.fetchOrgInfo(orgID)
        await dispatch(fetchUserData({ userIDs: org.members }))
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
        const { picture } = await ServerRelay.uploadOrgPicture(orgID, fileInput)

        return { orgID, picture }
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


export default [
    fetchOrgInfoLogic,
    updateOrgLogic,
    uploadOrgPicture,
    addMemberToOrgLogic,
    removeMemberFromOrgLogic,
    addRepoToOrgLogic,
    removeRepoFromOrgLogic,
    changeOrgDescriptionLogic,
]