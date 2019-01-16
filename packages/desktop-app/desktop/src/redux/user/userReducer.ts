import { fromPairs } from 'lodash'
import { UserActionType, IUserAction } from './userActions'
import { IUser, ISharedRepoInfo } from 'conscience-lib/common'
import { pickBy } from 'lodash'

const initialState = {
    users: {},
    usersByEmail: {},

    currentUser: undefined,
    nodeUsername: undefined,
    sharedRepos: {},
    checkedLocalUser: false,
    userSettings: {
        codeColorScheme: 'pojoaque',
        menuLabelsHidden: false,
        fileExtensionsHidden: false,
        newestViewedCommentTimestamp: {},
    },

    error: undefined,
}

export interface IUserState {
    users: { [userID: string]: IUser }
    usersByEmail: { [email: string]: string } // value is userID

    currentUser: string | undefined
    nodeUsername: string | undefined
    sharedRepos: { [repoID: string]: ISharedRepoInfo }
    userSettings: {
        codeColorScheme: string | undefined
        menuLabelsHidden: boolean
        fileExtensionsHidden: boolean
        newestViewedCommentTimestamp: {
            [repoID: string]: {
                [discussionID: string]: number,
            },
        },
    }
    checkedLocalUser: boolean
    error: Error | undefined
}

const userReducer = (state: IUserState = initialState, action: IUserAction): IUserState => {
    switch (action.type) {
        case UserActionType.LOGIN_SUCCESS:
        case UserActionType.SIGNUP_SUCCESS:
        case UserActionType.CHECK_NODE_USER_SUCCESS:
            const { userID, emails, name, username, picture } = action.payload
            const user = state.users[userID] || {
                userID,
                emails,
                name,
                username,
                picture,
                repos: [],
            }
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
                currentUser: userID,
                checkedLocalUser: true,
            }

        case UserActionType.CHECK_NODE_USER_FAILED:
            return {
                ...state,
                checkedLocalUser: true,
            }

        case UserActionType.GOT_NODE_USERNAME:
            return {
                ...state,
                nodeUsername: action.payload.username,
            }

        case UserActionType.FETCH_USER_DATA_SUCCESS: {
            const { users } = action.payload
            const usersByEmail = {} as { [email: string]: string }
            for (let userID of Object.keys(users)) {
                for (let email of (users[userID].emails || [])) {
                    usersByEmail[email] = userID
                }
            }

            return {
                ...state,
                users: {
                    ...state.users,
                    ...action.payload.users,
                },
                usersByEmail: {
                    ...state.usersByEmail,
                    ...usersByEmail,
                },
            }
        }

        case UserActionType.FETCH_USER_DATA_BY_EMAIL_SUCCESS:
            return {
                ...state,
                users: {
                    ...state.users,
                    ...action.payload.users,
                },
                usersByEmail: {
                    ...state.usersByEmail,
                    ...action.payload.usersByEmail,
                },
            }

        case UserActionType.LOGIN_FAILED:
        case UserActionType.SIGNUP_FAILED:
            return {
                ...state,
                error: action.payload,
                currentUser: undefined,
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

        case UserActionType.FETCH_ORGS_SUCCESS: {
            const { userID, orgs } = action.payload
            return {
                ...state,
                users: {
                    ...state.users,
                    [userID]: {
                        ...state.users[userID],
                        orgs: orgs,
                    },
                },
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

        case UserActionType.LOGOUT_SUCCESS: {
            return {
                ...state,
                currentUser: undefined,
            }
        }

        case UserActionType.SAW_COMMENT_SUCCESS: {
            const { repoID, discussionID, commentTimestamp } = action.payload
            return {
                ...state,
                userSettings: {
                    ...state.userSettings,
                    newestViewedCommentTimestamp: {
                        ...state.userSettings.newestViewedCommentTimestamp,
                        [repoID]: {
                            ...(state.userSettings.newestViewedCommentTimestamp[repoID] || {}),
                            [discussionID]: commentTimestamp,
                        },
                    },
                },
            }
        }

        case UserActionType.UPLOAD_USER_PICTURE_SUCCESS: {
            const { picture, userID } = action.payload
            return {
                ...state,
                users: {
                    ...state.users,
                    [userID]: {
                        ...(state.users[userID] || {}),
                        picture,
                    },
                },
            }
        }

        case UserActionType.MODIFY_USER_EMAIL_SUCCESS: {
            const { userID, email, add } = action.payload
            return {
                ...state,
                users: {
                    ...state.users,
                    [userID]: {
                        ...(state.users[userID] || {}),
                        emails: add ? ((state.users[userID] || {}).emails || []).concat(email) : ((state.users[userID] || {}).emails || []).filter(x => x !== email),
                    },
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

export default userReducer
