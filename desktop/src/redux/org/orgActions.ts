import { FailedAction } from '../reduxUtils'
import { IOrganization } from 'common'
import { OrgPage } from './orgReducer'

export enum OrgActionType {
    CREATE_ORG = 'CREATE_ORG',
    CREATE_ORG_SUCCESS = 'CREATE_ORG_SUCCESS',
    CREATE_ORG_FAILED = 'CREATE_ORG_FAILED',

    FETCH_ORG_INFO = 'FETCH_ORG_INFO',
    FETCH_ORG_INFO_SUCCESS = 'FETCH_ORG_INFO_SUCCESS',
    FETCH_ORG_INFO_FAILED = 'FETCH_ORG_INFO_FAILED',

    UPDATE_ORG = 'UPDATE_ORG',
    UPDATE_ORG_SUCCESS = 'UPDATE_ORG_SUCCESS',
    UPDATE_ORG_FAILED = 'UPDATE_ORG_FAILED',

    UPLOAD_ORG_PICTURE = 'UPLOAD_ORG_PICTURE',
    UPLOAD_ORG_PICTURE_SUCCESS = 'UPLOAD_ORG_PICTURE_SUCCESS',
    UPLOAD_ORG_PICTURE_FAILED = 'UPLOAD_ORG_PICTURE_FAILED',

    ADD_MEMBER_TO_ORG = 'ADD_MEMBER_TO_ORG',
    ADD_MEMBER_TO_ORG_SUCCESS = 'ADD_MEMBER_TO_ORG_SUCCESS',
    ADD_MEMBER_TO_ORG_FAILED = 'ADD_MEMBER_TO_ORG_FAILED',

    REMOVE_MEMBER_FROM_ORG = 'REMOVE_MEMBER_FROM_ORG',
    REMOVE_MEMBER_FROM_ORG_SUCCESS = 'REMOVE_MEMBER_FROM_ORG_SUCCESS',
    REMOVE_MEMBER_FROM_ORG_FAILED = 'REMOVE_MEMBER_FROM_ORG_FAILED',

    ADD_REPO_TO_ORG = 'ADD_REPO_TO_ORG',
    ADD_REPO_TO_ORG_SUCCESS = 'ADD_REPO_TO_ORG_SUCCESS',
    ADD_REPO_TO_ORG_FAILED = 'ADD_REPO_TO_ORG_FAILED',

    REMOVE_REPO_FROM_ORG = 'REMOVE_REPO_FROM_ORG',
    REMOVE_REPO_FROM_ORG_SUCCESS = 'REMOVE_REPO_FROM_ORG_SUCCESS',
    REMOVE_REPO_FROM_ORG_FAILED = 'REMOVE_REPO_FROM_ORG_FAILED',

    CHANGE_ORG_DESCRIPTION = 'CHANGE_ORG_DESCRIPTION',
    CHANGE_ORG_DESCRIPTION_SUCCESS = 'CHANGE_ORG_DESCRIPTION_SUCCESS',
    CHANGE_ORG_DESCRIPTION_FAILED = 'CHANGE_ORG_DESCRIPTION_FAILED',

    SELECT_ORG = 'SELECT_ORG',

    NAVIGATE_ORG_PAGE = 'NAVIGATE_ORG_PAGE',
}

export interface ICreateOrgAction {
    type: OrgActionType.CREATE_ORG
    payload: {
        name: string
    }
}

export interface ICreateOrgSuccessAction {
    type: OrgActionType.CREATE_ORG_SUCCESS
    payload: {
        org: IOrganization
    }
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

export interface IUpdateOrgAction {
    type: OrgActionType.UPDATE_ORG
    payload: {
        orgID: string
        name?: string
        description?: string
        readme?: string
    }
}

export interface IUpdateOrgSuccessAction {
    type: OrgActionType.UPDATE_ORG_SUCCESS
    payload: {
        org: IOrganization
    }
}

export type IUpdateOrgFailedAction = FailedAction<OrgActionType.UPDATE_ORG_FAILED>

export interface IUploadOrgPictureAction {
    type: OrgActionType.UPLOAD_ORG_PICTURE
    payload: {
        orgID: string
        fileInput: any
    }
}

export interface IUploadOrgPictureSuccessAction {
    type: OrgActionType.UPLOAD_ORG_PICTURE_SUCCESS
    payload: {
        orgID: string
        picture: string
    }
}

export type IUploadOrgPictureFailedAction = FailedAction<OrgActionType.UPLOAD_ORG_PICTURE_FAILED>

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

export interface IAddRepoToOrgAction {
    type: OrgActionType.ADD_REPO_TO_ORG
    payload: {
        orgID: string
        repoID: string
    }
}

export interface IAddRepoToOrgSuccessAction {
    type: OrgActionType.ADD_REPO_TO_ORG_SUCCESS
    payload: {
        orgID: string
        repoID: string
    }
}

export type IAddRepoToOrgFailedAction = FailedAction<OrgActionType.ADD_REPO_TO_ORG_FAILED>

export interface IRemoveRepoFromOrgAction {
    type: OrgActionType.REMOVE_REPO_FROM_ORG
    payload: {
        orgID: string
        repoID: string
    }
}

export interface IRemoveRepoFromOrgSuccessAction {
    type: OrgActionType.REMOVE_REPO_FROM_ORG_SUCCESS
    payload: {
        orgID: string
        repoID: string
    }
}

export type IRemoveRepoFromOrgFailedAction = FailedAction<OrgActionType.REMOVE_REPO_FROM_ORG_FAILED>


export interface IChangeOrgDescriptionAction {
    type: OrgActionType.CHANGE_ORG_DESCRIPTION
    payload: {
        orgID: string
        description: string
    }
}

export interface IChangeOrgDescriptionSuccessAction {
    type: OrgActionType.CHANGE_ORG_DESCRIPTION_SUCCESS
    payload: {
        orgID: string
        description: string
    }
}

export type IChangeOrgDescriptionFailedAction = FailedAction<OrgActionType.CHANGE_ORG_DESCRIPTION_FAILED>

export interface ISelectOrgAction {
    type: OrgActionType.SELECT_ORG
    payload: {
        orgID: string
    }
}

export interface INavigateOrgPageAction {
    type: OrgActionType.NAVIGATE_ORG_PAGE
    payload: {
        orgPage: OrgPage
    }
}

export type IOrgAction =
    ICreateOrgAction |
    ICreateOrgSuccessAction |
    ICreateOrgFailedAction |

    IFetchOrgInfoAction |
    IFetchOrgInfoSuccessAction |
    IFetchOrgInfoFailedAction |

    IUpdateOrgAction |
    IUpdateOrgSuccessAction |
    IUpdateOrgFailedAction |

    IUploadOrgPictureAction |
    IUploadOrgPictureSuccessAction |
    IUploadOrgPictureFailedAction |

    IAddMemberToOrgAction |
    IAddMemberToOrgSuccessAction |
    IAddMemberToOrgFailedAction |

    IRemoveMemberFromOrgAction |
    IRemoveMemberFromOrgSuccessAction |
    IRemoveMemberFromOrgFailedAction |

    IAddRepoToOrgAction |
    IAddRepoToOrgSuccessAction |
    IAddRepoToOrgFailedAction |

    IRemoveRepoFromOrgAction |
    IRemoveRepoFromOrgSuccessAction |
    IRemoveRepoFromOrgFailedAction |

    IChangeOrgDescriptionAction |
    IChangeOrgDescriptionSuccessAction |
    IChangeOrgDescriptionFailedAction |

    ISelectOrgAction |
    INavigateOrgPageAction

export const createOrg = (payload: ICreateOrgAction['payload']): ICreateOrgAction => ({ type: OrgActionType.CREATE_ORG, payload })
export const fetchOrgInfo = (payload: IFetchOrgInfoAction['payload']): IFetchOrgInfoAction => ({ type: OrgActionType.FETCH_ORG_INFO, payload })
export const updateOrg = (payload: IUpdateOrgAction['payload']): IUpdateOrgAction => ({ type: OrgActionType.UPDATE_ORG, payload })
export const uploadOrgPicture = (payload: IUploadOrgPictureAction['payload']): IUploadOrgPictureAction => ({ type: OrgActionType.UPLOAD_ORG_PICTURE, payload })
export const addMemberToOrg = (payload: IAddMemberToOrgAction['payload']): IAddMemberToOrgAction => ({ type: OrgActionType.ADD_MEMBER_TO_ORG, payload })
export const removeMemberFromOrg = (payload: IRemoveMemberFromOrgAction['payload']): IRemoveMemberFromOrgAction => ({ type: OrgActionType.REMOVE_MEMBER_FROM_ORG, payload })
export const addRepoToOrg = (payload: IAddRepoToOrgAction['payload']): IAddRepoToOrgAction => ({ type: OrgActionType.ADD_REPO_TO_ORG, payload })
export const removeRepoFromOrg = (payload: IRemoveRepoFromOrgAction['payload']): IRemoveRepoFromOrgAction => ({ type: OrgActionType.REMOVE_REPO_FROM_ORG, payload })
export const changeOrgDescription = (payload: IChangeOrgDescriptionAction['payload']): IChangeOrgDescriptionAction => ({ type: OrgActionType.CHANGE_ORG_DESCRIPTION, payload })
export const selectOrg = (payload: ISelectOrgAction['payload']): ISelectOrgAction => ({ type: OrgActionType.SELECT_ORG, payload })
export const navigateOrgPage = (payload: INavigateOrgPageAction['payload']): INavigateOrgPageAction => ({ type: OrgActionType.NAVIGATE_ORG_PAGE, payload })