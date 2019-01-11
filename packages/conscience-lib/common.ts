
export interface IRepo {
    repoID: string
    path?: string
    hasBeenFetched?: boolean

    sharedUsers?: string[]
    admins?: string[]
    pullers?: string[]
    pushers?: string[]
    isPublic?: boolean
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
    mergeConflict: boolean
    mergeUnresolved: boolean
}

export interface ITimelineEvent {
    version: number
    commit: string
    user: string
    time: Date
    message: string
    files: string[]
    verified?: Date
    diffs?: {[filename: string]: string}
    repoID?: string
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
    profile: IUserProfile
    jwt?: string
}

export interface IUserProfile {
    geolocation: string
    bio: string
    orcid: string
    university: string
    fields: string[]
}

interface ICommentTimestamp {
    [repoID: string]: {
        [discussionID: string]: number,
    }
}

export interface IUserSettings {
    ignoredSharedRepos?: string[]
    codeColorScheme?: string
    menuLabelsHidden?: boolean
    fileExtensionsHidden?: boolean
    newestViewedCommentTimestamp?: ICommentTimestamp
}

export interface IRef {
    refName: string
    commitHash: string
}

export interface IOrganization {
    orgID: string
    name: string
    description: string
    creator: string //userID
    picture: string
    banner: string
    readme: string
    members: string[] //userID[]
    repos: string[] //repoID[]
    featuredRepos: {[repoID: string]: IFeaturedRepo}
}

export interface IFeaturedRepo {
    repoID: string
    title: string
    description: string
    image?: string
}

export enum RepoPage {
    Home,
    Files,
    Manuscript,
    History,
    Discussion,
    Settings,
    New,
}

export enum FileMode {
    View,
    Edit,
    ResolveConflict,
}

export enum OrgPage {
    Home,
    Settings,
    Editor,
}
