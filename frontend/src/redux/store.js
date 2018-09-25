import { createStore, applyMiddleware, compose } from 'redux'
import { createLogicMiddleware } from 'redux-logic'
import logic from './logic.js'
import reducer from './reducer'

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

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
