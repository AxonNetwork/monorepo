import * as envSpecific from 'conscience-components/env-specific'
import { URI, URIType } from 'conscience-lib/common'
import { Store } from 'redux'
import { IGlobalState } from 'conscience-components/redux'
import axios from 'axios'

export default function setEnvSpecific(store: Store<IGlobalState>) {
    envSpecific.init({

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

        getRepo(uri: URI, state?: IGlobalState) {
            if (uri.type === URIType.Local) {
                throw new Error('web platform cannot getRepo with a local URI')
            }
            state = state || store.getState()
            return state.repo.repos[uri.repoID]
        },

        getRepoID(uri: URI, state?: IGlobalState) {
            if (uri.type === URIType.Local) {
                throw new Error('web platform cannot getRepoID with a local URI')
            }
            return uri.repoID
        }
    })
}
