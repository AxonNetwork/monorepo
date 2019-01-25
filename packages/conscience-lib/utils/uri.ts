import path from 'path'
import { URI, URIType } from '../common'

export function getConscienceURI(repoID: string, filename: string) {
    if (filename !== undefined) {
        return 'conscience://' + path.join(repoID, filename)
    } else {
        return 'conscience://' + repoID
    }
}

export function uriToString(uri: URI) {
    if (uri.type === URIType.Local) {
        return "local://" + uri.repoRoot
    } else {
        return "conscience://" + uri.repoID
    }
}
