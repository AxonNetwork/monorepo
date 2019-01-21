const _Promise = require('bluebird')
const protoLoader = typeof window !== 'undefined' ? window.require('@grpc/proto-loader') : require('@grpc/proto-loader')
const grpcLibrary = typeof window !== 'undefined' ? window.require('grpc') : require('grpc')


export var client

export function initClient(protoPath) {
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
            const { total, refs } = await client.getRemoteRefsAsync({ repoID, pageSize: REF_PAGE_SIZE, page })
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
}
