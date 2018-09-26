import { createBrowserHistory } from 'history'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import * as React from 'react'
import * as ReactDom from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from './orig/components/App'
import store from './orig/redux/store'
import { isProduction } from 'utils'

// Webpack offline plugin
if (isProduction) {
  OfflinePluginRuntime.install()
}

// Create browser history
const history = createBrowserHistory()

// Create render function
const render = (Component: any) => {
  ReactDom.render(
    <AppContainer>
      <Component store={store} history={history} />
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