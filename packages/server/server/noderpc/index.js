import Promise from 'bluebird'

const PROTO_PATH = `${__dirname}/noderpc.proto`

const protoLoader = require('@grpc/proto-loader')
const grpcLibrary = require('grpc')

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {})
const packageObject = grpcLibrary.loadPackageDefinition(packageDefinition)
const noderpc = packageObject.noderpc

let client = null

export function initClient() {
    if (client === null) {
        client = new noderpc.NodeRPC(process.env.NODE_RPC, grpcLibrary.credentials.createInsecure())
        client = Promise.promisifyAll(client, { suffix: 'Async' })

        // We have to manually keep this in sync with the types specified in the Protocol.sol UserType enum
        client.UserType = {
            ADMIN:  0,
            PULLER: 1,
            PUSHER: 2,
        }

        client.EventType = {
            ADDED_REPO:  0,
            PULLED_REPO: 1,
            PUSHED_REPO: 2,
            UPDATED_REF: 3,
        }

        client.getLocalReposAsync = (params) => {
            return new Promise((resolve, reject) => {
                const emitter = client.getLocalRepos(params)
                const repos = []
                emitter.on('data', (repo) => {
                    repos.push(repo)
                })
                emitter.on('end', () => {
                    resolve(repos)
                })
                emitter.on('error', (err) => {
                    reject(err)
                })
            })
        }

        client.getAllUsersOfTypeAsync = async (repoID, type) => {
            let page = 0
            let users = []
            while (true) {
                const result = await client.getRepoUsersAsync({ repoID, type, pageSize: 10, page })
                users = users.concat(result.users)
                if (result.users.length < 10) {
                    break
                }
                page++
            }
            return users
        }

        client.getHistoryUpToCommit = async (params) => {
            const { repoID, path, fromCommitHash, toCommit, pageSize, onlyHashes } = params
            let fromCommitRef = params.fromCommitRef
            let commits = []
            let isEnd = false
            while (true) {
                let resp
                if (fromCommitRef) {
                    resp = await client.getRepoHistoryAsync({ repoID, path, fromCommitRef, pageSize, onlyHashes })
                } else {
                    resp = await client.getRepoHistoryAsync({ repoID, path, fromCommitHash, pageSize, onlyHashes })
                }
                isEnd = resp.isEnd

                if (!resp.commits || resp.commits.length === 0) {
                    break
                }
                if (toCommit) {
                    const headIndex = resp.commits.findIndex(c => c.commitHash === toCommit)
                    if (headIndex > -1) {
                        const slice = resp.commits.slice(0, headIndex)
                        commits = [
                            ...commits,
                            ...slice,
                        ]
                        break
                    }
                }
                commits = [
                    ...commits,
                    ...resp.commits,
                ]
                if (resp.isEnd) {
                    break
                }
                fromCommitRef = `${commits[commits.length - 1].commitHash}^`
            }

            return { commits, isEnd }
        }
    }

    return client
}

// client.hello({ name: 'brynskies' }, (err, asdf) => {
//     console.log('err', err)
//     console.log('asdf', asdf)
// })

// const asdf = client.helloStream({ name: 'brynskies' })

// asdf.on('data', (resp) => {
//     console.log('data ~>', resp)
// })
