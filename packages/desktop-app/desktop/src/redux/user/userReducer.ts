import pickBy from 'lodash/pickBy'
import userReducer, { IUserState, initialState } from 'conscience-components/redux/user/userReducer'
import { UserActionType, IUserAction } from 'conscience-components/redux/user/userActions'
import { IDesktopUserAction } from './userActions'
import { ISharedRepoInfo } from 'conscience-lib/common'

const desktopInitialState = {
    ...initialState,
    nodeUsername: undefined,
    sharedRepos: {},
}

declare module 'conscience-components/redux/user/userReducer' {
    export interface IUserState {
        nodeUsername: string | undefined
        sharedRepos: { [repoID: string]: ISharedRepoInfo }
    }
}

const desktopUserReducer = (state: IUserState, action: IDesktopUserAction): IUserState => {
    switch (action.type) {
        case UserActionType.CHECK_NODE_USER_FAILED:
            return {
                ...state,
                checkedLoggedIn: true,
            }

        case UserActionType.GOT_NODE_USERNAME:
            return {
                ...state,
                nodeUsername: action.payload.username,
            }

        case UserActionType.FETCH_SHARED_REPOS_SUCCESS: {
            const { sharedRepos } = action.payload
            return {
                ...state,
                sharedRepos,
            }
        }

        case UserActionType.IGNORE_SHARED_REPO_SUCCESS: {
            const { repoID } = action.payload
            return {
                ...state,
                sharedRepos: {
                    [repoID]: { repoID, ignored: true },
                },
            }
        }

        case UserActionType.UNSHARE_REPO_FROM_SELF_SUCCESS: {
            const { repoID } = action.payload
            const sharedRepos = state.sharedRepos
            const updated = pickBy(
                sharedRepos,
                r => r.repoID !== repoID
            )
            return {
                ...state,
                sharedRepos: updated
            }
        }

        case UserActionType.READ_LOCAL_CONFIG_SUCCESS: {
            const { config } = action.payload
            return {
                ...state,
                userSettings: {
                    codeColorScheme: config.codeColorScheme || 'pojoaque',
                    menuLabelsHidden: config.menuLabelsHidden || false,
                    fileExtensionsHidden: config.fileExtensionsHidden || false,
                    newestViewedCommentTimestamp: config.newestViewedCommentTimestamp || {},
                },
            }
        }

        case UserActionType.SET_LOCAL_CONFIG_SUCCESS: {
            const { config } = action.payload
            return {
                ...state,
                userSettings: {
                    ...state.userSettings,
                    ...config,
                },
            }
        }

        case UserActionType.ADDED_ORG: {
            const { userID, orgID } = action.payload
            return {
                ...state,
                users: {
                    ...state.users,
                    [userID]: {
                        ...(state.users[userID] || {}),
                        orgs: [
                            ...((state.users[userID] || {}).orgs || []),
                            orgID,
                        ],
                    },
                },
            }

        }

        default:
            return state
    }
}

export default function(state: IUserState = desktopInitialState, action: IDesktopUserAction): IUserState {
    state = userReducer(state, action as IUserAction)
    state = desktopUserReducer(state, action)
    return state
}
