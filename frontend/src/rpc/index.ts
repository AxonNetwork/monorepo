import Promise from 'bluebird'
import { IRepo, ILocalRepo } from '../common'

const PROTO_PATH = __dirname + '/noderpc.proto'

const protoLoader = window.require('@grpc/proto-loader')
const grpcLibrary = window.require('grpc')

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {})
const packageObject = grpcLibrary.loadPackageDefinition(packageDefinition)
const noderpc = packageObject.noderpc

interface IRPCClient {
    initRepoAsync: (params: { repoID: string, path?: string }) => Promise<{ path: string }>
    getLocalRepos: any
    getLocalReposAsync: (params?: any) => Promise<ILocalRepo[]>
    getRepoFilesAsync: (params: { path: string, repoID?: string }) => Promise<{ repo: IRepo }>

    // @@TODO: convert to enum
    UserType: {
        ADMIN: 0,
        PULLER: 1,
        PUSHER: 2,
    }
}

var client: IRPCClient

export function initClient() {
    if (client === undefined) {
        client = new noderpc.NodeRPC(process.env.NODE_RPC, grpcLibrary.credentials.createInsecure())
        client = Promise.promisifyAll(client, { suffix: 'Async' })

        // We have to manually keep this in sync with the types specified in the Protocol.sol UserType enum
        client.UserType = {
            ADMIN: 0,
            PULLER: 1,
            PUSHER: 2,
        }

        // @@TODO: this invalidates the whole purpose of streaming the response.  redo this later.
        client.getLocalReposAsync = (params: any = {}) => {
            return new Promise<ILocalRepo[]>((resolve, reject) => {
                const emitter = client.getLocalRepos(params)
                let repos = [] as ILocalRepo[]
                emitter.on('data', (repo: ILocalRepo) => {
                    repos.push(repo)
                })
                emitter.on('end', () => {
                    resolve(repos)
                })
            })
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
