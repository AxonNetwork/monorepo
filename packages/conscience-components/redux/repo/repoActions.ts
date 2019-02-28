import * as parseDiff from 'parse-diff'
import { FailedAction } from '../reduxUtils'
import { URI, NetworkURI, IRepoMetadata, IRepoFile, ITimelineEvent, ISecuredTextInfo } from 'conscience-lib/common'

export enum RepoActionType {
    GET_REPO_LIST = 'GET_REPO_LIST',
    GET_REPO_LIST_SUCCESS = 'GET_REPO_LIST_SUCCESS',
    GET_REPO_LIST_FAILED = 'GET_REPO_LIST_FAILED',

    GET_LOCAL_REPO_LIST = 'GET_LOCAL_REPO_LIST',
    GET_LOCAL_REPO_LIST_SUCCESS = 'GET_LOCAL_REPO_LIST_SUCCESS',
    GET_LOCAL_REPO_LIST_FAILED = 'GET_LOCAL_REPO_LIST_FAILED',

    FETCH_REPO_METADATA = 'FETCH_REPO_METADATA',
    FETCH_REPO_METADATA_SUCCESS = 'FETCH_REPO_METADATA_SUCCESS',
    FETCH_REPO_METADATA_FAILED = 'FETCH_REPO_METADATA_FAILED',

    FETCH_REPO_FILES = 'FETCH_REPO_FILES',
    FETCH_REPO_FILES_SUCCESS = 'FETCH_REPO_FILES_SUCCESS',
    FETCH_REPO_FILES_FAILED = 'FETCH_REPO_FILES_FAILED',

    FETCH_REPO_TIMELINE = 'FETCH_REPO_TIMELINE',
    FETCH_REPO_TIMELINE_SUCCESS = 'FETCH_REPO_TIMELINE_SUCCESS',
    FETCH_REPO_TIMELINE_FAILED = 'FETCH_REPO_TIMELINE_FAILED',

    FETCH_REPO_TIMELINE_EVENT = 'FETCH_REPO_TIMELINE_EVENT',
    FETCH_REPO_TIMELINE_EVENT_SUCCESS = 'FETCH_REPO_TIMELINE_EVENT_SUCCESS',
    FETCH_REPO_TIMELINE_EVENT_FAILED = 'FETCH_REPO_TIMELINE_EVENT_FAILED',

    FETCH_SECURED_FILE_INFO = 'FETCH_SECURED_FILE_INFO',
    FETCH_SECURED_FILE_INFO_SUCCESS = 'FETCH_SECURED_FILE_INFO_SUCCESS',
    FETCH_SECURED_FILE_INFO_FAILED = 'FETCH_SECURED_FILE_INFO_FAILED',

    FETCH_IS_BEHIND_REMOTE = 'FETCH_IS_BEHIND_REMOTE',
    FETCH_IS_BEHIND_REMOTE_SUCCESS = 'FETCH_IS_BEHIND_REMOTE_SUCCESS',
    FETCH_IS_BEHIND_REMOTE_FAILED = 'FETCH_IS_BEHIND_REMOTE_FAILED',

    FETCH_REMOTE_REFS = 'FETCH_REMOTE_REFS',
    FETCH_REMOTE_REFS_SUCCESS = 'FETCH_REMOTE_REFS_SUCCESS',
    FETCH_REMOTE_REFS_FAILED = 'FETCH_REMOTE_REFS_FAILED',

    FETCH_LOCAL_REFS = 'FETCH_LOCAL_REFS',
    FETCH_LOCAL_REFS_SUCCESS = 'FETCH_LOCAL_REFS_SUCCESS',
    FETCH_LOCAL_REFS_FAILED = 'FETCH_LOCAL_REFS_FAILED',

    FETCH_REPO_USERS_PERMISSIONS = 'FETCH_REPO_USERS_PERMISSIONS',
    FETCH_REPO_USERS_PERMISSIONS_SUCCESS = 'FETCH_REPO_USERS_PERMISSIONS_SUCCESS',
    FETCH_REPO_USERS_PERMISSIONS_FAILED = 'FETCH_REPO_USERS_PERMISSIONS_FAILED',

    GET_DIFF = 'GET_DIFF',
    GET_DIFF_SUCCESS = 'GET_DIFF_SUCCESS',
    GET_DIFF_FAILED = 'GET_DIFF_FAILED',

    UPDATE_USER_PERMISSIONS = 'UPDATE_USER_PERMISSIONS',
    UPDATE_USER_PERMISSIONS_SUCCESS = 'UPDATE_USER_PERMISSIONS_SUCCESS',
    UPDATE_USER_PERMISSIONS_FAILED = 'UPDATE_USER_PERMISSIONS_FAILED',

    SET_REPO_PUBLIC = 'SET_REPO_PUBLIC',
    SET_REPO_PUBLIC_SUCCESS = 'SET_REPO_PUBLIC_SUCCESS',
    SET_REPO_PUBLIC_FAILED = 'SET_REPO_PUBLIC_FAILED',

    INIT_REPO = 'INIT_REPO',
    INIT_REPO_SUCCESS = 'INIT_REPO_SUCCESS',
    INIT_REPO_FAILED = 'INIT_REPO_FAILED',

    CHECKPOINT_REPO = 'CHECKPOINT_REPO',
    CHECKPOINT_REPO_SUCCESS = 'CHECKPOINT_REPO_SUCCESS',
    CHECKPOINT_REPO_FAILED = 'CHECKPOINT_REPO_FAILED',

    CLONE_REPO = 'CLONE_REPO',
    CLONE_REPO_PROGRESS = 'CLONE_REPO_PROGRESS',
    CLONE_REPO_SUCCESS = 'CLONE_REPO_SUCCESS',
    CLONE_REPO_FAILED = 'CLONE_REPO_FAILED',

    PULL_REPO = 'PULL_REPO',
    PULL_REPO_PROGRESS = 'PULL_REPO_PROGRESS',
    PULL_REPO_SUCCESS = 'PULL_REPO_SUCCESS',
    PULL_REPO_FAILED = 'PULL_REPO_FAILED',

    WATCH_REPO = 'WATCH_REPO',
    WATCH_REPO_SUCCESS = 'WATCH_REPO_SUCCESS',

    BEHIND_REMOTE = 'BEHIND_REMOTE',
}

export interface IGetRepoListAction {
    type: RepoActionType.GET_REPO_LIST
    payload: {
        userID: string
    }
}

export interface IGetRepoListSuccessAction {
    type: RepoActionType.GET_REPO_LIST_SUCCESS
    payload: {
        userID: string
        repoList: string[]
    }
}

export type IGetRepoListFailedAction = FailedAction<RepoActionType.GET_REPO_LIST_FAILED>

export interface IGetLocalRepoListAction {
    type: RepoActionType.GET_LOCAL_REPO_LIST
    payload: {}
}

export interface IGetLocalRepoListSuccessAction {
    type: RepoActionType.GET_LOCAL_REPO_LIST_SUCCESS
    payload: {
        localRepos: { [path: string]: string }
    }
}

export type IGetLocalRepoListFailedAction = FailedAction<RepoActionType.GET_LOCAL_REPO_LIST_FAILED>

export interface IFetchRepoMetadataAction {
    type: RepoActionType.FETCH_REPO_METADATA
    payload: {
        repoList: URI[]
    }
}

export interface IFetchRepoMetadataSuccessAction {
    type: RepoActionType.FETCH_REPO_METADATA_SUCCESS
    payload: {
        metadataByURI: { [uri: string]: IRepoMetadata | null }
    }
}

export type IFetchRepoMetadataFailedAction = FailedAction<RepoActionType.FETCH_REPO_METADATA_FAILED>

export interface IFetchRepoFilesAction {
    type: RepoActionType.FETCH_REPO_FILES
    payload: {
        uri: URI
    }
}

export interface IFetchRepoFilesSuccessAction {
    type: RepoActionType.FETCH_REPO_FILES_SUCCESS
    payload: {
        uri: URI
        files: { [path: string]: IRepoFile },
    }
}

export type IFetchRepoFilesFailedAction = FailedAction<RepoActionType.FETCH_REPO_FILES_FAILED>

export interface IFetchRepoTimelineAction {
    type: RepoActionType.FETCH_REPO_TIMELINE
    payload: {
        uri: URI
        lastCommitFetched?: string
        pageSize?: number
    }
}

export interface IFetchRepoTimelineSuccessAction {
    type: RepoActionType.FETCH_REPO_TIMELINE_SUCCESS
    payload: {
        uri: URI
        timeline: ITimelineEvent[]
    }
}

export type IFetchRepoTimelineFailedAction = FailedAction<RepoActionType.FETCH_REPO_TIMELINE_FAILED>

export interface IFetchRepoTimelineEventAction {
    type: RepoActionType.FETCH_REPO_TIMELINE_EVENT
    payload: {
        uri: URI
    }
}

export interface IFetchRepoTimelineEventSuccessAction {
    type: RepoActionType.FETCH_REPO_TIMELINE_EVENT_SUCCESS
    payload: {
        event: ITimelineEvent,
    }
}

export type IFetchRepoTimelineEventFailedAction = FailedAction<RepoActionType.FETCH_REPO_TIMELINE_EVENT_FAILED>

export interface IFetchSecuredFileInfoAction {
    type: RepoActionType.FETCH_SECURED_FILE_INFO
    payload: {
        uri: URI
    }
}

export interface IFetchSecuredFileInfoSuccessAction {
    type: RepoActionType.FETCH_SECURED_FILE_INFO_SUCCESS
    payload: {
        uri: URI
        securedFileInfo: ISecuredTextInfo
    }
}

export type IFetchSecuredFileInfoFailedAction = FailedAction<RepoActionType.FETCH_SECURED_FILE_INFO_FAILED>

export interface IFetchIsBehindRemoteAction {
    type: RepoActionType.FETCH_IS_BEHIND_REMOTE
    payload: {
        uri: URI
    }
}

export interface IFetchIsBehindRemoteSuccessAction {
    type: RepoActionType.FETCH_IS_BEHIND_REMOTE_SUCCESS
    payload: {
        uri: URI
        isBehindRemote: boolean
    }
}

export type IFetchIsBehindRemoteFailedAction = FailedAction<RepoActionType.FETCH_IS_BEHIND_REMOTE_FAILED>

export interface IFetchLocalRefsAction {
    type: RepoActionType.FETCH_LOCAL_REFS
    payload: {
        uri: URI
    }
}

export interface IFetchLocalRefsSuccessAction {
    type: RepoActionType.FETCH_LOCAL_REFS_SUCCESS
    payload: {
        uri: URI
        localRefs: { [name: string]: string },
    }
}

export type IFetchLocalRefsFailedAction = FailedAction<RepoActionType.FETCH_LOCAL_REFS_FAILED>

export interface IFetchRemoteRefsAction {
    type: RepoActionType.FETCH_REMOTE_REFS
    payload: {
        uri: URI
    }
}

export interface IFetchRemoteRefsSuccessAction {
    type: RepoActionType.FETCH_REMOTE_REFS_SUCCESS
    payload: {
        repoID: string
        remoteRefs: { [name: string]: string },
    }
}

export type IFetchRemoteRefsFailedAction = FailedAction<RepoActionType.FETCH_REMOTE_REFS_FAILED>

export interface IFetchRepoUsersPermissionsAction {
    type: RepoActionType.FETCH_REPO_USERS_PERMISSIONS
    payload: {
        uri: URI
    }
}

export interface IFetchRepoUsersPermissionsSuccessAction {
    type: RepoActionType.FETCH_REPO_USERS_PERMISSIONS_SUCCESS
    payload: {
        repoID: string
        admins: string[]
        pushers: string[]
        pullers: string[]
        isPublic: boolean
    }
}

export type IFetchRepoUsersPermissionsFailedAction = FailedAction<RepoActionType.FETCH_REPO_USERS_PERMISSIONS_FAILED>

export interface IGetDiffAction {
    type: RepoActionType.GET_DIFF
    payload: {
        uri: URI
        commit: string
    }
}

export interface IGetDiffSuccessAction {
    type: RepoActionType.GET_DIFF_SUCCESS
    payload: {
        commit: string
        diff: parseDiff.File[]
    }
}

export type IGetDiffFailedAction = FailedAction<RepoActionType.GET_DIFF_FAILED>

export interface IUpdateUserPermissionsAction {
    type: RepoActionType.UPDATE_USER_PERMISSIONS
    payload: {
        uri: URI
        username: string
        admin: boolean
        pusher: boolean
        puller: boolean
    }
}

export interface IUpdateUserPermissionsSuccessAction {
    type: RepoActionType.UPDATE_USER_PERMISSIONS_SUCCESS
    payload: {
        repoID: string
        admins: string[]
        pushers: string[]
        pullers: string[]
    }
}

export type IUpdateUserPermissionsFailedAction = FailedAction<RepoActionType.UPDATE_USER_PERMISSIONS_FAILED>

export interface ISetRepoPublicAction {
    type: RepoActionType.SET_REPO_PUBLIC
    payload: {
        repoID: string
        isPublic: boolean
    }
}

export interface ISetRepoPublicSuccessAction {
    type: RepoActionType.SET_REPO_PUBLIC_SUCCESS
    payload: {
        repoID: string
        isPublic: boolean
    }
}

export type ISetRepoPublicFailedAction = FailedAction<RepoActionType.SET_REPO_PUBLIC_FAILED>

export interface IInitRepoAction {
    type: RepoActionType.INIT_REPO
    payload: {
        repoID: string
        path?: string
        orgID: string
    }
}

export interface IInitRepoSuccessAction {
    type: RepoActionType.INIT_REPO_SUCCESS
    payload: {
        repoID: string
        path: string
        orgID: string,
    }
}

export type IInitRepoFailedAction = FailedAction<RepoActionType.INIT_REPO_FAILED>

export interface ICheckpointRepoAction {
    type: RepoActionType.CHECKPOINT_REPO
    payload: {
        uri: URI
        message: string,
    }
}

export interface ICheckpointRepoSuccessAction {
    type: RepoActionType.CHECKPOINT_REPO_SUCCESS
    payload: {}
}

export type ICheckpointRepoFailedAction = FailedAction<RepoActionType.CHECKPOINT_REPO_FAILED>

export interface ICloneRepoAction {
    type: RepoActionType.CLONE_REPO
    payload: {
        uri: NetworkURI
    }
}

export interface ICloneRepoProgressAction {
    type: RepoActionType.CLONE_REPO_PROGRESS
    payload: {
        repoID: string,
        toFetch: number,
        fetched: number,
    }
}

export interface ICloneRepoSuccessAction {
    type: RepoActionType.CLONE_REPO_SUCCESS
    payload: {
        repoID: string
    }
}

export type ICloneRepoFailedAction = FailedAction<RepoActionType.CLONE_REPO_FAILED>

export interface IPullRepoAction {
    type: RepoActionType.PULL_REPO
    payload: {
        uri: URI
    }
}

export interface IPullRepoProgressAction {
    type: RepoActionType.PULL_REPO_PROGRESS
    payload: {
        uri: URI
        toFetch: number
        fetched: number
    }
}

export interface IPullRepoSuccessAction {
    type: RepoActionType.PULL_REPO_SUCCESS
    payload: {
        uri: URI
    }
}

export type IPullRepoFailedAction = FailedAction<RepoActionType.PULL_REPO_FAILED>

export interface IWatchRepoAction {
    type: RepoActionType.WATCH_REPO
    payload: {
        uri: URI
    }
}

export interface IWatchRepoSuccessAction {
    type: RepoActionType.WATCH_REPO_SUCCESS
    payload: {}
}

export interface IBehindRemoteAction {
    type: RepoActionType.BEHIND_REMOTE
    payload: {
        uri: URI
    }
}

export type IRepoAction =
    IGetRepoListAction |
    IGetRepoListSuccessAction |
    IGetRepoListFailedAction |

    IGetLocalRepoListAction |
    IGetLocalRepoListSuccessAction |
    IGetLocalRepoListFailedAction |

    IFetchRepoMetadataAction |
    IFetchRepoMetadataSuccessAction |
    IFetchRepoMetadataFailedAction |

    IFetchRepoFilesAction |
    IFetchRepoFilesSuccessAction |
    IFetchRepoFilesFailedAction |

    IFetchRepoTimelineAction |
    IFetchRepoTimelineSuccessAction |
    IFetchRepoTimelineFailedAction |

    IFetchRepoTimelineEventAction |
    IFetchRepoTimelineEventSuccessAction |
    IFetchRepoTimelineEventFailedAction |

    IFetchSecuredFileInfoAction |
    IFetchSecuredFileInfoSuccessAction |
    IFetchSecuredFileInfoFailedAction |

    IFetchIsBehindRemoteAction |
    IFetchIsBehindRemoteSuccessAction |
    IFetchIsBehindRemoteFailedAction |

    IFetchLocalRefsAction |
    IFetchLocalRefsSuccessAction |
    IFetchLocalRefsFailedAction |

    IFetchRemoteRefsAction |
    IFetchRemoteRefsSuccessAction |
    IFetchRemoteRefsFailedAction |

    IFetchRepoUsersPermissionsAction |
    IFetchRepoUsersPermissionsSuccessAction |
    IFetchRepoUsersPermissionsFailedAction |

    IGetDiffAction |
    IGetDiffSuccessAction |
    IGetDiffFailedAction |

    IUpdateUserPermissionsAction |
    IUpdateUserPermissionsSuccessAction |
    IUpdateUserPermissionsFailedAction |

    ISetRepoPublicAction |
    ISetRepoPublicSuccessAction |
    ISetRepoPublicFailedAction |

    IInitRepoAction |
    IInitRepoSuccessAction |
    IInitRepoFailedAction |

    ICheckpointRepoAction |
    ICheckpointRepoSuccessAction |
    ICheckpointRepoFailedAction |

    ICloneRepoAction |
    ICloneRepoProgressAction |
    ICloneRepoSuccessAction |
    ICloneRepoFailedAction |

    IPullRepoAction |
    IPullRepoProgressAction |
    IPullRepoSuccessAction |
    IPullRepoFailedAction |

    IWatchRepoAction |
    IWatchRepoSuccessAction |

    IBehindRemoteAction

export const getRepoList = (payload: IGetRepoListAction['payload']): IGetRepoListAction => ({ type: RepoActionType.GET_REPO_LIST, payload })
export const getLocalRepoList = (payload: IGetLocalRepoListAction['payload']): IGetLocalRepoListAction => ({ type: RepoActionType.GET_LOCAL_REPO_LIST, payload })


export const fetchRepoMetadata = (payload: IFetchRepoMetadataAction['payload']): IFetchRepoMetadataAction => ({ type: RepoActionType.FETCH_REPO_METADATA, payload })
export const fetchRepoFiles = (payload: IFetchRepoFilesAction['payload']): IFetchRepoFilesAction => ({ type: RepoActionType.FETCH_REPO_FILES, payload })
export const fetchRepoTimeline = (payload: IFetchRepoTimelineAction['payload']): IFetchRepoTimelineAction => ({ type: RepoActionType.FETCH_REPO_TIMELINE, payload })
export const fetchRepoTimelineEvent = (payload: IFetchRepoTimelineEventAction['payload']): IFetchRepoTimelineEventAction => ({ type: RepoActionType.FETCH_REPO_TIMELINE_EVENT, payload })
export const fetchSecuredFileInfo = (payload: IFetchSecuredFileInfoAction['payload']): IFetchSecuredFileInfoAction => ({ type: RepoActionType.FETCH_SECURED_FILE_INFO, payload })
export const fetchIsBehindRemote = (payload: IFetchIsBehindRemoteAction['payload']): IFetchIsBehindRemoteAction => ({ type: RepoActionType.FETCH_IS_BEHIND_REMOTE, payload })

export const fetchRepoUsersPermissions = (payload: IFetchRepoUsersPermissionsAction['payload']): IFetchRepoUsersPermissionsAction => ({ type: RepoActionType.FETCH_REPO_USERS_PERMISSIONS, payload })
export const fetchLocalRefs = (payload: IFetchLocalRefsAction['payload']): IFetchLocalRefsAction => ({ type: RepoActionType.FETCH_LOCAL_REFS, payload })
export const fetchRemoteRefs = (payload: IFetchRemoteRefsAction['payload']): IFetchRemoteRefsAction => ({ type: RepoActionType.FETCH_REMOTE_REFS, payload })

export const getDiff = (payload: IGetDiffAction['payload']): IGetDiffAction => ({ type: RepoActionType.GET_DIFF, payload })
export const updateUserPermissions = (payload: IUpdateUserPermissionsAction['payload']): IUpdateUserPermissionsAction => ({ type: RepoActionType.UPDATE_USER_PERMISSIONS, payload })
export const setRepoPublic = (payload: ISetRepoPublicAction['payload']): ISetRepoPublicAction => ({ type: RepoActionType.SET_REPO_PUBLIC, payload })

export const initRepo = (payload: IInitRepoAction['payload']): IInitRepoAction => ({ type: RepoActionType.INIT_REPO, payload })

export const checkpointRepo = (payload: ICheckpointRepoAction['payload']): ICheckpointRepoAction => ({ type: RepoActionType.CHECKPOINT_REPO, payload })

export const cloneRepo = (payload: ICloneRepoAction['payload']): ICloneRepoAction => ({ type: RepoActionType.CLONE_REPO, payload })
export const cloneRepoProgress = (payload: ICloneRepoProgressAction['payload']): ICloneRepoProgressAction => ({ type: RepoActionType.CLONE_REPO_PROGRESS, payload })
export const cloneRepoSuccess = (payload: ICloneRepoSuccessAction['payload']): ICloneRepoSuccessAction => ({ type: RepoActionType.CLONE_REPO_SUCCESS, payload })
export const cloneRepoFailed = (payload: ICloneRepoFailedAction['payload']): ICloneRepoFailedAction => ({ type: RepoActionType.CLONE_REPO_FAILED, payload })

export const pullRepo = (payload: IPullRepoAction['payload']): IPullRepoAction => ({ type: RepoActionType.PULL_REPO, payload })
export const pullRepoProgress = (payload: IPullRepoProgressAction['payload']): IPullRepoProgressAction => ({ type: RepoActionType.PULL_REPO_PROGRESS, payload })
export const pullRepoSuccess = (payload: IPullRepoSuccessAction['payload']): IPullRepoSuccessAction => ({ type: RepoActionType.PULL_REPO_SUCCESS, payload })
export const pullRepoFailed = (payload: IPullRepoFailedAction['payload']): IPullRepoFailedAction => ({ type: RepoActionType.PULL_REPO_FAILED, payload })

export const watchRepo = (payload: IWatchRepoAction['payload']): IWatchRepoAction => ({ type: RepoActionType.WATCH_REPO, payload })
export const behindRemote = (payload: IBehindRemoteAction['payload']): IBehindRemoteAction => ({ type: RepoActionType.BEHIND_REMOTE, payload })
