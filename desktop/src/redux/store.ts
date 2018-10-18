import { createStore, applyMiddleware, compose } from 'redux'
import { createLogicMiddleware } from 'redux-logic'
import logic from './logic'
import reducer from './reducer'
import { IRepoState } from './repository/repoReducer'
import { IDiscussionState } from './discussion/discussionReducer'
import { IUserState } from './user/userReducer'
import { IEditorState } from './editor/editorReducer'
import { INavigationState } from './navigation/navigationReducer'
import { IUIState } from './ui/uiReducer'

// Redux DevTools
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const logicDeps = {}
const logicMiddleware = createLogicMiddleware(logic, logicDeps as any)

const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(
      logicMiddleware,
    ),
  ),
)

export default store

export interface IGlobalState {
    repository: IRepoState
    discussion: IDiscussionState
    user: IUserState
    editor: IEditorState
    navigation: INavigationState
    ui: IUIState
}