import { FileMode, URI, URIType } from 'conscience-lib/common'
import { getHash } from 'conscience-lib/utils'
import history from '../redux/history'


export function getFileURL(uri: URI, mode: FileMode) {
    if (uri.type === URIType.Local) {
        const { repoRoot, commit, filename } = uri
        if (filename === undefined) {
            return `/local-repo/${getHash(repoRoot)}/files/${commit}`
        } else if (mode === FileMode.View) {
            return `/local-repo/${getHash(repoRoot)}/files/${commit}/${filename}`
        } else if (mode === FileMode.Edit) {
            return `/local-repo/${getHash(repoRoot)}/edit/${commit}/${filename}`
        } else {
            throw new Error(`unknown FileMode: ${mode}`)
        }

    } else {
        const { repoID, commit, filename } = uri
        if (filename === undefined) {
            return `/repo/${repoID}/files/${commit}`
        } else if (mode === FileMode.View) {
            return `/repo/${repoID}/files/${commit}/${filename}`
        } else if (mode === FileMode.Edit) {
            return `/repo/${repoID}/edit/${commit}/${filename}`
        } else {
            throw new Error(`unknown FileMode: ${mode}`)
        }
    }
}

export function selectFile(uri: URI, mode: FileMode) {
    history.push(getFileURL(uri, mode))
}

export function getDiscussionURL(uri: URI, discussionID: string | undefined) {
    if (uri.type === URIType.Local) {
        if (discussionID !== undefined) {
            return `/local-repo/${getHash(uri.repoRoot)}/discussion/${discussionID}`
        } else {
            return `/local-repo/${getHash(uri.repoRoot)}/discussion`
        }
    } else {
        if (discussionID !== undefined) {
            return `/repo/${uri.repoID}/discussion/${discussionID}`
        } else {
            return `/repo/${uri.repoID}/discussion`
        }
    }
}

export function selectDiscussion(uri: URI, discussionID: string | undefined) {
    history.push(getDiscussionURL(uri, discussionID))
}

export function getCommitURL(uri: URI) {
    if (uri.type === URIType.Local) {
        if (uri.commit === undefined) {
            return `/local-repo/${getHash(uri.repoRoot)}/history`
        } else {
            return `/local-repo/${getHash(uri.repoRoot)}/history/${uri.commit}`
        }
    } else {
        if (uri.commit === undefined) {
            return `/repo/${uri.repoID}/history`
        } else {
            return `/repo/${uri.repoID}/history/${uri.commit}`
        }
    }
}

export function selectCommit(uri: URI) {
    history.push(getCommitURL(uri))
}

export function selectUser(username: string) {
    if (username === undefined) {
        return
    }
    history.push(`/user/${username}`)
}

export function selectSettings() {
    history.push('/settings')
}