import { IRepo, URI } from 'conscience-lib/common'
import { IGlobalState } from 'conscience-components/redux'

var getRepo: (uri: URI, state?: IGlobalState) => IRepo | undefined
var getRepoID: (uri: URI, state?: IGlobalState) => string
var getURIFromParams: (params: { repoID?: string, repoHash?: string }, state?: IGlobalState) => URI | undefined
var getFileContents: (uri: URI, opts?: IGetFileContentsOptions) => Promise<string | Buffer>
var saveFileContents: (uri: URI, fileContents: string) => Promise<void>
var directEmbedPrefix: (uri: URI) => string
var getPlatformName: () => string

export interface IGetFileContentsOptions {
    as?: 'buffer' | 'string'
}

function init(params: {
    getRepo: typeof getRepo,
    getRepoID: typeof getRepoID,
    getURIFromParams: typeof getURIFromParams,
    getFileContents: typeof getFileContents,
    saveFileContents: typeof saveFileContents,
    directEmbedPrefix: typeof directEmbedPrefix,
    getPlatformName: typeof getPlatformName,
}) {
    getRepo = params.getRepo
    getRepoID = params.getRepoID
    getURIFromParams = params.getURIFromParams
    getFileContents = params.getFileContents
    saveFileContents = params.saveFileContents
    directEmbedPrefix = params.directEmbedPrefix
    getPlatformName = params.getPlatformName
}

export {
    init,
    getRepo,
    getRepoID,
    getURIFromParams,
    getFileContents,
    saveFileContents,
    directEmbedPrefix,
    getPlatformName
}