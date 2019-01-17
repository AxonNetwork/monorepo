import { IRepoFile, ITimelineEvent } from 'conscience-lib/common'
import { FailedAction } from 'conscience-components/redux/reduxUtils'
import { IRepoAction } from 'conscience-components/redux/repo/repoActions'

export enum DesktopRepoActionType {
    CREATE_REPO = 'CREATE_REPO',
    CREATE_REPO_SUCCESS = 'CREATE_REPO_SUCCESS',
    CREATE_REPO_FAILED = 'CREATE_REPO_FAILED',

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

    FETCH_REPO_SHARED_USERS = 'FETCH_REPO_SHARED_USERS',
    FETCH_REPO_SHARED_USERS_SUCCESS = 'FETCH_REPO_SHARED_USERS_SUCCESS',
    FETCH_REPO_SHARED_USERS_FAILED = 'FETCH_REPO_SHARED_USERS_FAILED',

    WATCH_REPO = 'WATCH_REPO',
    WATCH_REPO_SUCCESS = 'WATCH_REPO_SUCCESS',

    SELECT_REPO = 'SELECT_REPO',
    SELECT_REPO_SUCCESS = 'SELECT_REPO_SUCCESS',

    SELECT_FILE = 'SELECT_FILE',
    SELECT_COMMIT = 'SELECT_COMMIT',

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

    NAVIGATE_REPO_PAGE = 'NAVIGATE_REPO_PAGE',

    FETCHED_REPO = 'FETCHED_REPO',

    CHANGE_TIMELINE_PAGE = 'CHANGE_TIMELINE_PAGE',

    REVERT_FILES = 'REVERT_FILES',
    REVERT_FILES_SUCCESS = 'REVERT_FILES_SUCCESS',

    FETCHED_FILES = 'FETCHED_FILES',
    FETCHED_TIMELINE = 'FETCHED_TIMELINE',

    BEHIND_REMOTE = 'BEHIND_REMOTE',
}

export interface ICreateRepoAction {
    type: DesktopRepoActionType.CREATE_REPO
    payload: {
        repoID: string
        orgID: string,
    }
}

export interface ICreateRepoSuccessAction {
    type: DesktopRepoActionType.CREATE_REPO_SUCCESS
    payload: {
        repoID: string
        path: string
        orgID: string,
    }
}

export type ICreateRepoFailedAction = FailedAction<DesktopRepoActionType.CREATE_REPO_FAILED>

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

export interface IFetchRepoSharedUsersAction {
    type: DesktopRepoActionType.FETCH_REPO_SHARED_USERS
    payload: {
        path: string
        repoID: string,
    }
}

export interface IFetchRepoSharedUsersSuccessAction {
    type: DesktopRepoActionType.FETCH_REPO_SHARED_USERS_SUCCESS
    payload: {
        path: string
        repoID: string
        sharedUsers: string[],
    }
}

export type IFetchRepoSharedUsersFailedAction = FailedAction<DesktopRepoActionType.FETCH_REPO_SHARED_USERS_FAILED>

export interface ISelectRepoAction {
    type: DesktopRepoActionType.SELECT_REPO
    payload: {
        repoID: string
        path: string,
    }
}

export interface ISelectRepoSuccessAction {
    type: DesktopRepoActionType.SELECT_REPO_SUCCESS
    payload: {
        repoID: string
        path: string,
    }
}

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

export interface INavigateRepoPageAction {
    type: DesktopRepoActionType.NAVIGATE_REPO_PAGE,
    payload: {
        repoPage: RepoPage,
    }
}

export interface ICheckpointRepoAction {
    type: DesktopRepoActionType.CHECKPOINT_REPO
    payload: {
        folderPath: string
        repoID: string
        message: string,
    }
}

export interface ICheckpointRepoSuccessAction {
    type: DesktopRepoActionType.CHECKPOINT_REPO_SUCCESS
    payload: {}
}

export type ICheckpointRepoFailedAction = FailedAction<DesktopRepoActionType.CHECKPOINT_REPO_FAILED>

export interface ICloneRepoAction {
    type: DesktopRepoActionType.CLONE_REPO
    payload: {
        repoID: string,
    }
}

export interface ICloneRepoProgressAction {
    type: DesktopRepoActionType.CLONE_REPO_PROGRESS
    payload: {
        repoID: string,
        toFetch: number,
        fetched: number,
    }
}

export interface ICloneRepoSuccessAction {
    type: DesktopRepoActionType.CLONE_REPO_SUCCESS
    payload: {}
}

export type ICloneRepoFailedAction = FailedAction<DesktopRepoActionType.CLONE_REPO_FAILED>

export interface IPullRepoAction {
    type: DesktopRepoActionType.PULL_REPO
    payload: {
        folderPath: string
        repoID: string,
    }
}

export interface IPullRepoProgressAction {
    type: DesktopRepoActionType.PULL_REPO_PROGRESS
    payload: {
        folderPath: string
        toFetch: number
        fetched: number
    }
}

export interface IPullRepoSuccessAction {
    type: DesktopRepoActionType.PULL_REPO_SUCCESS
    payload: {
        folderPath: string,
    }
}

export type IPullRepoFailedAction = FailedAction<DesktopRepoActionType.PULL_REPO_FAILED>

export interface ISelectFileAction {
    type: DesktopRepoActionType.SELECT_FILE
    payload: {
        selectedFile: {
            file: string
            isFolder: boolean
            mode: FileMode
            defaultEditorContents?: string,
        } | undefined,
    }
}

export interface ISelectCommitAction {
    type: DesktopRepoActionType.SELECT_COMMIT
    payload: {
        selectedCommit: string | undefined,
    }
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

    ICreateRepoAction |
    ICreateRepoSuccessAction |
    ICreateRepoFailedAction |

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

    IFetchRepoSharedUsersAction |
    IFetchRepoSharedUsersSuccessAction |
    IFetchRepoSharedUsersFailedAction |

    IFetchRemoteRefsAction |
    IFetchRemoteRefsSuccessAction |
    IFetchRemoteRefsFailedAction |

    ISelectRepoAction |
    ISelectRepoSuccessAction |

    IWatchRepoAction |
    IWatchRepoSuccessAction |

    ISelectFileAction |
    ISelectCommitAction |

    INavigateRepoPageAction |

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

    IRevertFilesAction |
    IRevertFilesSuccessAction |

    IChangeTimelinePageAction |

    IBehindRemoteAction

export const createRepo = (payload: ICreateRepoAction['payload']): ICreateRepoAction => ({ type: DesktopRepoActionType.CREATE_REPO, payload })
export const getLocalRepos = (payload: IGetLocalReposAction['payload'] = {}): IGetLocalReposAction => ({ type: DesktopRepoActionType.GET_LOCAL_REPOS, payload })
export const fetchFullRepo = (payload: IFetchFullRepoAction['payload']): IFetchFullRepoAction => ({ type: DesktopRepoActionType.FETCH_FULL_REPO, payload })
export const fetchRepoFiles = (payload: IFetchRepoFilesAction['payload']): IFetchRepoFilesAction => ({ type: DesktopRepoActionType.FETCH_REPO_FILES, payload })
export const fetchRepoTimeline = (payload: IFetchRepoTimelineAction['payload']): IFetchRepoTimelineAction => ({ type: DesktopRepoActionType.FETCH_REPO_TIMELINE, payload })
export const fetchRepoSharedUsers = (payload: IFetchRepoSharedUsersAction['payload']): IFetchRepoSharedUsersAction => ({ type: DesktopRepoActionType.FETCH_REPO_SHARED_USERS, payload })
export const fetchLocalRefs = (payload: IFetchLocalRefsAction['payload']): IFetchLocalRefsAction => ({ type: DesktopRepoActionType.FETCH_LOCAL_REFS, payload })
export const fetchRemoteRefs = (payload: IFetchRemoteRefsAction['payload']): IFetchRemoteRefsAction => ({ type: DesktopRepoActionType.FETCH_REMOTE_REFS, payload })

export const selectRepo = (payload: ISelectRepoAction['payload']): ISelectRepoAction => ({ type: DesktopRepoActionType.SELECT_REPO, payload })
export const selectFile = (payload: ISelectFileAction['payload']): ISelectFileAction => ({ type: DesktopRepoActionType.SELECT_FILE, payload })
export const selectCommit = (payload: ISelectCommitAction['payload']): ISelectCommitAction => ({ type: DesktopRepoActionType.SELECT_COMMIT, payload })
export const navigateRepoPage = (payload: INavigateRepoPageAction['payload']): INavigateRepoPageAction => ({ type: DesktopRepoActionType.NAVIGATE_REPO_PAGE, payload })
export const watchRepo = (payload: IWatchRepoAction['payload']): IWatchRepoAction => ({ type: DesktopRepoActionType.WATCH_REPO, payload })
export const checkpointRepo = (payload: ICheckpointRepoAction['payload']): ICheckpointRepoAction => ({ type: DesktopRepoActionType.CHECKPOINT_REPO, payload })
export const cloneRepo = (payload: ICloneRepoAction['payload']): ICloneRepoAction => ({ type: DesktopRepoActionType.CLONE_REPO, payload })
export const cloneRepoProgress = (payload: ICloneRepoProgressAction['payload']): ICloneRepoProgressAction => ({ type: DesktopRepoActionType.CLONE_REPO_PROGRESS, payload })
export const pullRepo = (payload: IPullRepoAction['payload']): IPullRepoAction => ({ type: DesktopRepoActionType.PULL_REPO, payload })
export const pullRepoProgress = (payload: IPullRepoProgressAction['payload']): IPullRepoProgressAction => ({ type: DesktopRepoActionType.PULL_REPO_PROGRESS, payload })
export const pullRepoSuccess = (payload: IPullRepoSuccessAction['payload']): IPullRepoSuccessAction => ({ type: DesktopRepoActionType.PULL_REPO_SUCCESS, payload })
export const revertFiles = (payload: IRevertFilesAction['payload']): IRevertFilesAction => ({ type: DesktopRepoActionType.REVERT_FILES, payload })
export const behindRemote = (payload: IBehindRemoteAction['payload']): IBehindRemoteAction => ({ type: DesktopRepoActionType.BEHIND_REMOTE, payload })
export const changeTimelinePage = (payload: IChangeTimelinePageAction['payload']): IChangeTimelinePageAction => ({ type: DesktopRepoActionType.CHANGE_TIMELINE_PAGE, payload })

