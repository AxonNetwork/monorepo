import { IRepo, URI } from 'conscience-lib/common'
import { IGlobalState } from 'conscience-components/redux'

var getRepo: (uri: URI, state?: IGlobalState) => IRepo | undefined
var getRepoID: (uri: URI, state?: IGlobalState) => string
var getURIFromParams: (params: { repoID?: string, repoHash?: string }, state?: IGlobalState) => URI | undefined
var getFileContents: (uri: URI) => Promise<string>
var directEmbedPrefix: (uri: URI) => string

function init(params: {
    getRepo: typeof getRepo,
    getRepoID: typeof getRepoID,
    getURIFromParams: typeof getURIFromParams,
    getFileContents: typeof getFileContents,
    directEmbedPrefix: typeof directEmbedPrefix,
}) {
    getRepo = params.getRepo
    getRepoID = params.getRepoID
    getURIFromParams = params.getURIFromParams
    getFileContents = params.getFileContents
    directEmbedPrefix = params.directEmbedPrefix
}

export {
    init,
    getRepo,
    getRepoID,
    getURIFromParams,
    getFileContents,
    directEmbedPrefix,
}