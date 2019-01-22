import { IRepo, URI } from 'conscience-lib/common'

var getFileContents: (blobIdentifier: URI) => Promise<string>
var directEmbedPrefix: (blobIdentifier: URI) => string
var getRepo: (uri: URI) => IRepo

function init(params: {
    getFileContents: typeof getFileContents,
    directEmbedPrefix: typeof directEmbedPrefix,
    getRepo: typeof getRepo,
}) {
    getFileContents = params.getFileContents
    directEmbedPrefix = params.directEmbedPrefix
    getRepo = params.getRepo
}

export {
    init,
    getFileContents,
    directEmbedPrefix,
    getRepo,
}