import { OrgActionType, IOrgAction } from './orgActions'
import { IOrganization } from 'common'

const initialState = {
    orgs: {},
    selectedOrg: undefined,
}

export interface IOrgState {
    orgs: {[orgID: string]: IOrganization}
    selectedOrg: string|undefined // orgID
}

const orgReducer = (state: IOrgState = initialState, action: IOrgAction): IOrgState => {
    switch(action.type){
        case OrgActionType.FETCH_ORG_INFO_SUCCESS: {
            const { org } = action.payload
            return {
                ...state,
                orgs:{
                    ...state.orgs,
                    [org.orgID]: org
                }
            }
        }

        case OrgActionType.ADD_MEMBER_TO_ORG_SUCCESS: {
            const { orgID, userID } = action.payload
            return {
                ...state,
                orgs: {
                    ...state.orgs,
                    [orgID]: {
                        ...state.orgs[orgID],
                        members: [
                            ...state.orgs[orgID].members,
                            userID
                        ]
                    }
                }
            }
        }

        case OrgActionType.REMOVE_MEMBER_FROM_ORG_SUCCESS: {
            const { orgID, userID } = action.payload
            const updatedMembers = state.orgs[orgID].members
                .filter((id: string) => id !== userID)
            return {
                ...state,
                orgs: {
                    ...state.orgs,
                    [orgID]: {
                        ...state.orgs[orgID],
                        members: updatedMembers
                    }
                }
            }
        }


        case OrgActionType.SELECT_ORG: {
            return {
                ...state,
                selectedOrg: action.payload.orgID
            }
        }
    }
    return state
}

export default orgReducer