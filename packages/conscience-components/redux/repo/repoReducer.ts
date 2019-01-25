import * as parseDiff from 'parse-diff'
import { RepoActionType, IRepoAction } from './repoActions'
import { IRepoFile, IRepoPermissions, ITimelineEvent, LocalURI } from 'conscience-lib/common'
import { uriToString } from 'conscience-lib/utils'

export const initialState = {
    repoListByUser: {},
    localRepoList: [],
    filesByURI: {},
    commitListsByURI: {},
    commits: {},
    localRefsByURI: {},
    remoteRefsByID: {},
    permissionsByID: {},
    diffsByCommitHash: {},
    failedToFetchByURI: {},
}

export interface IRepoState {
    repoListByUser: { [username: string]: string[] }
    localRepoList: LocalURI[]
    filesByURI: { [uri: string]: { [name: string]: IRepoFile } }
    commitListsByURI: { [uri: string]: string[] }
    commits: { [commitHash: string]: ITimelineEvent }
    localRefsByURI: { [uri: string]: { [name: string]: string } }
    remoteRefsByID: { [repoID: string]: { [name: string]: string } }
    permissionsByID: { [repoID: string]: IRepoPermissions }
    diffsByCommitHash: { [commit: string]: parseDiff.File[] }
    failedToFetchByURI: { [repoID: string]: boolean }
}

const repoReducer = (state: IRepoState = initialState, action: IRepoAction): IRepoState => {
    switch (action.type) {
        case RepoActionType.GET_REPO_LIST_SUCCESS: {
            const { username, repoList } = action.payload
            return {
                ...state,
                repoListByUser: {
                    ...state.repoListByUser,
                    [username]: repoList
                }
            }
        }

        case RepoActionType.FETCH_REPO_FILES_SUCCESS: {
            const { uri, files } = action.payload
            const uriStr = uriToString(uri)

            return {
                ...state,
                filesByURI: {
                    ...state.filesByURI,
                    [uriStr]: files
                }
            }
        }

        case RepoActionType.FETCH_REPO_TIMELINE_SUCCESS: {
            const { uri, timeline } = action.payload
            const uriStr = uriToString(uri)
            const commits = {} as { [commit: string]: ITimelineEvent }
            const commitList = [] as string[]
            for (let commit of timeline) {
                commits[commit.commit] = commit
                commitList.push(commit.commit)
            }
            return {
                ...state,
                commitListsByURI: {
                    ...state.commitListsByURI,
                    [uriStr]: commitList
                },
                commits: {
                    ...state.commits,
                    ...commits
                }
            }
        }

        case RepoActionType.FETCH_LOCAL_REFS_SUCCESS: {
            const { uri, localRefs } = action.payload
            const uriStr = uriToString(uri)
            return {
                ...state,
                localRefsByURI: {
                    ...state.localRefsByURI,
                    [uriStr]: localRefs,
                }
            }
        }

        case RepoActionType.FETCH_REMOTE_REFS_SUCCESS: {
            const { repoID, remoteRefs } = action.payload
            return {
                ...state,
                remoteRefsByID: {
                    ...state.remoteRefsByID,
                    [repoID]: remoteRefs,
                }
            }
        }

        case RepoActionType.FETCH_REPO_USERS_PERMISSIONS_SUCCESS:
        case RepoActionType.UPDATE_USER_PERMISSIONS_SUCCESS: {
            const { repoID, admins, pushers, pullers } = action.payload

            return {
                ...state,
                permissionsByID: {
                    ...state.permissionsByID,
                    [repoID]: {
                        admins: admins,
                        pushers: pushers,
                        pullers: pullers,
                    }
                }
            }
        }

        case RepoActionType.FETCH_FULL_REPO_FROM_SERVER_SUCCESS: {
            const { uri, repo } = action.payload
            const uriStr = uriToString(uri)
            return {
                ...state,
                filesByURI: {
                    ...state.filesByURI,
                    [uriStr]: repo.files || {}
                },
                commitListsByURI: {
                    ...state.commitListsByURI,
                    [uriStr]: repo.commitList || []
                },
                commits: {
                    ...state.commits,
                    ...repo.commits
                },
                permissionsByID: {
                    ...state.permissionsByID,
                    [repo.repoID]: {
                        admins: repo.admins || [],
                        pushers: repo.pushers || [],
                        pullers: repo.pullers || []
                    }
                }
            }
        }

        case RepoActionType.FETCH_FULL_REPO_FROM_SERVER_FAILED: {
            const { original } = action.payload
            const { uri } = original.payload
            return {
                ...state,
                failedToFetchByURI: {
                    ...state.failedToFetchByURI,
                    [uriToString(uri)]: true
                }
            }
        }

        case RepoActionType.GET_DIFF_SUCCESS: {
            const { commit, diff } = action.payload
            return {
                ...state,
                diffsByCommitHash: {
                    ...state.diffsByCommitHash,
                    [commit]: diff,
                }
            }
        }

        default:
            return state
    }
}

export default repoReducer

