import { IRepo, IRepoFile, ITimelineEvent } from '../../common'
import { FailedAction } from '../reduxUtils'

export enum RepoActionType {
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

    FETCHED_REPO = 'FETCHED_REPO',
    WATCH_REPO = 'WATCH_REPO',
    WATCH_REPO_SUCCESS = 'WATCH_REPO_SUCCESS',

    SELECT_REPO = 'SELECT_REPO',
    SELECT_REPO_SUCCESS = 'SELECT_REPO_SUCCESS',

    CHECKPOINT_REPO = 'CHECKPOINT_REPO',
    PULL_REPO = 'PULL_REPO',
    SELECT_FILE = 'SELECT_FILE',
    ADD_COLLABORATOR = 'ADD_COLLABORATOR',
    ADD_COLLABORATOR_SUCCESS = 'ADD_COLLABORATOR_SUCCESS',
    ADD_HYPOTHESIS = 'ADD_HYPOTHESIS',
    GET_DIFF = 'GET_DIFF',
    GET_DIFF_SUCCESS = 'GET_DIFF_SUCCESS',
    REVERT_FILES = 'REVERT_FILES',
    REVERT_FILES_SUCCESS = 'REVERT_FILES_SUCCESS',
    FETCHED_FILES = 'FETCHED_FILES',
    FETCHED_TIMELINE = 'FETCHED_TIMELINE',
    BEHIND_REMOTE = 'BEHIND_REMOTE',
}

export interface ICreateRepoAction {
    type: RepoActionType.CREATE_REPO
    payload: {
        repoID: string
    }
}

export interface ICreateRepoSuccessAction {
    type: RepoActionType.CREATE_REPO_SUCCESS
    payload: {
        repoID: string
        path: string
    }
}

export type ICreateRepoFailedAction = FailedAction<RepoActionType.CREATE_REPO_FAILED>

export interface IGetLocalReposAction {
    type: RepoActionType.GET_LOCAL_REPOS
    payload: {}
}

export interface IGetLocalReposSuccessAction {
    type: RepoActionType.GET_LOCAL_REPOS_SUCCESS
    payload: {
        repos: {
            [path: string]: {
                repoID: string
                path: string
            }
        }
    }
}

export type IGetLocalReposFailedAction = FailedAction<RepoActionType.GET_LOCAL_REPOS_FAILED>

export interface IFetchFullRepoAction {
    type: RepoActionType.FETCH_FULL_REPO
    payload: {
        path: string
        repoID: string
    }
}

export interface IFetchFullRepoSuccessAction {
    type: RepoActionType.FETCH_FULL_REPO_SUCCESS
    payload: {}
}

export type IFetchFullRepoFailedAction = FailedAction<RepoActionType.FETCH_FULL_REPO_FAILED>

export interface IFetchRepoFilesAction {
    type: RepoActionType.FETCH_REPO_FILES
    payload: {
        path: string
        repoID: string
    }
}

export interface IFetchRepoFilesSuccessAction {
    type: RepoActionType.FETCH_REPO_FILES_SUCCESS
    payload: {
        repoID: string
        path: string
        files: IRepoFile[]
    }
}

export type IFetchRepoFilesFailedAction = FailedAction<RepoActionType.FETCH_REPO_FILES_FAILED>

export interface IFetchRepoTimelineAction {
    type: RepoActionType.FETCH_REPO_TIMELINE
    payload: {
        path: string
        repoID: string
    }
}

export interface IFetchRepoTimelineSuccessAction {
    type: RepoActionType.FETCH_REPO_TIMELINE_SUCCESS
    payload: {
        path: string
        repoID: string
        timeline: ITimelineEvent[]
    }
}

export type IFetchRepoTimelineFailedAction = FailedAction<RepoActionType.FETCH_REPO_TIMELINE_FAILED>

export interface IFetchLocalRefsAction {
    type: RepoActionType.FETCH_LOCAL_REFS
    payload: {
        repoID: string
        path: string
    }
}

export interface IFetchLocalRefsSuccessAction {
    type: RepoActionType.FETCH_LOCAL_REFS_SUCCESS
    payload: {
        path: string
        localRefs: {[name: string]: string}
    }
}

export type IFetchLocalRefsFailedAction = FailedAction<RepoActionType.FETCH_LOCAL_REFS_FAILED>

export interface IFetchRemoteRefsAction {
    type: RepoActionType.FETCH_REMOTE_REFS
    payload: {
        repoID: string
    }
}

export interface IFetchRemoteRefsSuccessAction {
    type: RepoActionType.FETCH_REMOTE_REFS_SUCCESS
    payload: {
        repoID: string
        remoteRefs: {[name: string]: string}
    }
}

export type IFetchRemoteRefsFailedAction = FailedAction<RepoActionType.FETCH_REMOTE_REFS_FAILED>

export interface IFetchRepoSharedUsersAction {
    type: RepoActionType.FETCH_REPO_SHARED_USERS
    payload: {
        repoID: string
    }
}

export interface IFetchRepoSharedUsersSuccessAction {
    type: RepoActionType.FETCH_REPO_SHARED_USERS_SUCCESS
    payload: {
        repoID: string
        sharedUsers: string[]
    }
}

export type IFetchRepoSharedUsersFailedAction = FailedAction<RepoActionType.FETCH_REPO_SHARED_USERS_FAILED>

export interface ISelectRepoAction {
    type: RepoActionType.SELECT_REPO
    payload: {
        repoID: string
        path: string
    }
}

export interface ISelectRepoSuccessAction {
    type: RepoActionType.SELECT_REPO_SUCCESS
    payload: {}
}

export interface IWatchRepoAction {
    type: RepoActionType.WATCH_REPO
    payload: {
        repoID: string
        path: string
    }
}

export interface IWatchRepoSuccessAction {
    type: RepoActionType.WATCH_REPO_SUCCESS
    payload: {}
}

export interface ICheckpointRepoAction {
    type: RepoActionType.CHECKPOINT_REPO
    folderPath: string
    repoID: string
    message: string
}

export interface IPullRepoAction {
    type: RepoActionType.PULL_REPO
    folderPath: string
    repoID: string
}

export interface ISelectFileAction {
    type: RepoActionType.SELECT_FILE
    file: string
    isFolder: boolean
}

export interface IAddCollaboratorAction {
    type: RepoActionType.ADD_COLLABORATOR
    folderPath: string
    repoID: string
    email: string
}

export interface IAddCollaboratorSuccessAction {
    type: RepoActionType.ADD_COLLABORATOR_SUCCESS
    folderPath: string
    repoID: string
    email: string
}

export interface IAddHypothesisAction {
    type: RepoActionType.ADD_HYPOTHESIS
    folderPath: string
    hypothesis: string
}

export interface IGetDiffAction {
    type: RepoActionType.GET_DIFF
    folderPath: string
    filename: string
    commit: string
}

export interface IGetDiffSuccessAction {
    type: RepoActionType.GET_DIFF_SUCCESS
    diff: string
    folderPath: string
    filename: string
    commit: string
}

export interface IRevertFilesAction {
    type: RepoActionType.REVERT_FILES
    folderPath: string
    files: string
    commit: string
}

export interface IRevertFilesSuccessAction {
    type: RepoActionType.REVERT_FILES_SUCCESS
    folderPath: string
    filename: string
}

export interface IFetchedFilesAction {
    type: RepoActionType.FETCHED_FILES
    folderPath: string
    files: IRepoFile[]
}

export interface IFetchedTimelineAction {
    type: RepoActionType.FETCHED_TIMELINE
    folderPath: string
    timeline: ITimelineEvent[]
}

export interface ISetIsBehindRemoteAction {
    type: RepoActionType.BEHIND_REMOTE
    folderPath: string
}

export type IRepoAction =
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
    IWatchRepoAction |
    IWatchRepoSuccessAction |

    ISelectRepoAction |
    ICheckpointRepoAction |
    IPullRepoAction |
    ISelectFileAction |
    IAddCollaboratorAction |
    IAddCollaboratorSuccessAction |
    IAddHypothesisAction |
    IGetDiffAction |
    IGetDiffSuccessAction |
    IRevertFilesAction |
    IRevertFilesSuccessAction |
    IFetchedFilesAction |
    IFetchedTimelineAction |
    ISetIsBehindRemoteAction

export const createRepo = (payload: ICreateRepoAction['payload']): ICreateRepoAction => ({ type: RepoActionType.CREATE_REPO, payload })
export const getLocalRepos = (payload: IGetLocalReposAction['payload'] = {}): IGetLocalReposAction => ({ type: RepoActionType.GET_LOCAL_REPOS, payload })
export const fetchFullRepo = (payload: IFetchFullRepoAction['payload']): IFetchFullRepoAction => ({ type: RepoActionType.FETCH_FULL_REPO, payload })
export const fetchRepoFiles = (payload: IFetchRepoFilesAction['payload']): IFetchRepoFilesAction => ({ type: RepoActionType.FETCH_REPO_FILES, payload })
export const fetchRepoTimeline = (payload: IFetchRepoTimelineAction['payload']): IFetchRepoTimelineAction => ({ type: RepoActionType.FETCH_REPO_TIMELINE, payload })
export const fetchRepoSharedUsers = (payload: IFetchRepoSharedUsersAction['payload']): IFetchRepoSharedUsersAction => ({ type: RepoActionType.FETCH_REPO_SHARED_USERS, payload })
export const fetchLocalRefs = (payload: IFetchLocalRefsAction['payload']): IFetchLocalRefsAction => ({ type: RepoActionType.FETCH_LOCAL_REFS, payload })
export const fetchRemoteRefs = (payload: IFetchRemoteRefsAction['payload']): IFetchRemoteRefsAction => ({ type: RepoActionType.FETCH_REMOTE_REFS, payload })

export const selectRepo = (payload: ISelectRepoAction['payload']): ISelectRepoAction => ({ type: RepoActionType.SELECT_REPO, payload })

export const watchRepo = (payload: IWatchRepoAction['payload']): IWatchRepoAction => ({ type: RepoActionType.WATCH_REPO, payload })
export const checkpointRepo = (params: { folderPath: string, repoID: string, message: string }): ICheckpointRepoAction => ({ type: RepoActionType.CHECKPOINT_REPO, ...params })
export const pullRepo = (params: { folderPath: string, repoID: string }): IPullRepoAction => ({ type: RepoActionType.PULL_REPO, ...params })
export const selectFile = (params: { file: string, isFolder: boolean }): ISelectFileAction => {
    console.log(params)
    return{ type: RepoActionType.SELECT_FILE, ...params }
}
export const addCollaborator = (params: { folderPath: string, repoID: string, email: string }): IAddCollaboratorAction => ({ type: RepoActionType.ADD_COLLABORATOR, ...params })
export const addHypothesis = (params: { folderPath: string, hypothesis: string }): IAddHypothesisAction => ({ type: RepoActionType.ADD_HYPOTHESIS, ...params })
export const getDiff = (params: { folderPath: string, filename: string, commit: string }): IGetDiffAction => ({ type: RepoActionType.GET_DIFF, ...params })
export const revertFiles = (params: { folderPath: string, files: string, commit: string }): IRevertFilesAction => ({ type: RepoActionType.REVERT_FILES, ...params })
export const fetchedFiles = (params: { folderPath: string, files: IRepoFile[] }): IFetchedFilesAction => ({ type: RepoActionType.FETCHED_FILES, ...params })
export const fetchedTimeline = (params: { folderPath: string, timeline: ITimelineEvent[] }): IFetchedTimelineAction => ({ type: RepoActionType.FETCHED_TIMELINE, ...params })
export const setIsBehindRemote = (params: { folderPath: string }): ISetIsBehindRemoteAction => ({ type: RepoActionType.BEHIND_REMOTE, ...params })

