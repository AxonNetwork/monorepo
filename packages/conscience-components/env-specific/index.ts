import { IRepo, FileMode, URI } from 'conscience-lib/common'
import { History } from 'history'

var selectFile: (history: History, uri: URI, mode: FileMode) => void
var selectDiscussion: (history: History, uri: URI, discussionID: string) => void
var getFileContents: (blobIdentifier: URI) => Promise<string>
var directEmbedPrefix: (blobIdentifier: URI) => string
var getRepo: (uri: URI) => IRepo

function init(params: {
    selectFile: typeof selectFile,
    selectDiscussion: typeof selectDiscussion,,
    getFileContents: typeof getFileContents,
    directEmbedPrefix: typeof directEmbedPrefix,
    getRepo: typeof getRepo,
}) {
    selectFile = params.selectFile
    selectDiscussion = params.selectDiscussion
    getFileContents = params.getFileContents
    directEmbedPrefix = params.directEmbedPrefix
    getRepo = params.getRepo
}

export {
    init,
    selectFile,
    selectDiscussion,
    getFileContents,
    directEmbedPrefix,
    getRepo,
}