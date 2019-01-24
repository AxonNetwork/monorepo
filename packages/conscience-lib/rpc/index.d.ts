import { ILocalRepo, IRef } from '../common'

declare module 'conscience-lib/rpc' {
    export interface IRPCClient {
        setUsernameAsync: (params: { username: string }) => Promise<{ signature: Buffer }>
        getUsernameAsync: (params: {}) => Promise<{ username: string, signature: Buffer }>

        initRepoAsync: (params: { repoID: string, path?: string, name?: string, email?: string }) => Promise<{ path: string }>
        checkpointRepoAsync: (params: { path: string, message?: string }) => Promise<{ ok: boolean }>
        pullRepo: (params: { path: string }) => any // emitter for progress stream
        cloneRepo: (params: { repoID: string, path?: string, name?: string, email?: string }) => any // emitter for progress stream
        getLocalRepos: any
        getLocalReposAsync: (params?: any) => Promise<ILocalRepo[]>
        getRepoFilesAsync: (params: { path: string, repoID?: string }) => Promise<{ files: IRPCFile[] }>
        getRepoHistoryAsync: (params: { path: string, repoID: string, page: number }) => Promise<{ commits: IRPCCommit[] }>
        getLocalRefsAsync: (params: { repoID: string, path: string }) => Promise<{ path: string, refs?: IRef[] }>
        getRemoteRefsAsync: (params: { repoID: string, pageSize: number, page: number }) => Promise<{ total: Long, refs: IRef[] }>
        getAllRemoteRefsAsync: (repoID: string) => Promise<{ [refName: string]: string }>
        isBehindRemoteAsync: (params: { repoID: string, path: string }) => Promise<{ path: string, isBehindRemote: boolean }>
        signMessageAsync: (params: { message: Buffer }) => Promise<{ signature: Buffer }>
        ethAddressAsync: (params: {}) => Promise<{ address: string }>

        setUserPermissionsAsync: (params: { repoID: string, username: string, puller: boolean, pusher: boolean, admin: boolean }) => Promise<{}>
        getRepoUsersAsync: (params: { repoID: string, type: (0 | 1 | 2), pageSize: number, page: number }) => Promise<string[]>
        getAllUsersOfTypeAsync: (params: { repoID: string, type: (0 | 1 | 2) }) => Promise<string[]>

        getMergeConflictsAsync: (params: { path: string }) => Promise<{ path: string, files: string[] }>

        // @@TODO: convert to enum
        UserType: {
            ADMIN: 0,
            PULLER: 1,
            PUSHER: 2,
        }
    }

    export interface IRPCFile {
        name: string,
        size: Long,
        modified: number,
        stagedStatus: string,
        mergeConflict: boolean,
        mergeUnresolved: boolean,
    }

    export interface IRPCCommit {
        commitHash: string
        author: string
        message: string
        timestamp: Long
        files: string[]
        verified?: Long,
    }

    export function getClient(): IRPCClient;

    export function initClient(protoPath: string): void;
}
