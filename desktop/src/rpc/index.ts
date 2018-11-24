import path from 'path'
import _Promise from 'bluebird'
import { ILocalRepo, IRef } from '../common'

const appPath = (window as any).require('electron').remote.app.getAppPath()
const protoPath = path.join(appPath, process.env.PROTO_PATH || '')

const protoLoader = (window as any).require('@grpc/proto-loader')
const grpcLibrary = (window as any).require('grpc')
const packageDefinition = protoLoader.loadSync(protoPath, {})
const packageObject = grpcLibrary.loadPackageDefinition(packageDefinition)
const noderpc = packageObject.noderpc

interface IRPCClient {
    setUsernameAsync: (params : { username: string}) => Promise<{ signature: Buffer }>
    getUsernameAsync: (params : {}) => Promise<{ username: string, signature: Buffer }>

    initRepoAsync: (params: { repoID: string, path?: string, name?: string, email?: string }) => Promise<{ path: string }>
    checkpointRepoAsync: (params: { path: string, message?: string }) => Promise<{ ok: boolean }>
    pullRepoAsync: (params: { path: string }) => Promise<{ ok: boolean }>
    cloneRepoAsync: (params: { repoID: string, path?: string, name?: string, email?: string }) => Promise<{ path: string }>
    cloneRepo: (params: { repoID: string, path?: string, name?: string, email?: string }) => any
    getLocalRepos: any
    getLocalReposAsync: (params?: any) => Promise<ILocalRepo[]>
    getRepoFilesAsync: (params: { path: string, repoID?: string }) => Promise< { files: {
        name: string,
        size: Long,
        modified: number,
        stagedStatus: string,
        mergeConflict: boolean,
        mergeUnresolved: boolean,
    }[] } >
    getRepoHistoryAsync: (params: { path: string, repoID: string, page: number }) => Promise<{ commits: {
        commitHash: string
        author: string
        message: string
        timestamp: Long
        files: string[]
        verified?: Long,
    }[] }>
    getLocalRefsAsync: (params: { repoID: string, path: string }) => Promise<{ path: string, refs: IRef[] }>
    getRemoteRefsAsync: (params: { repoID: string, pageSize: number, page: number }) => Promise<{ total: number, refs: IRef[] }>
    getAllRemoteRefsAsync: (repoID: string) => Promise<{[refName: string]: string}>
    isBehindRemoteAsync: (params: { repoID: string, path: string}) => Promise<{ path: string, isBehindRemote: boolean}>
    signMessageAsync: (params: { message: Buffer }) => Promise<{ signature: Buffer }>
    ethAddressAsync: (params: {}) => Promise<{ address: string }>
    setUserPermissionsAsync: (params: { repoID: string, username: string, puller: boolean, pusher: boolean, admin: boolean }) => Promise<{}>
    getMergeConflictsAsync: (params: { path: string }) => Promise<{ path: string, files: string[] }>

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
            return new Promise<ILocalRepo[]>((resolve, reject) => {
                const emitter = client.getLocalRepos(params)
                let repos = [] as ILocalRepo[]
                emitter.on('data', (repo: ILocalRepo) => {
                    repos.push(repo)
                })
                emitter.on('end', () => {
                    resolve(repos)
                })
                emitter.on('error', (err: any) => {
                    reject(err)
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
