import { FileMode, URI } from 'conscience-lib/common'
import { History } from 'history'

var selectFile: (history: History, uri: URI, mode: FileMode) => void
var getFileContents: (blobIdentifier: URI) => Promise<string>
var directEmbedPrefix: (blobIdentifier: URI) => string

function init(params: { selectFile: typeof selectFile, getFileContents: typeof getFileContents, directEmbedPrefix: typeof directEmbedPrefix }) {
    selectFile = params.selectFile
    getFileContents = params.getFileContents
    directEmbedPrefix = params.directEmbedPrefix
}

export {
    init,
    selectFile,
    getFileContents,
    directEmbedPrefix,
}