import { makeLogic } from '../reduxUtils'
import { OrgActionType,
    IFetchOrgInfoAction, IFetchOrgInfoSuccessAction,
    IAddMemberToOrgAction, IAddMemberToOrgSuccessAction,
    IRemoveMemberFromOrgAction, IRemoveMemberFromOrgSuccessAction,
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

export default [
    fetchOrgInfoLogic,
    addMemberToOrgLogic,
    removeMemberFromOrgLogic,
]