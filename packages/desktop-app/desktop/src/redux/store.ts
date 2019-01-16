import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router'
import { History } from 'history'
import { createStore, applyMiddleware, compose, Store } from 'redux'
import { createLogicMiddleware } from 'redux-logic'
import logic from './logic'
import reducer from './reducer'
import { IRepoState } from './repository/repoReducer'
import { IDiscussionState } from './discussion/discussionReducer'
import { IUserState } from './user/userReducer'
import { IEditorState } from './editor/editorReducer'
import { IOrgState } from './org/orgReducer'
import { INavigationState } from './navigation/navigationReducer'
import { IUIState } from './ui/uiReducer'

export default (initialState: {} | IGlobalState, history: History): Store<IGlobalState> => {

    // Redux DevTools
    const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

    const logicDeps = {}
    const logicMiddleware = createLogicMiddleware(logic, logicDeps as any)

    const enhancer = composeEnhancers(
        applyMiddleware(routerMiddleware(history), logicMiddleware)
    )

    const store = createStore(
        connectRouter(history)(reducer),
        initialState,
        enhancer
    )

    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
        module.hot.accept('./reducer', () => {
            const nextReducers = require('./reducer').default
            store.replaceReducer(connectRouter(history)(nextReducers))
        })
    }

    return store
}

export interface IGlobalState {
    repository: IRepoState
    discussion: IDiscussionState
    user: IUserState
    editor: IEditorState
    org: IOrgState
    navigation: INavigationState
    ui: IUIState
    rotuer?: RouterState
}