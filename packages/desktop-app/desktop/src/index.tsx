import 'dotenv/config'
import path from 'path'
import { ErrorBoundary } from './bugsnag'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import * as React from 'react'
import * as ReactDom from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from './App'
import history from './redux/history'
import createStore from './redux/store'
import { readLocalConfig, checkNodeUser, checkBalanceAndHitFaucet } from 'redux/user/userActions'
import * as rpc from 'conscience-lib/rpc'
import { isProduction } from 'utils'
import 'typeface-roboto'

console.log('app version ~>', process.env.APP_VERSION)
console.log('env ~>', process.env)

const appPath = (window as any).require('electron').remote.app.getAppPath()
const protoPath = path.join(appPath, process.env.PROTO_PATH || '')
rpc.initClient(protoPath)


const initialState = {}

const store = createStore(initialState, history)
store.dispatch(readLocalConfig())
store.dispatch(checkBalanceAndHitFaucet())
store.dispatch(checkNodeUser())

// Webpack offline plugin
if (isProduction) {
    OfflinePluginRuntime.install()
}

// Create render function
const render = (Component: any) => {
    ReactDom.render(
        <AppContainer>
            <ErrorBoundary>
                <Component store={store} history={history} />
            </ErrorBoundary>
        </AppContainer>,
        document.getElementById('root'),
    )
}

// First time render
render(App)

// Hot Reload Module API
if (module.hot) {
    module.hot.accept('./App', () => {
        const NextApp = require('App').default
        render(NextApp)
    })
}
