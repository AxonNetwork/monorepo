const _Promise = require('bluebird')
const protoLoader = typeof window !== 'undefined' ? window.require('@grpc/proto-loader') : require('@grpc/proto-loader')
const grpcLibrary = typeof window !== 'undefined' ? window.require('grpc') : require('grpc')

let client

function getClient() {
    return client
}

function initClient(protoPath) {
    console.log('rpc proto path:', protoPath)
    const packageDefinition = protoLoader.loadSync(protoPath, {})
    const packageObject = grpcLibrary.loadPackageDefinition(packageDefinition)
    const noderpc = packageObject.noderpc

    client = new noderpc.NodeRPC(process.env.NODE_RPC, grpcLibrary.credentials.createInsecure())
    client = _Promise.promisifyAll(client, { suffix: 'Async' })

    // We have to manually keep this in sync with the types specified in the Protocol.sol UserType enum
    client.UserType = {
        ADMIN:  0,
        PULLER: 1,
        PUSHER: 2,
    }

    client.EventType = {
        ADDED_REPO:  1,
        PULLED_REPO: 2,
        PUSHED_REPO: 4,
        UPDATED_REF: 8,
    }

    // @@TODO: this invalidates the whole purpose of streaming the response.  redo this later.
    client.getLocalReposAsync = (params) => {
        return new Promise((resolve, reject) => {
            const emitter = client.getLocalRepos(params)
            const repos = []
            emitter.on('data', (repo) => { repos.push(repo) })
            emitter.on('end', () => { resolve(repos) })
            emitter.on('error', (err) => { reject(err) })
        })
    }

    client.getAllRemoteRefsAsync = async (repoID) => {
        const REF_PAGE_SIZE = 10
        let page = 0
        const refMap = {}

        while (true) {
            const { total = 0, refs = {} } = await client.getRemoteRefsAsync({ repoID, pageSize: REF_PAGE_SIZE, page })
            if (Object.keys(refs).length === 0) {
                break
            }
            for (const ref of refs) {
                refMap[ref.refName] = ref.commitHash
            }

            if (total.toNumber() <= (page + 1) * REF_PAGE_SIZE) {
                break
            }
            page++
        }
        return refMap
    }

    client.getAllUsersOfTypeAsync = async (params) => {
        let page = 0
        let users = []
        const { repoID, type } = params
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

    client.getDiffAsync = async (params) => {
        return new Promise((resolve, reject) => {
            const stream = client.getDiff(params)
            let diffBlob
            stream.on('data', (pkt) => {
                if (pkt.end) { return resolve(diffBlob) }
                diffBlob += pkt.data
            })
            stream.on('error', reject)
        })
    }

    client.getObjectAsync = async (params) => {
        return new Promise((resolve, reject) => {
            const stream = client.getObject(params)
            let gotHeader = false
            let totalSize = 0
            const buffers = []

            stream.on('data', (pkt) => {
                if (!gotHeader && pkt.header) {
                    totalSize = pkt.header.uncompressedSize
                    gotHeader = true
                } else if (pkt.data.end) {
                    const contents = Buffer.concat(buffers, totalSize)
                    resolve(contents)
                } else {
                    buffers.push(pkt.data.data)
                }
            })

            stream.on('error', (err) => {
                reject(err)
            })
        })
    }
}

module.exports = {
    initClient,
    getClient,
}
