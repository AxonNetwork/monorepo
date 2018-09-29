
export interface IRepo {
    path: string
    repoID: string
    hasBeenFetched?: boolean

    sharedUsers?: string[]
    files?: {[name: string]: IRepoFile}
    localRefs?: {[name: string]: string}
    remoteRefs?: {[name: string]: string}
    timeline?: ITimelineEvent[]
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
    diffs: {[commit: string]: string}
}

export interface IComment {
    repoID: string
    created: number
    text: string
    user: string
    attachedTo: IAttachedTo
}

export interface IAttachedTo {
    type: 'discussion' | 'file' | 'event'
    subject: string | number
}

export interface IDiscussion {
    repoID: string
    created: number
    email: string
    subject: string
}

export interface IUser {
    email: string
    name: string
    repos: string[]
    sharedRepos: {[repoID: string]: ISharedRepoInfo}
}

export interface IRef {
    refName: string
    commitHash: string
}

