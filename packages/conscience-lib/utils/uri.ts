import path from 'path'
import { URI, URIType } from '../common'

export function getConscienceURI(repoID: string, filename?: string) {
    if (filename !== undefined) {
        return 'axon://' + path.join(repoID, filename)
    } else {
        return 'axon://' + repoID
    }
}

export function repoUriToString(uri?: URI) {
    if (!uri) {
        return ''
    }
    if (uri.type === URIType.Local) {
        return "local://" + uri.repoRoot
    } else {
        return "axon://" + uri.repoID
    }
}

export function uriToString(uri?: URI) {
    if (!uri) {
        return ''
    }
    let str = repoUriToString(uri)
    if (uri.filename) {
        str += "/" + uri.filename
    }
    return str
}
