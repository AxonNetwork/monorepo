import { ILocalRepo, IRef } from '../common'
import events from 'events'

declare module 'conscience-lib/rpc' {
    export interface IRPCClient {
        setUsernameAsync: (params: { username: string }) => Promise<{ signature: Buffer }>
        getUsernameAsync: (params: {}) => Promise<{ username: string, signature: Buffer }>
        getEthereumBIP39SeedAsync: (params: {}) => Promise<{ seed: string }>
        setEthereumBIP39SeedAsync: (params: { seed: string }) => Promise<void>

        initRepoAsync: (params: { repoID: string, path?: string, name?: string, email?: string }) => Promise<{ path: string }>
        checkpointRepo: any
        checkpointRepoAsync: (params: { path: string, message?: string }) => Promise<{ ok: boolean }>
        pullRepo: (params: { path: string }) => any // emitter for progress stream
        cloneRepo: (params: { repoID: string, path?: string, name?: string, email?: string }) => any // emitter for progress stream

        getLocalRepos: any
        getLocalReposAsync: (params?: any) => Promise<ILocalRepo[]>

        getRepoFilesAsync: (params:
            ({ repoRoot: string } | { repoID: string }) &
            ({ commitHash: Buffer } | { commitRef: string })
        ) => Promise<{ files: IRPCFile[] }>

        getDiff: (params:
            ({ repoRoot: string } | { repoID: string }) &
            ({ commitHash: Buffer } | { commitRef: string })
        ) => any

        getDiffAsync: (params:
            ({ repoRoot: string } | { repoID: string }) &
            ({ commitHash: Buffer } | { commitRef: string })
        ) => Promise<string>

        getRepoHistoryAsync: (params:
            { repoID: string } | { path: string } &
            { fromCommitHash: Buffer } | { fromCommitRef: string, } | {} & //nothing fetches head of master
            { pageSize: number, onlyHashes?: boolean }
        ) => Promise<{ commits: IRPCCommit[], isEnd: boolean }>

        getHistoryUpToCommit: (params:
            { repoID: string } | { path: string } &
            { fromCommitHash: Buffer } | { fromCommitRef: string, } | {} & //nothing fetches head of master
            { toCommit: string | undefined, pageSize: number, onlyHashes?: boolean }
        ) => Promise<{ commits: IRPCCommit[], isEnd: boolean }>

        getUpdatedRefEventsAsync: (params: { repoID: string, startBlock?: number, endBlock?: number }) => Promise<{ events: IRPCUpdatedRefEvent[] }>

        trackLocalRepoAsync: (params: { repoPath: string, forceReload: boolean }) => Promise<{}>

        getLocalRefsAsync: (params: { repoID: string, path: string }) => Promise<{ path: string, refs?: IRef[] }>
        getRemoteRefsAsync: (params: { repoID: string, pageSize: number, page: number }) => Promise<{ total: Long, refs: IRef[] }>
        getAllRemoteRefsAsync: (repoID: string) => Promise<{ [refName: string]: string }>
        isBehindRemoteAsync: (params: { repoID: string, path: string }) => Promise<{ path: string, isBehindRemote: boolean }>
        signMessageAsync: (params: { message: Buffer }) => Promise<{ signature: Buffer }>
        ethAddressAsync: (params: {}) => Promise<{ address: string }>

        setRepoPublicAsync: (params: { repoID: string, isPublic: boolean }) => Promise<{ repoID: string, isPublic: boolean }>
        isRepoPublicAsync: (params: { repoID: string }) => Promise<{ repoID: string, isPublic: boolean }>
        setUserPermissionsAsync: (params: { repoID: string, username: string, puller: boolean, pusher: boolean, admin: boolean }) => Promise<{}>
        getRepoUsersAsync: (params: { repoID: string, type: (0 | 1 | 2), pageSize: number, page: number }) => Promise<string[]>
        getAllUsersOfTypeAsync: (params: { repoID: string, type: (0 | 1 | 2) }) => Promise<string[]>

        getMergeConflictsAsync: (params: { path: string }) => Promise<{ path: string, files: string[] }>

        getObject: (params: { repoID?: string, repoRoot?: string, filename?: string, commitHash?: Buffer, commitRef?: string, maxSize?: number }) => ReadableStream
        getObjectAsync: (params: { repoID?: string, repoRoot?: string, filename?: string, commitHash?: Buffer, commitRef?: string, maxSize?: number }) => Buffer

        setFileChunkingAsync: (params:
            { repoID: string } | { repoRoot: string } &
            { filename: string, enabled: boolean }
        ) => Promise<{}>

        watch: (parms: { eventTypes: (1 | 2 | 4 | 8)[] }) => events.EventEmitter


        // @@TODO: convert to enum
        UserType: {
            ADMIN: 0,
            PULLER: 1,
            PUSHER: 2,
        }

        EventType: {
            ADDED_REPO: 1,
            PULLED_REPO: 2,
            PUSHED_REPO: 4,
            UPDATED_REF: 8,
        }

    }

    export type DiffPacket = { data: string, end: undefined } | { data: undefined, end: boolean }

    type ObjectHeader = { uncompressedSize: number }
    type ObjectData = { data: string, end: undefined } | { data: undefined, end: boolean }
    export type ObjectPacket = { header: ObjectHeader } | { data: ObjectData }

    export interface IRPCFile {
        name: string,
        size: Long,
        modified: number,
        unstagedStatus: string,
        stagedStatus: string,
        mergeConflict: boolean,
        isChunked: boolean,
    }

    export interface IRPCCommit {
        commitHash: string
        author: string
        timestamp: Long
        message: string
        files: string[]
    }

    export interface IRPCUpdatedRefEvent {
        commit: string
        repoID: string
        txHash: string
        time: Long
        blockNumber: Long
    }

    export function getClient(): IRPCClient;

    export function initClient(protoPath: string): void;
}
