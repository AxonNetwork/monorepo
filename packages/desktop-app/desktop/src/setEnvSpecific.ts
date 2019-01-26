import * as envSpecific from 'conscience-components/env-specific'
import { IRepo, URI, URIType } from 'conscience-lib/common'
import { Store } from 'redux'
import { IGlobalState } from 'conscience-components/redux'
import { getHash, uriToString } from 'conscience-lib/utils'
import path from 'path'
import fs from 'fs'
import axios from 'axios'

export default function setEnvSpecific(store: Store<IGlobalState>) {
    envSpecific.init({

        async getFileContents(uri: URI) {
            const { commit, filename } = uri
            if (!filename) {
                throw new Error('must include filename in uri')
            }
            if (uri.type === URIType.Network) {
                const repoID = uri.repoID
                const API_URL = process.env.API_URL
                let fileURL = ''
                if (commit === undefined || commit === 'working') {
                    fileURL = `${API_URL}/repo/${repoID}/file/HEAD/${filename}`
                } else {
                    fileURL = `${API_URL}/repo/${repoID}/file/${commit}/${filename}`
                }
                const resp = await axios.get<string>(fileURL)
                return resp.data
            } else {
                const repoRoot = uri.repoRoot
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
            }
        },

        directEmbedPrefix(uri: URI) {
            if (uri.type === URIType.Network) {
                const API_URL = process.env.API_URL
                const { repoID, commit } = uri
                if (commit === undefined || commit === 'working') {
                    return `${API_URL}/repo/${repoID}/file/HEAD`
                } else {
                    return `${API_URL}/repo/${repoID}/file/${commit}`
                }
            } else {
                const fileServer = process.env.STATIC_FILE_SERVER_URL
                const { repoRoot, commit } = uri
                if (commit === undefined || commit === 'working') {
                    return `file://${repoRoot}`
                }
                const repoHash = getHash(repoRoot)
                return `${fileServer}/repo/${repoHash}/file/${commit}`
            }
        },

        getRepo(uri: URI, state?: IGlobalState) {
            if (uri.type === URIType.Local) {
                state = state || store.getState()
                const repoID = state.repo.repoIDsByPath[uri.repoRoot]
                const uriStr = uriToString(uri)
                const permissions = state.repo.permissionsByID[repoID] || {}
                return {
                    repoID: state.repo.repoIDsByPath[uri.repoRoot],
                    path: uri.repoRoot,
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
            } else {
                return undefined
            }
        },

        getRepoID(uri: URI, state?: IGlobalState) {
            if (uri.type === URIType.Network) {
                return uri.repoID
            } else {
                state = state || store.getState()
                return state.repo.repoIDsByPath[uri.repoRoot]
            }
        },

        getURIFromParams(params: { repoID?: string, repoHash?: string }, state?: IGlobalState) {
            let uri = undefined as URI | undefined
            if (params.repoHash) {
                state = state || store.getState()
                const repoRoot = state.repo.reposByHash[params.repoHash]
                uri = { type: URIType.Local, repoRoot } as URI
            } else if (params.repoID) {
                uri = { type: URIType.Network, repoID: params.repoID } as URI
            }
            return uri
        }
    })
}
