import pickBy from 'lodash/pickBy'
import fromPairs from 'lodash/fromPairs'
import userReducer, { IUserState, initialState } from 'conscience-components/redux/user/userReducer'
import { UserActionType, IUserAction } from 'conscience-components/redux/user/userActions'
import { DesktopUserActionType, IDesktopUserAction } from './userActions'

export enum AutoUpdateState {
    Checking,
    Downloading,
    Downloaded,
    NoUpdate,
}

const desktopInitialState = {
    ...initialState,
    nodeUsername: undefined,

    autoUpdateState: AutoUpdateState.Checking,
}

declare module 'conscience-components/redux/user/userReducer' {
    export interface IUserState {
        nodeUsername: string | undefined
        autoUpdateState: AutoUpdateState
    }
}

const desktopUserReducer = (state: IUserState, action: IDesktopUserAction): IUserState => {
    switch (action.type) {
        case DesktopUserActionType.CHECK_NODE_USER_SUCCESS: {
            const user = action.payload
            const { userID, emails } = user
            const usersByEmail = fromPairs(emails.map(email => [email, userID]))
            return {
                ...state,
                users: {
                    ...state.users,
                    [userID]: user,
                },
                usersByEmail: {
                    ...state.usersByEmail,
                    ...usersByEmail,
                },
                usersByUsername: {
                    ...state.usersByUsername,
                    [user.username]: userID,
                },
                currentUser: userID,
                checkedLoggedIn: true,
            }
        }
        case DesktopUserActionType.CHECK_NODE_USER_FAILED:
            return {
                ...state,
                checkedLoggedIn: true,
            }

        case DesktopUserActionType.GOT_NODE_USERNAME:
            return {
                ...state,
                nodeUsername: action.payload.username,
            }

        case DesktopUserActionType.FETCH_SHARED_REPOS_SUCCESS: {
            const { sharedRepos } = action.payload
            return {
                ...state,
                sharedRepos,
            }
        }

        case DesktopUserActionType.IGNORE_SHARED_REPO_SUCCESS: {
            const { repoID } = action.payload
            return {
                ...state,
                sharedRepos: {
                    [repoID]: { repoID, ignored: true },
                },
            }
        }

        case DesktopUserActionType.UNSHARE_REPO_FROM_SELF_SUCCESS: {
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

        case DesktopUserActionType.READ_LOCAL_CONFIG_SUCCESS: {
            const { config } = action.payload
            return {
                ...state,
                userSettings: {
                    codeColorScheme: config.codeColorScheme || 'pojoaque',
                    menuLabelsHidden: config.menuLabelsHidden || false,
                    fileExtensionsHidden: config.fileExtensionsHidden || false,
                    manualChunking: config.manualChunking || false,
                    newestViewedCommentTimestamp: config.newestViewedCommentTimestamp || {},
                },
            }
        }

        case DesktopUserActionType.SET_LOCAL_CONFIG_SUCCESS: {
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

        case DesktopUserActionType.SET_AUTOUPDATE_STATE: {
            return {
                ...state,
                autoUpdateState: action.payload.state,
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
