import _Promise from 'bluebird'
import { ILocalRepo, IRef } from '../common'

// const PROTO_PATH = __dirname + '/noderpc.proto'
// const PROTO_PATH = '/Users/daniel/Projects/conscience/desktop-app-v2/frontend/src/rpc/noderpc.proto'
const PROTO_PATH = process.env.PROTO_PATH //'/Users/bryn/projects/conscience/express-webpack-react-redux-typescript-boilerplate/frontend/src/rpc/noderpc.proto'

const protoLoader = (window as any).require('@grpc/proto-loader')
const grpcLibrary = (window as any).require('grpc')

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {})
const packageObject = grpcLibrary.loadPackageDefinition(packageDefinition)
const noderpc = packageObject.noderpc

interface IRPCClient {
    initRepoAsync: (params: { repoID: string, path?: string }) => Promise<{ path: string }>
    getLocalRepos: any
    getLocalReposAsync: (params?: any) => Promise<ILocalRepo[]>
    getRepoFilesAsync: (params: { path: string, repoID?: string }) => Promise< { files: {
        name: string,
        size: Long,
        modified: number,
        stagedStatus: string,
    }[] } >
    getRepoHistoryAsync: (params: { path: string, repoID: string, page: number }) => Promise<{ commits: {
        commitHash: string
        author: string
        message: string
        timestamp: number,
    }[] }>
    getLocalRefsAsync: (params: { repoID: string, path: string }) => Promise<{ path: string, refs: IRef[] }>
    getRemoteRefsAsync: (params: { repoID: string, pageSize: number, page: number }) => Promise<{ total: number, refs: IRef[] }>
    getAllRemoteRefsAsync: (repoID: string) => Promise<{[refName: string]: string}>
    isBehindRemoteAsync: (params: { repoID: string, path: string}) => Promise<{ path: string, isBehindRemote: boolean}>

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
        client = _Promise.promisifyAll(client, { suffix: 'Async' })

        // We have to manually keep this in sync with the types specified in the Protocol.sol UserType enum
        client.UserType = {
            ADMIN: 0,
            PULLER: 1,
            PUSHER: 2,
        }

        // @@TODO: this invalidates the whole purpose of streaming the response.  redo this later.
        client.getLocalReposAsync = (params: any = {}) => {
            return new Promise<ILocalRepo[]>((resolve) => {
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

        client.getAllRemoteRefsAsync = async (repoID: string): Promise<{[refName: string]: string}> => {
            const REF_PAGE_SIZE = 10
            let page = 0
            let refMap = {} as {[refName: string]: string}

            while (true) {
                const { total, refs } = await client.getRemoteRefsAsync({ repoID, pageSize: REF_PAGE_SIZE, page })
                for (let ref of refs) {
                    refMap[ref.refName] = ref.commitHash
                }

                if (total <= page * REF_PAGE_SIZE) {
                    break
                }
                page++
            }
            return refMap
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
