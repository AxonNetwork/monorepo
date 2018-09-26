export interface Repo {
    folderPath: string
    repoID: string
    sharedUsers: Array<string>
    timeline: Array<string>
    behindRemote: boolean
}