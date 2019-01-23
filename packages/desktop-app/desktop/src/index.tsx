import 'dotenv/config'
import path from 'path'
import { ErrorBoundary } from './bugsnag'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import * as React from 'react'
import * as ReactDom from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from './App'
import history from 'conscience-components/redux/history'
import createStore from 'redux/store'
import { readLocalConfig, checkNodeUser, checkBalanceAndHitFaucet } from 'redux/user/userActions'
import * as rpc from 'conscience-lib/rpc'
import { isProduction } from 'conscience-lib/utils'

import 'typeface-roboto'

import * as envSpecific from 'conscience-components/env-specific'
import { URI, URIType } from 'conscience-lib/common'
import { IGlobalState } from 'conscience-components/redux'
import { getHash } from 'conscience-lib/utils'
import fs from 'fs'
import axios from 'axios'

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

envSpecific.init({
    async getFileContents(uri: URI) {
        if (uri.type === URIType.Network) {
            throw new Error('desktop platform cannot getFileContents with a network URI')
        }
        const { repoRoot, commit, filename } = uri
        if (!filename) {
            throw new Error('must include filename in uri')
        }
        if (commit === undefined || commit === 'working') {
            return new Promise<string>((resolve, reject) => {
                fs.readFile(path.join(repoRoot, filename), 'utf8', (err: Error, contents: string) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(contents)
                })
            })
        } else {
            const repoHash = getHash(repoRoot)
            const fileServer = process.env.STATIC_FILE_SERVER_URL
            const fileURL = `${fileServer}/repo/${repoHash}/file/${commit}/${filename}`
            const resp = await axios.get<string>(fileURL)
            return resp.data
        }
    },
    directEmbedPrefix(uri: URI) {
        if (uri.type === URIType.Network) {
            throw new Error('desktop platform cannot directEmbedPrefix with a network URI')
        }
        const fileServer = process.env.STATIC_FILE_SERVER_URL
        const { repoRoot, commit } = uri
        if (commit === undefined || commit === 'working') {
            return `file://${repoRoot}`
        }
        const repoHash = getHash(repoRoot)
        return `${fileServer}/repo/${repoHash}/file/${commit}`
    },
    getRepo(uri: URI, state?: IGlobalState) {
        state = state || store.getState()
        if (uri.type === URIType.Local) {
            const repoID = state.repo.reposByHash[getHash(uri.repoRoot)]
            return state.repo.repos[repoID]
        } else {
            return state.repo.repos[uri.repoID]
        }
    },
})

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
