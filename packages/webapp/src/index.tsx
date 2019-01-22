import axios from 'axios'
import OfflinePluginRuntime from 'offline-plugin/runtime'
import React from 'react'
import ReactDom from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from 'App'
import history from 'redux/history'
import createStore from 'redux/store'
import { whoami } from 'conscience-components/redux/user/userActions'
import { isProduction } from 'utils'

import 'typeface-roboto'

import * as envSpecific from 'conscience-components/env-specific'
import { History } from 'history'
import { FileMode, URI, URIType } from 'conscience-lib/common'
import { getHash } from 'conscience-lib/utils'

// Webpack offline plugin
if (isProduction) {
    OfflinePluginRuntime.install()
}

// To keep reducers self-sufficient and reusable, we choose to not set
// initial state here, and let each reducer to handle the default state
// https://github.com/reactjs/redux/issues/1189#issuecomment-168025590
const initialState = {}

// Create browser history
// Configure store
const store = createStore(initialState, history)
store.dispatch(whoami({}))

envSpecific.init({
    selectFile(history: History, uri: URI, mode: FileMode) {
        if (uri.type === URIType.Local) {
            throw new Error('web platform does not support URIType.Local')
        }

        const { repoID, commit, filename } = uri
        if (filename === undefined) {
            history.push(`/repo/${repoID}/files/${commit}`)
        } else if (mode === FileMode.View) {
            history.push(`/repo/${repoID}/files/${commit}/${filename}`)
        } else if (mode === FileMode.Edit) {
            history.push(`/repo/${repoID}/edit/${commit}/${filename}`)
        } else {
            throw new Error(`unknown FileMode: ${mode}`)
        }
    },
    selectDiscussion(history: History, uri: URI, discussionID: string) {
        if (uri.type === URIType.Network) {
            history.push(`/repo/${uri.repoID}/discussion/${discussionID}`)
        } else {
            history.push(`/repo/${getHash(uri.repoRoot)}/discussion/${discussionID}`)
        }
    },
    async getFileContents(uri: URI) {
        if (uri.type === URIType.Local) {
            throw new Error('web platform cannot getFileContents with a local URI')
        }
        const API_URL = process.env.API_URL
        const { repoID, commit, filename } = uri
        const fileURL = `${API_URL}/repo/${repoID}/file/${commit}/${filename}`
        const resp = await axios.get<string>(fileURL)
        return resp.data
    },
    directEmbedPrefix(uri: URI) {
        if (uri.type === URIType.Local) {
            throw new Error('web platform cannot directEmbedPrefix with a local URI')
        }
        const API_URL = process.env.API_URL
        const { repoID, commit } = uri
        return `${API_URL}/repo/${repoID}/file/${commit}`
    },
    getRepo(uri: URI) {
        if (uri.type === URIType.Local) {
            throw new Error('web platform cannot getRepo with a local URI')
        }
        const state = store.getState()
        return state.repo.repos[uri.repoID]
    },
})

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
