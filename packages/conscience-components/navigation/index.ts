import urljoin from 'url-join'
import { FileMode, URI, URIType, RepoPage } from 'conscience-lib/common'
import { getHash } from 'conscience-lib/utils'
import history from '../redux/history'

export function getRepoURL(uri: URI, page: RepoPage) {
    let parts: string[]
    if (uri.type === URIType.Local) {
        parts = ['local-repo', getHash(uri.repoRoot)]
    } else {
        parts = ['repo', uri.repoID]
    }

    switch (page) {
        case RepoPage.Files:
            if (uri.type === URIType.Local) {
                parts.push('files/working')
            } else {
                parts.push('files/HEAD')
            }
            break
        case RepoPage.History:
            parts.push('history')
            break
        case RepoPage.Discussion:
            parts.push('discussion')
            break
        case RepoPage.Team:
            parts.push('team')
            break
        case RepoPage.Settings:
            parts.push('settings')
            break
        case RepoPage.Home:
        default:
            parts.push('home')
            break
    }

    const url = '/' + urljoin(...parts)
    return url
}

export function selectRepo(uri: URI, page: RepoPage) {
    history.push(getRepoURL(uri, page))
}

export function getFileURL(uri: URI, mode: FileMode) {
    if (uri.type === URIType.Local) {
        const { repoRoot, commit = 'working', filename } = uri
        if (filename === undefined) {
            return `/local-repo/${getHash(repoRoot)}/files/${commit}`
        } else if (mode === FileMode.View) {
            return `/local-repo/${getHash(repoRoot)}/files/${commit}/${filename}`
        } else if (mode === FileMode.Edit) {
            return `/local-repo/${getHash(repoRoot)}/edit/${filename}`
        } else if (mode === FileMode.EditNew) {
            return `/local-repo/${getHash(repoRoot)}/new-file/${filename}`
        } else if (mode === FileMode.ResolveConflict) {
            return `/local-repo/${getHash(repoRoot)}/conflict/${filename}`
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
            return `/repo/${repoID}/edit/${filename}`
        } else if (mode === FileMode.ResolveConflict) {
            return `/repo/${repoID}/conflict/${filename}`
        } else {
            throw new Error(`unknown FileMode: ${mode}`)
        }
    }
}

export function selectFile(uri: URI, mode: FileMode) {
    uri = { ...uri } // make a copy
    uri.commit = uri.commit || 'HEAD'
    history.push(getFileURL(uri, mode))
}

export function getDiscussionURL(uri: URI, discussionID: string | undefined, commentID?: string) {
    if (uri.type === URIType.Local) {
        if (discussionID !== undefined) {
            return `/local-repo/${getHash(uri.repoRoot)}/discussion/${discussionID}` + (commentID ? `#${commentID}` : '')
        } else {
            return `/local-repo/${getHash(uri.repoRoot)}/discussion`
        }
    } else {
        if (discussionID !== undefined) {
            return `/repo/${uri.repoID}/discussion/${discussionID}` + (commentID ? `#${commentID}` : '')
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
    history.push(getUserURL(username))
}

export function getUserURL(username: string) {
    return `/user/${username}`
}

export function selectOrg(orgID: string) {
    history.push(`/org/${orgID}`)
}

export function selectOrgShowcase(orgID: string) {
    history.push(`/showcase/${orgID}`)
}

export function selectSettings() {
    history.push('/settings')
}

export function selectFeedback() {
    history.push('/feedback')
}

export function selectSearch(query: string) {
    history.push(`/search/${encodeURIComponent(query)}`)
}

export function selectLogin() {
    history.push('/login')
}

export function selectNewRepoPage(orgID: string | undefined) {
    if (orgID !== undefined) {
        history.push(`/new-repo/${orgID}`)
    } else {
        history.push('/new-repo')
    }
}
