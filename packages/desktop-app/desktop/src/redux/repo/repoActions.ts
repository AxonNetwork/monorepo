import { FailedAction } from 'conscience-components/redux/reduxUtils'
import { IRepoAction } from 'conscience-components/redux/repo/repoActions'

export enum DesktopRepoActionType {
    GET_LOCAL_REPOS = 'GET_LOCAL_REPOS',
    GET_LOCAL_REPOS_SUCCESS = 'GET_LOCAL_REPOS_SUCCESS',
    GET_LOCAL_REPOS_FAILED = 'GET_LOCAL_REPOS_FAILED',

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

    IWatchRepoAction |
    IWatchRepoSuccessAction |

    IRevertFilesAction |
    IRevertFilesSuccessAction |

    IChangeTimelinePageAction |

    IBehindRemoteAction

export const getLocalRepos = (payload: IGetLocalReposAction['payload'] = {}): IGetLocalReposAction => ({ type: DesktopRepoActionType.GET_LOCAL_REPOS, payload })

export const watchRepo = (payload: IWatchRepoAction['payload']): IWatchRepoAction => ({ type: DesktopRepoActionType.WATCH_REPO, payload })

export const revertFiles = (payload: IRevertFilesAction['payload']): IRevertFilesAction => ({ type: DesktopRepoActionType.REVERT_FILES, payload })
export const behindRemote = (payload: IBehindRemoteAction['payload']): IBehindRemoteAction => ({ type: DesktopRepoActionType.BEHIND_REMOTE, payload })
export const changeTimelinePage = (payload: IChangeTimelinePageAction['payload']): IChangeTimelinePageAction => ({ type: DesktopRepoActionType.CHANGE_TIMELINE_PAGE, payload })

