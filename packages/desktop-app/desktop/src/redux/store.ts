import { createStore, applyMiddleware, compose } from 'redux'
import { createLogicMiddleware } from 'redux-logic'
import logic from './logic'
import reducer from './reducer'
import { IUserState } from 'conscience-components/redux/user/userReducer'
import { IRepoState } from 'conscience-components/redux/repo/repoReducer'
import { IDiscussionState } from 'conscience-components/redux/discussion/discussionReducer'
import { IOrgState } from 'conscience-components/redux/org/orgReducer'
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
    repo: IRepoState
    discussion: IDiscussionState
    user: IUserState
    editor: IEditorState
    org: IOrgState
    navigation: INavigationState
    ui: IUIState
}