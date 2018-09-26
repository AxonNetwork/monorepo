

export interface IRepo {
    folderPath: string
    sharedUsers: string[]
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
    user: string
    filename: string
    time: number
    message: string
}

