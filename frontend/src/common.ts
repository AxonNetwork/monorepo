export interface IRepo {
    folderPath: string
    repoID: string
    sharedUsers: string[]
    files: {[name: string]: IRepoFile}
    timeline: ITimelineEvent[]
    behindRemote: boolean
}

export interface IRepoFile {
    path: string
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
    filename: string
    time: number
    message: string
    files: Array<string>
    diffs: {[commit: string]: string}
}

export interface IComment {
    repoID: string
    created: number
    text: string
    user: string
    name: string|undefined
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