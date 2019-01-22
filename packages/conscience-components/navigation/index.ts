import { History } from 'history'
import { FileMode, URI, URIType } from 'conscience-lib/common'
import { getHash } from 'conscience-lib/utils'

export function selectFile(history: History, uri: URI, mode: FileMode) {
    if (uri.type === URIType.Local) {
        const { repoRoot, commit, filename } = uri
        if (filename === undefined) {
            history.push(`/local-repo/${getHash(repoRoot)}/files/${commit}`)
        } else if (mode === FileMode.View) {
            history.push(`/local-repo/${getHash(repoRoot)}/files/${commit}/${filename}`)
        } else if (mode === FileMode.Edit) {
            history.push(`/local-repo/${getHash(repoRoot)}/edit/${commit}/${filename}`)
        } else {
            throw new Error(`unknown FileMode: ${mode}`)
        }

    } else {
        const { repoID, commit, filename } = uri
        if (filename === undefined) {
            history.push(`/repo/${repoID}/files/${commit}`)
        } else if (mode === FileMode.View) {
            history.push(`/repo/${repoID}/files/${commit}/${filename}`)
        } else if (mode === FileMode.Edit) {
            history.push(`/repo/${repoID}/edit/${commit}/${filename}`)
        } else {
            throw new Error(`unknown FileMode: ${mode}`)
        }
    }
}

export function selectDiscussion(history: History, uri: URI, discussionID: string) {
    if (uri.type === URIType.Local) {
        history.push(`/local-repo/${getHash(uri.repoRoot)}/discussion/${discussionID}`)
    } else {
        history.push(`/repo/${uri.repoID}/discussion/${discussionID}`)
    }
}

export function selectCommit(history: History, uri: URI) {
    if (uri.type === URIType.Local) {
        if (uri.commit === undefined) {
            history.push(`/local-repo/${getHash(uri.repoRoot)}/history`)
        } else {
            history.push(`/local-repo/${getHash(uri.repoRoot)}/history/${uri.commit}`)
        }
    } else {
        if (uri.commit === undefined) {
            history.push(`/repo/${uri.repoID}/history`)
        } else {
            history.push(`/repo/${uri.repoID}/history/${uri.commit}`)
        }
    }
}

export function selectUser(history: History, username: string) {
    if (username === undefined) {
        return
    }
    history.push(`/user/${username}`)
}


