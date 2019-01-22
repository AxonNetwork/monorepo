import { IRepo, URI } from 'conscience-lib/common'
import { IGlobalState } from 'conscience-components/redux'

var getRepo: (uri: URI, state?: IGlobalState) => IRepo
var getFileContents: (uri: URI) => Promise<string>
var directEmbedPrefix: (uri: URI) => string

function init(params: {
    getRepo: typeof getRepo,
    getFileContents: typeof getFileContents,
    directEmbedPrefix: typeof directEmbedPrefix,
}) {
    getRepo = params.getRepo
    getFileContents = params.getFileContents
    directEmbedPrefix = params.directEmbedPrefix
}

export {
    init,
    getRepo,
    getFileContents,
    directEmbedPrefix,
}