import path from 'path'
import * as parseDiff from 'parse-diff'
import { RepoActionType, IRepoAction } from './repoActions'
import { IRepoMetadata, IRepoFile, IRepoPermissions, ITimelineEvent, IUpdatedRefEvent, ISecuredTextInfo, LocalURI } from 'conscience-lib/common'
import { uriToString, fileURIToString } from 'conscience-lib/utils'

export const initialState = {
    repoListByUserID: {},
    localRepoList: [],
    metadataByURI: {},
    filesByURI: {},
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
}

export interface IRepoState {
    repoListByUserID: { [userID: string]: string[] }
    localRepoList: LocalURI[]
    metadataByURI: { [uri: string]: IRepoMetadata | null }
    filesByURI: { [uri: string]: { [name: string]: IRepoFile } }
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
}

const repoReducer = (state: IRepoState = initialState, action: IRepoAction): IRepoState => {
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

        case RepoActionType.FETCH_REPO_TIMELINE_SUCCESS: {
            const { uri, timeline } = action.payload
            const uriStr = uriToString(uri)
            const commits = {} as { [commit: string]: ITimelineEvent }
            const commitList = [] as string[]
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

        case RepoActionType.FETCH_UPDATED_REF_EVENTS_SUCCESS: {
            const { updatedRefEvents } = action.payload
            return {
                ...state,
                updatedRefEventsByCommit: {
                    ...state.updatedRefEventsByCommit,
                    ...updatedRefEvents
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
                } as IRepoFile
            }
        }
    }
}
