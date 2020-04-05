import path from 'path'
import * as parseDiff from 'parse-diff'
import { RepoActionType, IRepoAction } from './repoActions'
import { OrgActionType, IOrgAction } from '../org/orgActions'
import { IRepoMetadata, IRepoFile, IRepoPermissions, ITimelineEvent, IUpdatedRefEvent, ISecuredTextInfo, LocalURI } from 'conscience-lib/common'
import { uriToString } from 'conscience-lib/utils'
import keyBy from 'lodash/keyBy'
import { ILongRunningOperationStatus } from 'conscience-lib/common'

export const initialState = {
    repoListByUserID: {},
    localRepoList: [],
    metadataByURI: {},
    filesByURI: {},
    filesAreDirtyByURI: {},
    commitListsByURI: {},
    commits: {},
    updatedRefEventsByCommit: {},
    securedFileInfoByURI: {},
    localRefsByURI: {},
    remoteRefsByID: {},
    permissionsByID: {},
    isPublicByID: {},
    diffsByCommitHash: {},
    isBehindRemoteByURI: {},

    checkpointOperationStatus: null,
}

export interface IRepoState {
    repoListByUserID: { [userID: string]: string[] }
    localRepoList: LocalURI[]
    metadataByURI: { [uri: string]: IRepoMetadata | null }
    filesByURI: { [uri: string]: { [name: string]: IRepoFile } }
    filesAreDirtyByURI: { [uri: string]: boolean }
    commitListsByURI: { [uri: string]: string[] }
    commits: { [commitHash: string]: ITimelineEvent }
    updatedRefEventsByCommit: { [commit: string]: IUpdatedRefEvent }
    securedFileInfoByURI: { [uriStr: string]: ISecuredTextInfo }
    localRefsByURI: { [uri: string]: { [name: string]: string } }
    remoteRefsByID: { [repoID: string]: { [name: string]: string } }
    permissionsByID: { [repoID: string]: IRepoPermissions }
    isPublicByID: { [repoID: string]: boolean }
    diffsByCommitHash: { [commit: string]: parseDiff.File[] }
    isBehindRemoteByURI: { [uri: string]: boolean }

    checkpointOperationStatus: null | ILongRunningOperationStatus
}

const repoReducer = (state: IRepoState = initialState, action: IRepoAction | IOrgAction): IRepoState => {
    switch (action.type) {
        case RepoActionType.GET_REPO_LIST_SUCCESS: {
            const { userID, repoList } = action.payload
            return {
                ...state,
                repoListByUserID: {
                    ...state.repoListByUserID,
                    [userID]: repoList
                }
            }
        }

        case RepoActionType.FETCH_REPO_METADATA_SUCCESS: {
            const { metadataByURI } = action.payload
            return {
                ...state,
                metadataByURI: {
                    ...state.metadataByURI,
                    ...metadataByURI
                }
            }
        }

        case RepoActionType.FETCH_REPO_FILES: {
            const { uri } = action.payload
            const uriStr = uriToString(uri)
            return {
                ...state,
                filesAreDirtyByURI: {
                    ...state.filesAreDirtyByURI,
                    [uriStr]: false
                }
            }
        }

        case RepoActionType.FETCH_REPO_FILES_SUCCESS: {
            const { uri, files } = action.payload
            const uriStr = uriToString(uri)
            addFolders(files)

            return {
                ...state,
                filesByURI: {
                    ...state.filesByURI,
                    [uriStr]: files
                }
            }
        }

        case RepoActionType.MARK_REPO_FILES_DIRTY: {
            const { uri } = action.payload
            const uriStr = uriToString(uri)

            return {
                ...state,
                filesAreDirtyByURI: {
                    ...state.filesAreDirtyByURI,
                    [uriStr]: true
                }
            }
        }

        case RepoActionType.FETCH_REPO_TIMELINE_SUCCESS: {
            let { uri, timeline } = action.payload

            const uriStr = uriToString(uri)
            const commits = {} as { [commit: string]: ITimelineEvent }
            const commitList = [] as string[]

            timeline = timeline.filter(e => !!e) // @@TODO: why do timeline events come back null sometimes?
            for (let commit of timeline) {
                commits[commit.commit] = commit
                commitList.push(commit.commit)
            }
            // if end of timeline, terminate commitList with blank string
            if (timeline.length == 0 || timeline[timeline.length - 1].isInitialCommit) {
                commitList.push("")
            }
            return {
                ...state,
                commitListsByURI: {
                    ...state.commitListsByURI,
                    [uriStr]: [
                        ...(state.commitListsByURI[uriStr] || []),
                        ...commitList
                    ]
                },
                commits: {
                    ...state.commits,
                    ...commits
                }
            }
        }

        case RepoActionType.BRING_TIMELINE_UP_TO_DATE_SUCCESS: {
            const { uri, toPrepend } = action.payload
            const uriStr = uriToString(uri)
            const commits = {} as { [commit: string]: ITimelineEvent }
            const commitList = [] as string[]
            for (let commit of toPrepend) {
                commits[commit.commit] = commit
                commitList.push(commit.commit)
            }
            // if end of timeline, terminate commitList with blank string
            if (toPrepend.length == 0 || toPrepend[toPrepend.length - 1].isInitialCommit) {
                commitList.push("")
            }
            return {
                ...state,
                commitListsByURI: {
                    ...state.commitListsByURI,
                    [uriStr]: [
                        ...commitList,
                        ...(state.commitListsByURI[uriStr] || []),
                    ]
                },
                commits: {
                    ...state.commits,
                    ...commits
                }
            }
        }

        case RepoActionType.FETCH_REPO_TIMELINE_EVENT_SUCCESS: {
            const { event } = action.payload
            return {
                ...state,
                commits: {
                    ...state.commits,
                    [event.commit]: event
                }
            }
        }

        case OrgActionType.FETCH_SHOWCASE_TIMELINE_SUCCESS: {
            const { timeline } = action.payload
            const commits = keyBy(timeline, 'commit')
            return {
                ...state,
                commits: {
                    ...state.commits,
                    ...commits
                }
            }
        }

        case RepoActionType.FETCH_SECURED_FILE_INFO_SUCCESS: {
            const { uri, securedFileInfo } = action.payload
            const uriStr = uriToString(uri)
            return {
                ...state,
                securedFileInfoByURI: {
                    ...state.securedFileInfoByURI,
                    [uriStr]: securedFileInfo
                }
            }
        }

        case RepoActionType.FETCH_IS_BEHIND_REMOTE_SUCCESS: {
            const { uri, isBehindRemote } = action.payload
            const uriStr = uriToString(uri)
            return {
                ...state,
                isBehindRemoteByURI: {
                    ...state.isBehindRemoteByURI,
                    [uriStr]: isBehindRemote,
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

        case RepoActionType.FETCH_REPO_USERS_PERMISSIONS_SUCCESS: {
            const { repoID, admins, pushers, pullers, isPublic } = action.payload
            return {
                ...state,
                permissionsByID: {
                    ...state.permissionsByID,
                    [repoID]: {
                        admins: admins,
                        pushers: pushers,
                        pullers: pullers,
                    }
                },
                isPublicByID: {
                    ...state.isPublicByID,
                    [repoID]: isPublic
                }
            }
        }

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

        case RepoActionType.SET_REPO_PUBLIC:
        case RepoActionType.SET_REPO_PUBLIC_SUCCESS: {
            const { repoID, isPublic } = action.payload
            return {
                ...state,
                isPublicByID: {
                    ...state.isPublicByID,
                    [repoID]: isPublic
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

        case RepoActionType.SET_CHECKPOINT_OPERATION_STATUS: {
            const { status } = action.payload
            return {
                ...state,
                checkpointOperationStatus: status,
            }
        }

        default:
            return state
    }
}

export default repoReducer

// Adds folders to a file list obtained from the backend server or from the node via RPC
function addFolders(files: { [name: string]: IRepoFile }) {
    for (let filepath of Object.keys(files)) {
        let dirname = path.dirname(filepath)
        if (dirname[0] === '/') {
            dirname = dirname.slice(1)
        }

        if (dirname === '.') {
            continue
        }

        const parts = dirname.split('/')
        for (let i = 0; i < parts.length; i++) {
            const partialDirname = parts.slice(0, i + 1).join('/')

            if (!files[partialDirname]) {
                const descendants = Object.keys(files).filter(filepath => filepath.startsWith(partialDirname) && files[filepath].type !== 'folder')
                let size = 0
                let modified: Date | null = null
                let status = ''
                for (let filepath of descendants) {
                    size += files[filepath].size
                    if (!modified || modified < files[filepath].modified) {
                        modified = files[filepath].modified
                    }

                    if (status !== 'M' && (files[filepath].status === 'M' || files[filepath].status === '?' || files[filepath].status === 'U')) {
                        status = 'M'
                    }
                }

                files[partialDirname] = {
                    name: partialDirname,
                    type: 'folder',
                    status,
                    size,
                    modified,
                    diff: '',
                    mergeConflict: false,
                    mergeUnresolved: false,
                    hash: '',
                    isChunked: false,
                } as IRepoFile
            }
        }
    }

    // Remove the fake '.' files inserted by the node to represent empty folders
    const allKeys = Object.keys(files)
    for (let filepath of allKeys) {
        if (path.basename(filepath) === '.') {
            delete files[filepath]
        }
    }
}
