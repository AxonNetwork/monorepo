import fs from 'fs'
import path from 'path'
import * as envSpecific from 'conscience-components/env-specific'
import { IRepo, URI, URIType } from 'conscience-lib/common'
import { Store } from 'redux'
import { IGlobalState } from 'conscience-components/redux'
import { getHash, uriToString } from 'conscience-lib/utils'
import * as rpc from 'conscience-lib/rpc'
import axios from 'axios'

export default function setEnvSpecific(store: Store<IGlobalState>) {
    envSpecific.init({

        async getFileContents(uri: URI, opts?: envSpecific.IGetFileContentsOptions) {
            const { commit, filename } = uri
            if (!filename) {
                throw new Error('must include filename in uri')
            }

            if (uri.type === URIType.Network) {
                const repoID = uri.repoID
                const API_URL = process.env.API_URL
                let fileURL = ''
                if (commit === undefined) {
                    fileURL = `${API_URL}/repo/${repoID}/file/working/${filename}`
                } else {
                    fileURL = `${API_URL}/repo/${repoID}/file/${commit}/${filename}`
                }
                const resp = await axios.get<string>(fileURL)
                return resp.data

            } else {
                const { repoRoot, commit, filename } = uri

                let stream
                if (commit && commit.length === 40) {
                    const commitHash = Buffer.from(commit!, 'hex')
                    if (commitHash.length === 20) {
                        stream = rpc.getClient().getObject({ repoRoot, commitHash, filename, maxSize: 999999999999999 })
                    }
                }
                if (!stream) {
                    const commitRef = commit || 'working'
                    stream = rpc.getClient().getObject({ repoRoot, commitRef, filename, maxSize: 999999999999999 })
                }

                return new Promise((resolve, reject) => {
                    let gotHeader = false
                    let totalSize = 0
                    let buffers = [] as Buffer[]

                    stream.on('data', pkt => {
                        if (!gotHeader && pkt.header) {
                            totalSize = pkt.header.uncompressedSize
                            gotHeader = true
                        } else if (pkt.data.end) {
                            const contents = Buffer.concat(buffers, totalSize)
                            if (opts && opts.as === 'buffer') {
                                resolve(contents)
                            } else {
                                resolve(contents.toString('utf8'))
                            }
                        } else {
                            buffers.push(pkt.data.data)
                        }
                    })

                    stream.on('error', err => {
                        console.error(`rpc.GetObject( ${repoRoot}, ${commit}, ${filename} ): ${err.toString()}`)
                        reject(err)
                    })
                })
            }
        },

        async saveFileContents(uri: URI, fileContents: string) {
            if (uri.type === URIType.Network) {
                throw new Error(`cannot saveFileContents on a URIType.Network: ${uri.type} : ${uri.repoID} : ${uri.commit} : ${uri.filename}`)
            } else if (!uri.filename) {
                throw new Error(`cannot saveFileContents for a URI with no filename: ${uri.type} : ${uri.repoRoot} : ${uri.commit} : ${uri.filename}`)
            }

            return new Promise<void>((resolve, reject) => {
                // const { repoRoot = '', filename = '' } = uri
                fs.writeFile(path.join(uri.repoRoot, uri.filename!), fileContents, 'utf8', (err?: Error) => {
                    if (err) {
                        reject(err)
                    }
                    resolve()
                })
            })
        },

        directEmbedPrefix(uri: URI) {
            if (uri.type === URIType.Network) {
                const API_URL = process.env.API_URL
                const { repoID, commit } = uri
                if (commit === undefined) {
                    return `${API_URL}/repo/${repoID}/file/working`
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
            if (params.repoHash) {
                state = state || store.getState()
                const repoRoot = state.repo.reposByHash[params.repoHash]
                if (!repoRoot) {
                    return undefined
                } else {
                    return { type: URIType.Local, repoRoot } as URI
                }
            } else if (params.repoID) {
                return { type: URIType.Network, repoID: params.repoID } as URI
            }
            return undefined
        },

        isDesktop() {
            return true
        }
    })
}
