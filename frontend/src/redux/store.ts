import { createStore, applyMiddleware, compose } from 'redux'
import { createLogicMiddleware } from 'redux-logic'
import logic from './logic'
import reducer from './reducer'
import { IRepoState } from './repository/repoReducer'
import { INavigationState } from './navigation/navigationReducer'
import { IDiscussionState } from './discussion/discussionReducer'
import { IUserState } from './user/userReducer'

// Redux DevTools
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const logicDeps = {}
const logicMiddleware = createLogicMiddleware(logic, logicDeps)

const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(
      logicMiddleware
    )
  )
)

export default store


export interface IGlobalState {
    repository: IRepoState
    navigation: INavigationState
    discussion: IDiscussionState
    user: IUserState
}