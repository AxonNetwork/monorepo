import * as envSpecific from 'conscience-components/env-specific'
import { IRepo, URI, URIType } from 'conscience-lib/common'
import { uriToString } from 'conscience-lib/utils'
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
            const repoID = uri.repoID
            const uriStr = uriToString(uri)
            const permissions = state.repo.permissionsByID[repoID] || {}
            return {
                repoID,
                admins: permissions.admins,
                pullers: permissions.pullers,
                pushers: permissions.pushers,
                isPublic: false,
                files: state.repo.filesByURI[uriStr],
                localRefs: state.repo.localRefsByURI[uriStr],
                remoteRefs: state.repo.remoteRefsByID[repoID],
                commits: state.repo.commits,
                commitList: state.repo.commitListsByURI[uriStr],
                behindRemote: false,
            } as IRepo
        },

        getRepoID(uri: URI, state?: IGlobalState) {
            if (uri.type === URIType.Local) {
                throw new Error('web platform cannot getRepoID with a local URI')
            }
            return uri.repoID
        },

        getURIFromParams(params: { repoID?: string }, state?: IGlobalState) {
            if (!params.repoID) {
                throw new Error('need repoID for URI')
            }
            return { type: URIType.Network, repoID: params.repoID } as URI
        }
    })
}
