import { OrgActionType, IOrgAction } from './orgActions'
import { IOrganization } from 'common'

const initialState = {
    orgs: {}
}

export interface IOrgState {
    orgs: {[orgID: string]: IOrganization}
}

const orgReducer = (state: IOrgState = initialState, action: IOrgAction): IOrgState => {
    switch(action.type){
        case OrgActionType.FETCH_ORG_INFO_SUCCESS:
            const { org } = action.payload
            return {
                ...state,
                orgs:{
                    ...state.orgs,
                    [org.orgID]: org
                }
            }
    }
    return state
}

export default orgReducer