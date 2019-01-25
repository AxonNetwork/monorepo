import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router'
import { History } from 'history'
import { createStore, applyMiddleware, compose, Store } from 'redux'
import { createLogicMiddleware } from 'redux-logic'
import logic from './logic'
import reducer from './reducer'
import { IGlobalState } from 'conscience-components/redux'

export default (initialState: {} | IGlobalState, history: History): Store<IGlobalState> => {

    // Redux DevTools
    const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

    const logicDeps = {}
    const logicMiddleware = createLogicMiddleware(logic as any, logicDeps as any) // @@TODO: 'logic as any' because TS doesn't seem to like makeContinuousLogic actions

    const enhancer = composeEnhancers(
        applyMiddleware(routerMiddleware(history), logicMiddleware)
    )

    const store = createStore(
        connectRouter(history)(reducer),
        initialState as any,
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

declare module 'conscience-components/redux' {
    export interface IGlobalState {
        router?: RouterState
    }
}
