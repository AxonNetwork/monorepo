import { IUserState } from './user/userReducer'
import { IRepoState } from './repo/repoReducer'
import { IDiscussionState } from './discussion/discussionReducer'
import { IOrgState } from './org/orgReducer'
import { IUIState } from './ui/uiReducer'
import { ISearchState } from './search/searchReducer'

export interface IGlobalState {
    user: IUserState
    repo: IRepoState
    discussion: IDiscussionState
    org: IOrgState
    ui: IUIState
    search: ISearchState
}