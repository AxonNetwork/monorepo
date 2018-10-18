
export interface IRepo {
    path: string
    repoID: string
    hasBeenFetched?: boolean

    sharedUsers?: string[]
    files?: {[name: string]: IRepoFile}
    localRefs?: {[name: string]: string}
    remoteRefs?: {[name: string]: string}
    commits?: {[commitHash: string]: ITimelineEvent}
    commitList?: string[]
    behindRemote?: boolean
}

export interface ISharedRepoInfo {
    ignored: boolean
    repoID: string
}

export interface ILocalRepo {
    repoID: string
    path: string
}

export interface IRepoFile {
    name: string
    size: number
    modified: Date
    type: string
    status: string
    diff: string
}

export interface ITimelineEvent {
    version: number
    commit: string
    user: string
    time: Date
    message: string
    files: string[]
    verified?: Date
    diffs?: {[commit: string]: string}
}

export interface IComment {
    commentID: string
    repoID: string
    userID: string
    discussionID: string
    created: number
    text: string
}

export interface IDiscussion {
    discussionID: string
    repoID: string
    userID: string
    created: number
    subject: string
}

export interface IUser {
    userID: string
    emails: string[]
    name: string
    username: string
    picture: string
    repos: string[]
    orgs: string[]
}

export interface IRef {
    refName: string
    commitHash: string
}

export interface IOrganization {
    orgID: string
    name: string
    creator: string //userID
    members: string[] //userID[]
    repos: string[] //repoID[]
}
