import { URI } from 'conscience-lib/common'

export enum UIActionType {
    CLEAR_PULL_REPO_ERROR = 'CLEAR_PULL_REPO_ERROR',

    CLEAR_CLONE_REPO_ERROR = 'CLEAR_CLONE_REPO_ERROR',
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

export type IUIAction =
    IClearPullRepoErrorAction |

    IClearCloneRepoErrorAction

export const clearPullRepoError = (payload: IClearPullRepoErrorAction['payload']): IClearPullRepoErrorAction => ({ type: UIActionType.CLEAR_PULL_REPO_ERROR, payload })
export const clearCloneRepoError = (payload: IClearCloneRepoErrorAction['payload']): IClearCloneRepoErrorAction => ({ type: UIActionType.CLEAR_CLONE_REPO_ERROR, payload })
