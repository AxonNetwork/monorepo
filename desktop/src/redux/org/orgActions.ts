import { FailedAction } from '../reduxUtils'
import { IOrganization } from 'common'

export enum OrgActionType {
    CREATE_ORG = 'CREATE_ORG',
    CREATE_ORG_SUCCESS = 'CREATE_ORG_SUCCESS',
    CREATE_ORG_FAILED = 'CREATE_ORG_FAILED',

    FETCH_ORG_INFO = 'FETCH_ORG_INFO',
    FETCH_ORG_INFO_SUCCESS = 'FETCH_ORG_INFO_SUCCESS',
    FETCH_ORG_INFO_FAILED = 'FETCH_ORG_INFO_FAILED',
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


export type IOrgAction =
    ICreateOrgAction |
    ICreateOrgSuccessAction |
    ICreateOrgFailedAction |

    IFetchOrgInfoAction |
    IFetchOrgInfoSuccessAction |
    IFetchOrgInfoFailedAction

export const createOrg = (payload: ICreateOrgAction['payload']): ICreateOrgAction => ({ type: OrgActionType.CREATE_ORG, payload })
export const fetchOrgInfo = (payload: IFetchOrgInfoAction['payload']): IFetchOrgInfoAction => ({ type: OrgActionType.FETCH_ORG_INFO, payload })