import { FailedAction } from '../reduxUtils'
import { IOrganization } from 'common'

export enum OrgActionType {
    CREATE_ORG = 'CREATE_ORG',
    CREATE_ORG_SUCCESS = 'CREATE_ORG_SUCCESS',
    CREATE_ORG_FAILED = 'CREATE_ORG_FAILED',

    FETCH_ORG_INFO = 'FETCH_ORG_INFO',
    FETCH_ORG_INFO_SUCCESS = 'FETCH_ORG_INFO_SUCCESS',
    FETCH_ORG_INFO_FAILED = 'FETCH_ORG_INFO_FAILED',

    ADD_MEMBER_TO_ORG = 'ADD_MEMBER_TO_ORG',
    ADD_MEMBER_TO_ORG_SUCCESS = 'ADD_MEMBER_TO_ORG_SUCCESS',
    ADD_MEMBER_TO_ORG_FAILED = 'ADD_MEMBER_TO_ORG_FAILED',

    REMOVE_MEMBER_FROM_ORG = 'REMOVE_MEMBER_FROM_ORG',
    REMOVE_MEMBER_FROM_ORG_SUCCESS = 'REMOVE_MEMBER_FROM_ORG_SUCCESS',
    REMOVE_MEMBER_FROM_ORG_FAILED = 'REMOVE_MEMBER_FROM_ORG_FAILED',

    SELECT_ORG = 'SELECT_ORG',
}

export interface ICreateOrgAction {
    type: OrgActionType.CREATE_ORG
    payload: {}
}

export interface ICreateOrgSuccessAction {
    type: OrgActionType.CREATE_ORG_SUCCESS
    payload: {}
}

export type ICreateOrgFailedAction = FailedAction<OrgActionType.CREATE_ORG_FAILED>

export interface IFetchOrgInfoAction {
    type: OrgActionType.FETCH_ORG_INFO
    payload: {
        orgID: string
    }
}

export interface IFetchOrgInfoSuccessAction {
    type: OrgActionType.FETCH_ORG_INFO_SUCCESS
    payload: {
        org: IOrganization
    }
}

export type IFetchOrgInfoFailedAction = FailedAction<OrgActionType.FETCH_ORG_INFO_FAILED>

export interface IAddMemberToOrgAction {
    type: OrgActionType.ADD_MEMBER_TO_ORG
    payload: {
        orgID: string
        email: string
    }
}

export interface IAddMemberToOrgSuccessAction {
    type: OrgActionType.ADD_MEMBER_TO_ORG_SUCCESS
    payload: {
        orgID: string
        userID: string
    }
}

export type IAddMemberToOrgFailedAction = FailedAction<OrgActionType.ADD_MEMBER_TO_ORG_FAILED>


export interface IRemoveMemberFromOrgAction {
    type: OrgActionType.REMOVE_MEMBER_FROM_ORG
    payload: {
        orgID: string
        userID: string
    }
}

export interface IRemoveMemberFromOrgSuccessAction {
    type: OrgActionType.REMOVE_MEMBER_FROM_ORG_SUCCESS
    payload: {
        orgID: string
        userID: string
    }
}

export type IRemoveMemberFromOrgFailedAction = FailedAction<OrgActionType.REMOVE_MEMBER_FROM_ORG_FAILED>


export interface ISelectOrgAction {
    type: OrgActionType.SELECT_ORG
    payload: {
        orgID: string
    }
}
export type IOrgAction =
    ICreateOrgAction |
    ICreateOrgSuccessAction |
    ICreateOrgFailedAction |

    IFetchOrgInfoAction |
    IFetchOrgInfoSuccessAction |
    IFetchOrgInfoFailedAction |

    IAddMemberToOrgAction |
    IAddMemberToOrgSuccessAction |
    IAddMemberToOrgFailedAction |

    IRemoveMemberFromOrgAction |
    IRemoveMemberFromOrgSuccessAction |
    IRemoveMemberFromOrgFailedAction |

    ISelectOrgAction

export const createOrg = (payload: ICreateOrgAction['payload']): ICreateOrgAction => ({ type: OrgActionType.CREATE_ORG, payload })
export const fetchOrgInfo = (payload: IFetchOrgInfoAction['payload']): IFetchOrgInfoAction => ({ type: OrgActionType.FETCH_ORG_INFO, payload })
export const addMemberToOrg = (payload: IAddMemberToOrgAction['payload']): IAddMemberToOrgAction => ({ type: OrgActionType.ADD_MEMBER_TO_ORG, payload })
export const removeMemberFromOrg = (payload: IRemoveMemberFromOrgAction['payload']): IRemoveMemberFromOrgAction => ({ type: OrgActionType.REMOVE_MEMBER_FROM_ORG, payload })
export const selectOrg = (payload: ISelectOrgAction['payload']): ISelectOrgAction => ({ type: OrgActionType.SELECT_ORG, payload })