

export interface IRepo {
    folderPath: string
    sharedUsers: string[]
    files: IRepoFile[]
    timeline: ITimelineEvent[]
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