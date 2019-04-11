import { URI } from 'conscience-lib/common'

export enum UIActionType {
    CLEAR_INIT_REPO_ERROR = 'CLEAR_INIT_REPO_ERROR',
    CLEAR_PULL_REPO_ERROR = 'CLEAR_PULL_REPO_ERROR',
    CLEAR_CLONE_REPO_ERROR = 'CLEAR_CLONE_REPO_ERROR',
    CLEAR_CHECKPOINT_REPO_ERROR = 'CLEAR_CHECKPOINT_REPO_ERROR',
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

export type IUIAction =
    IClearInitRepoErrorAction |
    IClearPullRepoErrorAction |
    IClearCloneRepoErrorAction |
    IClearCheckpointRepoErrorAction

export const clearInitRepoError = (payload: IClearInitRepoErrorAction['payload']): IClearInitRepoErrorAction => ({ type: UIActionType.CLEAR_INIT_REPO_ERROR, payload })
export const clearPullRepoError = (payload: IClearPullRepoErrorAction['payload']): IClearPullRepoErrorAction => ({ type: UIActionType.CLEAR_PULL_REPO_ERROR, payload })
export const clearCloneRepoError = (payload: IClearCloneRepoErrorAction['payload']): IClearCloneRepoErrorAction => ({ type: UIActionType.CLEAR_CLONE_REPO_ERROR, payload })
export const clearCheckpointRepoError = (payload: IClearCheckpointRepoErrorAction['payload']): IClearCheckpointRepoErrorAction => ({ type: UIActionType.CLEAR_CHECKPOINT_REPO_ERROR, payload })