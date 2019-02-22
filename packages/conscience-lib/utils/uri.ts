import path from 'path'
import { URI, URIType } from '../common'

export function getConscienceURI(repoID: string, filename?: string) {
    if (filename !== undefined) {
        return 'conscience://' + path.join(repoID, filename)
    } else {
        return 'conscience://' + repoID
    }
}

export function uriToString(uri?: URI) {
    if (!uri) {
        return ''
    }
    let str = ''
    if (uri.type === URIType.Local) {
        str = "local://" + uri.repoRoot
    } else {
        str = "conscience://" + uri.repoID
    }
    if (uri.filename) {
        str += "/" + uri.filename
    }
    return str
}
