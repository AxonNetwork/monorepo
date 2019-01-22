
export interface IRepo {
    repoID: string
    path?: string
    hasBeenFetched?: boolean

    sharedUsers?: string[]
    admins?: string[]
    pullers?: string[]
    pushers?: string[]
    isPublic?: boolean
    files?: { [name: string]: IRepoFile }
    localRefs?: { [name: string]: string }
    remoteRefs?: { [name: string]: string }
    commits?: { [commitHash: string]: ITimelineEvent }
    commitList?: string[]
    behindRemote?: boolean
}

export interface IRepoPermissions {
    admins: string[]
    pushers: string[]
    pullers: string[]
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
    hash: string
    size: number
    modified: Date
    type: string
    status: string
    diff: string
    mergeConflict: boolean
    mergeUnresolved: boolean
}

export enum URIType {
    Local,
    Network,
}

export type URI = LocalURI | NetworkURI

export interface LocalURI {
    type: URIType.Local
    repoRoot: string
    commit?: string | undefined
    filename?: string | undefined
    discussionID?: string | undefined
}

export interface NetworkURI {
    type: URIType.Network
    repoID: string
    commit?: string | undefined
    filename?: string | undefined
    discussionID?: string | undefined
}


export interface ITimelineEvent {
    version: number
    commit: string
    user: string
    time: Date
    message: string
    files: string[]
    verified?: Date
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

export interface IUploadedPicture {
    '512x512': string
    '256x256': string
    '128x128': string
}

export interface IUser {
    userID: string
    emails: string[]
    name: string
    username: string
    picture: IUploadedPicture | null
    orgs: string[]
    profile: IUserProfile | null
}

export interface IUserProfile {
    geolocation: string
    bio: string
    orcid: string
    university: string
    interests: string[]
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
    picture: IUploadedPicture
    banner: string
    readme: string
    members: string[] //userID[]
    repos: string[] //repoID[]
    featuredRepos: { [repoID: string]: IFeaturedRepo }
}

export interface IOrgBlog {
    orgID: string
    created: number
    title: string
    body: string
    author: string
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
    Team,
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
