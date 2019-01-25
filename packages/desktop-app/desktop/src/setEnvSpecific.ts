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
                // const repoID = state.repo.reposByHash[getHash(uri.repoRoot)]
                // return state.repo.repos[repoID]
            } else {
                return state.repo.repos[uri.repoID]
            }
        },

        getRepoID(uri: URI, state?: IGlobalState) {
            if (uri.type === URIType.Network) {
                return uri.repoID
            } else {
                state = state || store.getState()
                return state.repo.repoIDsByPath[uri.repoRoot]
            }
        }
    })
}
