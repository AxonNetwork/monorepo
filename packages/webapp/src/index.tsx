import OfflinePluginRuntime from 'offline-plugin/runtime'
import React from 'react'
import ReactDom from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { ErrorBoundary } from './bugsnag'

import App from 'App'
import store from 'redux/store'
import history from 'conscience-components/redux/history'
import { whoami } from 'conscience-components/redux/user/userActions'
import { isProduction } from 'utils'
import { initPlugins } from 'conscience-lib/plugins'
import setEnvSpecific from 'setEnvSpecific'

import 'typeface-roboto'


// Webpack offline plugin
if (isProduction) {
    OfflinePluginRuntime.install()
}

setEnvSpecific(store)
initPlugins()

store.dispatch(whoami({}))

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
