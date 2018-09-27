import { IRepo, IRepoFile, ITimelineEvent } from '../../common'
import { FailedAction } from '../reduxUtils'

export enum RepoActionType {
    CREATE_REPO = 'CREATE_REPO',
    CREATE_REPO_SUCCESS = 'CREATE_REPO_SUCCESS',
    CREATE_REPO_FAILED = 'CREATE_REPO_FAILED',
    FETCH_REPOS = 'FETCH_REPOS',
    FETCHED_REPO = 'FETCHED_REPO',
    FETCH_FULL_REPO = 'FETCH_FULL_REPO',
    WATCH_REPO = 'WATCH_REPO',
    SELECT_REPO = 'SELECT_REPO',
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
    repoID: string
}

export interface ICreateRepoSuccessAction {
    type: RepoActionType.CREATE_REPO_SUCCESS
    repo: IRepo
}

export type ICreateRepoFailedAction = FailedAction<RepoActionType.CREATE_REPO_FAILED>

export interface IFetchReposAction {
    type: RepoActionType.FETCH_REPOS
}

export interface IFetchedReposAction {
    type: RepoActionType.FETCHED_REPO
    repo: IRepo
}

export interface IFetchFullRepoAction {
    type: RepoActionType.FETCH_FULL_REPO
    folderPath: string
    repoID: string
}

export interface ISelectRepoAction {
    type: RepoActionType.SELECT_REPO
    repo: IRepo
}

export interface IWatchRepoAction {
    type: RepoActionType.WATCH_REPO
    repoID: string
    folderPath: string
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
    IFetchReposAction |
    IFetchedReposAction |
    IFetchFullRepoAction |
    ISelectRepoAction |
    IWatchRepoAction |
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

export const createRepo = (params: { repoID: string }): ICreateRepoAction => ({ type: RepoActionType.CREATE_REPO, ...params })
export const fetchRepos = (): IFetchReposAction => ({ type: RepoActionType.FETCH_REPOS })
export const fetchedRepo = (params: { repo: IRepo }): IFetchedReposAction => ({ type: RepoActionType.FETCHED_REPO, ...params })
export const fetchFullRepo = (params: { repoID: string, folderPath: string }): IFetchFullRepoAction => ({ type: RepoActionType.FETCH_FULL_REPO, ...params })
export const watchRepo = (params: { repoID: string, folderPath: string }): IWatchRepoAction => ({ type: RepoActionType.WATCH_REPO, ...params })
export const selectRepo = (params: { repo: IRepo }): ISelectRepoAction => ({ type: RepoActionType.SELECT_REPO, ...params })
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

