import { IUserState } from './user/userReducer'
import { IRepoState } from './repo/repoReducer'
import { IDiscussionState } from './discussion/discussionReducer'
import { IOrgState } from './org/orgReducer'
import { IUIState } from './ui/uiReducer'

export interface IGlobalState {
    user: IUserState
    repo: IRepoState
    discussion: IDiscussionState
    org: IOrgState
    ui: IUIState
}