import { makeLogic } from '../reduxUtils'
import { OrgActionType,
    IFetchOrgInfoAction, IFetchOrgInfoSuccessAction
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

export default [
    fetchOrgInfoLogic,
]