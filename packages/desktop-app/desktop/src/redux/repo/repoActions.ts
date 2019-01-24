import { IRepoFile, ITimelineEvent } from 'conscience-lib/common'
import { FailedAction } from 'conscience-components/redux/reduxUtils'
import { IRepoAction } from 'conscience-components/redux/repo/repoActions'

export enum DesktopRepoActionType {
    GET_LOCAL_REPOS = 'GET_LOCAL_REPOS',
    GET_LOCAL_REPOS_SUCCESS = 'GET_LOCAL_REPOS_SUCCESS',
    GET_LOCAL_REPOS_FAILED = 'GET_LOCAL_REPOS_FAILED',

    FETCH_FULL_REPO = 'FETCH_FULL_REPO',
    FETCH_FULL_REPO_SUCCESS = 'FETCH_FULL_REPO_SUCCESS',
    FETCH_FULL_REPO_FAILED = 'FETCH_FULL_REPO_FAILED',

    FETCH_REPO_FILES = 'FETCH_REPO_FILES',
    FETCH_REPO_FILES_SUCCESS = 'FETCH_REPO_FILES_SUCCESS',
    FETCH_REPO_FILES_FAILED = 'FETCH_REPO_FILES_FAILED',

    FETCH_REPO_TIMELINE = 'FETCH_REPO_TIMELINE',
    FETCH_REPO_TIMELINE_SUCCESS = 'FETCH_REPO_TIMELINE_SUCCESS',
    FETCH_REPO_TIMELINE_FAILED = 'FETCH_REPO_TIMELINE_FAILED',

    FETCH_REMOTE_REFS = 'FETCH_REMOTE_REFS',
    FETCH_REMOTE_REFS_SUCCESS = 'FETCH_REMOTE_REFS_SUCCESS',
    FETCH_REMOTE_REFS_FAILED = 'FETCH_REMOTE_REFS_FAILED',

    FETCH_LOCAL_REFS = 'FETCH_LOCAL_REFS',
    FETCH_LOCAL_REFS_SUCCESS = 'FETCH_LOCAL_REFS_SUCCESS',
    FETCH_LOCAL_REFS_FAILED = 'FETCH_LOCAL_REFS_FAILED',

    FETCH_REPO_USERS_PERMISSIONS = 'FETCH_REPO_USERS_PERMISSIONS',
    FETCH_REPO_USERS_PERMISSIONS_SUCCESS = 'FETCH_REPO_USERS_PERMISSIONS_SUCCESS',
    FETCH_REPO_USERS_PERMISSIONS_FAILED = 'FETCH_REPO_USERS_PERMISSIONS_FAILED',

    WATCH_REPO = 'WATCH_REPO',
    WATCH_REPO_SUCCESS = 'WATCH_REPO_SUCCESS',

    FETCHED_REPO = 'FETCHED_REPO',

    CHANGE_TIMELINE_PAGE = 'CHANGE_TIMELINE_PAGE',

    REVERT_FILES = 'REVERT_FILES',
    REVERT_FILES_SUCCESS = 'REVERT_FILES_SUCCESS',

    FETCHED_FILES = 'FETCHED_FILES',
    FETCHED_TIMELINE = 'FETCHED_TIMELINE',

    BEHIND_REMOTE = 'BEHIND_REMOTE',
}

export interface IGetLocalReposAction {
    type: DesktopRepoActionType.GET_LOCAL_REPOS
    payload: {}
}

export interface IGetLocalReposSuccessAction {
    type: DesktopRepoActionType.GET_LOCAL_REPOS_SUCCESS
    payload: {
        repos: {
            [path: string]: {
                repoID: string
                path: string,
            },
        },
    }
}

export type IGetLocalReposFailedAction = FailedAction<DesktopRepoActionType.GET_LOCAL_REPOS_FAILED>

export interface IFetchFullRepoAction {
    type: DesktopRepoActionType.FETCH_FULL_REPO
    payload: {
        path: string
        repoID: string,
    }
}

export interface IFetchFullRepoSuccessAction {
    type: DesktopRepoActionType.FETCH_FULL_REPO_SUCCESS
    payload: {
        path: string
        repoID: string,
    }
}

export type IFetchFullRepoFailedAction = FailedAction<DesktopRepoActionType.FETCH_FULL_REPO_FAILED>

export interface IFetchRepoFilesAction {
    type: DesktopRepoActionType.FETCH_REPO_FILES
    payload: {
        path: string
        repoID: string,
    }
}

export interface IFetchRepoFilesSuccessAction {
    type: DesktopRepoActionType.FETCH_REPO_FILES_SUCCESS
    payload: {
        path: string
        repoID: string
        files: { [path: string]: IRepoFile },
    }
}

export type IFetchRepoFilesFailedAction = FailedAction<DesktopRepoActionType.FETCH_REPO_FILES_FAILED>

export interface IFetchRepoTimelineAction {
    type: DesktopRepoActionType.FETCH_REPO_TIMELINE
    payload: {
        path: string
        repoID: string,
    }
}

export interface IFetchRepoTimelineSuccessAction {
    type: DesktopRepoActionType.FETCH_REPO_TIMELINE_SUCCESS
    payload: {
        path: string
        repoID: string
        timeline: ITimelineEvent[],
    }
}

export type IFetchRepoTimelineFailedAction = FailedAction<DesktopRepoActionType.FETCH_REPO_TIMELINE_FAILED>

export interface IFetchLocalRefsAction {
    type: DesktopRepoActionType.FETCH_LOCAL_REFS
    payload: {
        repoID: string
        path: string,
    }
}

export interface IFetchLocalRefsSuccessAction {
    type: DesktopRepoActionType.FETCH_LOCAL_REFS_SUCCESS
    payload: {
        path: string
        localRefs: { [name: string]: string },
    }
}

export type IFetchLocalRefsFailedAction = FailedAction<DesktopRepoActionType.FETCH_LOCAL_REFS_FAILED>

export interface IFetchRemoteRefsAction {
    type: DesktopRepoActionType.FETCH_REMOTE_REFS
    payload: {
        repoID: string,
    }
}

export interface IFetchRemoteRefsSuccessAction {
    type: DesktopRepoActionType.FETCH_REMOTE_REFS_SUCCESS
    payload: {
        repoID: string
        remoteRefs: { [name: string]: string },
    }
}

export type IFetchRemoteRefsFailedAction = FailedAction<DesktopRepoActionType.FETCH_REMOTE_REFS_FAILED>

export interface IFetchRepoUsersPermissionsAction {
    type: DesktopRepoActionType.FETCH_REPO_USERS_PERMISSIONS
    payload: {
        repoID: string,
    }
}

export interface IFetchRepoUsersPermissionsSuccessAction {
    type: DesktopRepoActionType.FETCH_REPO_USERS_PERMISSIONS_SUCCESS
    payload: {
        repoID: string
        admins: string[]
        pushers: string[]
        pullers: string[]
    }
}

export type IFetchRepoUsersPermissionsFailedAction = FailedAction<DesktopRepoActionType.FETCH_REPO_USERS_PERMISSIONS_FAILED>

export interface IWatchRepoAction {
    type: DesktopRepoActionType.WATCH_REPO
    payload: {
        repoID: string
        path: string,
    }
}

export interface IWatchRepoSuccessAction {
    type: DesktopRepoActionType.WATCH_REPO_SUCCESS
    payload: {}
}

export interface IRevertFilesAction {
    type: DesktopRepoActionType.REVERT_FILES
    payload: {
        repoRoot: string
        files: string
        commit: string,
    }
}

export interface IRevertFilesSuccessAction {
    type: DesktopRepoActionType.REVERT_FILES_SUCCESS
    payload: {}
}

export interface IBehindRemoteAction {
    type: DesktopRepoActionType.BEHIND_REMOTE
    payload: {
        path: string,
    }
}

export interface IChangeTimelinePageAction {
    type: DesktopRepoActionType.CHANGE_TIMELINE_PAGE
    payload: {
        repoID: string
        page: number,
    }
}


export type IDesktopRepoAction =
    IRepoAction |

    IGetLocalReposAction |
    IGetLocalReposSuccessAction |
    IGetLocalReposFailedAction |

    IFetchFullRepoAction |
    IFetchFullRepoSuccessAction |
    IFetchFullRepoFailedAction |

    IFetchRepoFilesAction |
    IFetchRepoFilesSuccessAction |
    IFetchRepoFilesFailedAction |

    IFetchRepoTimelineAction |
    IFetchRepoTimelineSuccessAction |
    IFetchRepoTimelineFailedAction |

    IFetchRepoUsersPermissionsAction |
    IFetchRepoUsersPermissionsSuccessAction |
    IFetchRepoUsersPermissionsFailedAction |

    IFetchRemoteRefsAction |
    IFetchRemoteRefsSuccessAction |
    IFetchRemoteRefsFailedAction |

    IWatchRepoAction |
    IWatchRepoSuccessAction |

    IRevertFilesAction |
    IRevertFilesSuccessAction |

    IChangeTimelinePageAction |

    IBehindRemoteAction

export const getLocalRepos = (payload: IGetLocalReposAction['payload'] = {}): IGetLocalReposAction => ({ type: DesktopRepoActionType.GET_LOCAL_REPOS, payload })
export const fetchFullRepo = (payload: IFetchFullRepoAction['payload']): IFetchFullRepoAction => ({ type: DesktopRepoActionType.FETCH_FULL_REPO, payload })
export const fetchRepoFiles = (payload: IFetchRepoFilesAction['payload']): IFetchRepoFilesAction => ({ type: DesktopRepoActionType.FETCH_REPO_FILES, payload })
export const fetchRepoTimeline = (payload: IFetchRepoTimelineAction['payload']): IFetchRepoTimelineAction => ({ type: DesktopRepoActionType.FETCH_REPO_TIMELINE, payload })
export const fetchRepoUsersPermissions = (payload: IFetchRepoUsersPermissionsAction['payload']): IFetchRepoUsersPermissionsAction => ({ type: DesktopRepoActionType.FETCH_REPO_USERS_PERMISSIONS, payload })
export const fetchLocalRefs = (payload: IFetchLocalRefsAction['payload']): IFetchLocalRefsAction => ({ type: DesktopRepoActionType.FETCH_LOCAL_REFS, payload })
export const fetchRemoteRefs = (payload: IFetchRemoteRefsAction['payload']): IFetchRemoteRefsAction => ({ type: DesktopRepoActionType.FETCH_REMOTE_REFS, payload })

export const watchRepo = (payload: IWatchRepoAction['payload']): IWatchRepoAction => ({ type: DesktopRepoActionType.WATCH_REPO, payload })

export const revertFiles = (payload: IRevertFilesAction['payload']): IRevertFilesAction => ({ type: DesktopRepoActionType.REVERT_FILES, payload })
export const behindRemote = (payload: IBehindRemoteAction['payload']): IBehindRemoteAction => ({ type: DesktopRepoActionType.BEHIND_REMOTE, payload })
export const changeTimelinePage = (payload: IChangeTimelinePageAction['payload']): IChangeTimelinePageAction => ({ type: DesktopRepoActionType.CHANGE_TIMELINE_PAGE, payload })

