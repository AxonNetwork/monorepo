import 'dotenv/config'
import path from 'path'
import { ErrorBoundary } from './bugsnag'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import * as React from 'react'
import * as ReactDom from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from './App'
import store from 'redux/store'
import history from 'conscience-components/redux/history'
import { readLocalConfig, checkNodeUser, setAutoUpdateState } from 'redux/user/userActions'
import { AutoUpdateState } from 'redux/user/userReducer'
import { initNodeWatcher } from 'conscience-components/redux/repo/repoActions'
import * as rpc from 'conscience-lib/rpc'
import { isProduction } from 'conscience-lib/utils'
import { initPlugins } from 'conscience-lib/plugins'
import setEnvSpecific from './setEnvSpecific'
import 'typeface-roboto'
import ElectronRelay from './lib/ElectronRelay'

console.log('app version ~>', process.env.APP_VERSION)
console.log('env ~>', process.env)

const appPath = (window as any).require('electron').remote.app.getAppPath()
const protoPath = path.join(appPath, process.env.PROTO_PATH || '')
rpc.initClient(protoPath)

setEnvSpecific(store)
initPlugins()

store.dispatch(readLocalConfig())
// store.dispatch(checkBalanceAndHitFaucet())
store.dispatch(checkNodeUser())
store.dispatch(initNodeWatcher({}))

;(window as any).getState = () => store.getState()

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

if (process.env.NODE_ENV === 'production') {
    store.dispatch(setAutoUpdateState({ state: AutoUpdateState.Checking }))
    ElectronRelay.checkForUpdate({
        updateAvailable:    () => store.dispatch(setAutoUpdateState({ state: AutoUpdateState.Downloading })),
        updateNotAvailable: () => store.dispatch(setAutoUpdateState({ state: AutoUpdateState.NoUpdate })),
        updateDownloaded:   () => store.dispatch(setAutoUpdateState({ state: AutoUpdateState.Downloaded })),
        error:              (err) => store.dispatch(setAutoUpdateState({ state: AutoUpdateState.NoUpdate })),
    })
}

