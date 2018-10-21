import { makeLogic } from '../reduxUtils'
import { OrgActionType,
    IFetchOrgInfoAction, IFetchOrgInfoSuccessAction,
    IUpdateOrgAction, IUpdateOrgSuccessAction,
    IAddMemberToOrgAction, IAddMemberToOrgSuccessAction,
    IRemoveMemberFromOrgAction, IRemoveMemberFromOrgSuccessAction,
    IAddRepoToOrgAction, IAddRepoToOrgSuccessAction,
    IRemoveRepoFromOrgAction, IRemoveRepoFromOrgSuccessAction,
    IChangeOrgDescriptionAction, IChangeOrgDescriptionSuccessAction,
} from './orgActions'
import ServerRelay from 'lib/ServerRelay'

const fetchOrgInfoLogic = makeLogic<IFetchOrgInfoAction, IFetchOrgInfoSuccessAction>({
    type: OrgActionType.FETCH_ORG_INFO,
    async process({ action}){
        const { orgID } = action.payload
        const org = await ServerRelay.fetchOrgInfo(orgID)

        return { org }
    }
})

const updateOrgLogic = makeLogic<IUpdateOrgAction, IUpdateOrgSuccessAction>({
    type: OrgActionType.UPDATE_ORG,
    async process({ action}){
        const { orgID, name, description } = action.payload
        const org = await ServerRelay.updateOrg(orgID, name, description)

        return { org }
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
    addMemberToOrgLogic,
    removeMemberFromOrgLogic,
    addRepoToOrgLogic,
    removeRepoFromOrgLogic,
    changeOrgDescriptionLogic,
]