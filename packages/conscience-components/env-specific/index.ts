import { IRepo, URI } from 'conscience-lib/common'
import { IGlobalState } from 'conscience-components/redux'

var getRepo: (uri: URI, state?: IGlobalState) => IRepo
var getRepoID: (uri: URI, state?: IGlobalState) => string
var getFileContents: (uri: URI) => Promise<string>
var directEmbedPrefix: (uri: URI) => string

function init(params: {
    getRepo: typeof getRepo,
    getRepoID: typeof getRepoID,
    getFileContents: typeof getFileContents,
    directEmbedPrefix: typeof directEmbedPrefix,
}) {
    getRepo = params.getRepo
    getRepoID = params.getRepoID
    getFileContents = params.getFileContents
    directEmbedPrefix = params.directEmbedPrefix
}

export {
    init,
    getRepo,
    getRepoID,
    getFileContents,
    directEmbedPrefix,
}