import { URI } from 'conscience-lib/common'

export enum UIActionType {
    CLEAR_INIT_REPO_ERROR = 'CLEAR_INIT_REPO_ERROR',
    CLEAR_PULL_REPO_ERROR = 'CLEAR_PULL_REPO_ERROR',
    CLEAR_CLONE_REPO_ERROR = 'CLEAR_CLONE_REPO_ERROR',
    CLEAR_CHECKPOINT_REPO_ERROR = 'CLEAR_CHECKPOINT_REPO_ERROR',
    SHOW_FILE_DETAILS_SIDEBAR = 'SHOW_FILE_DETAILS_SIDEBAR',
    SET_FILE_DETAILS_SIDEBAR_URI = 'SET_FILE_DETAILS_SIDEBAR_URI',
}

export interface IClearInitRepoErrorAction {
    type: UIActionType.CLEAR_INIT_REPO_ERROR
    payload: {}
}

export interface IClearPullRepoErrorAction {
    type: UIActionType.CLEAR_PULL_REPO_ERROR
    payload: {
        uri: URI
    }
}

export interface IClearCloneRepoErrorAction {
    type: UIActionType.CLEAR_CLONE_REPO_ERROR
    payload: {
        repoID: string
    }
}

export interface IClearCheckpointRepoErrorAction {
    type: UIActionType.CLEAR_CHECKPOINT_REPO_ERROR
    payload: {}
}

export interface IShowFileDetailsSidebarAction {
    type: UIActionType.SHOW_FILE_DETAILS_SIDEBAR
    payload: {
        open: boolean
    }
}

export interface ISetFileDetailsSidebarURIAction {
    type: UIActionType.SET_FILE_DETAILS_SIDEBAR_URI
    payload: {
        uri: URI
    }
}

export type IUIAction =
    IClearInitRepoErrorAction |
    IClearPullRepoErrorAction |
    IClearCloneRepoErrorAction |
    IClearCheckpointRepoErrorAction |
    IShowFileDetailsSidebarAction |
    ISetFileDetailsSidebarURIAction

export const clearInitRepoError = (payload: IClearInitRepoErrorAction['payload']): IClearInitRepoErrorAction => ({ type: UIActionType.CLEAR_INIT_REPO_ERROR, payload })
export const clearPullRepoError = (payload: IClearPullRepoErrorAction['payload']): IClearPullRepoErrorAction => ({ type: UIActionType.CLEAR_PULL_REPO_ERROR, payload })
export const clearCloneRepoError = (payload: IClearCloneRepoErrorAction['payload']): IClearCloneRepoErrorAction => ({ type: UIActionType.CLEAR_CLONE_REPO_ERROR, payload })
export const clearCheckpointRepoError = (payload: IClearCheckpointRepoErrorAction['payload']): IClearCheckpointRepoErrorAction => ({ type: UIActionType.CLEAR_CHECKPOINT_REPO_ERROR, payload })
export const showFileDetailsSidebar = (payload: IShowFileDetailsSidebarAction['payload']): IShowFileDetailsSidebarAction => ({ type: UIActionType.SHOW_FILE_DETAILS_SIDEBAR, payload })
export const setFileDetailsSidebarURI = (payload: ISetFileDetailsSidebarURIAction['payload']): ISetFileDetailsSidebarURIAction => ({ type: UIActionType.SET_FILE_DETAILS_SIDEBAR_URI, payload })
