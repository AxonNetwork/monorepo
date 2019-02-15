import values from 'lodash/values'
import sortedUniq from 'lodash/sortedUniq'
import { OrgActionType, IOrgAction } from './orgActions'
import { IOrganization, IOrgBlog } from 'conscience-lib/common'

const initialState = {
    orgs: {},
    blogs: {},
}

export interface IOrgState {
    orgs: { [orgID: string]: IOrganization }
    blogs: {
        [orgID: string]: {
            map: { [created: string]: IOrgBlog }
            sortedIDs: number[],
        },

    }
}

const orgReducer = (state: IOrgState = initialState, action: IOrgAction): IOrgState => {
    switch (action.type) {

        case OrgActionType.CREATE_ORG_SUCCESS: {
            const { org } = action.payload
            return {
                ...state,
                orgs: {
                    ...state.orgs,
                    [org.orgID]: org,
                },
            }
        }

        case OrgActionType.FETCH_ORG_INFO_SUCCESS:
        case OrgActionType.UPDATE_ORG_SUCCESS: {
            const { org } = action.payload
            return {
                ...state,
                orgs: {
                    ...state.orgs,
                    [org.orgID]: org,
                },
            }
        }

        case OrgActionType.UPLOAD_ORG_PICTURE_SUCCESS: {
            const { orgID, picture } = action.payload
            return {
                ...state,
                orgs: {
                    ...state.orgs,
                    [orgID]: {
                        ...state.orgs[orgID],
                        picture: picture,
                    },
                },
            }
        }

        case OrgActionType.UPLOAD_ORG_BANNER_SUCCESS: {
            const { orgID, banner } = action.payload
            return {
                ...state,
                orgs: {
                    ...state.orgs,
                    [orgID]: {
                        ...state.orgs[orgID],
                        banner: banner,
                    },
                },
            }
        }

        case OrgActionType.ADD_MEMBER_TO_ORG_SUCCESS: {
            const { orgID, userID } = action.payload
            return {
                ...state,
                orgs: {
                    ...state.orgs,
                    [orgID]: {
                        ...state.orgs[orgID],
                        members: [
                            ...state.orgs[orgID].members,
                            userID,
                        ],
                    },
                },
            }
        }

        case OrgActionType.REMOVE_MEMBER_FROM_ORG_SUCCESS: {
            const { orgID, userID } = action.payload
            const updatedMembers = state.orgs[orgID].members
                .filter((id: string) => id !== userID)
            return {
                ...state,
                orgs: {
                    ...state.orgs,
                    [orgID]: {
                        ...state.orgs[orgID],
                        members: updatedMembers,
                    },
                },
            }
        }

        case OrgActionType.ADD_REPO_TO_ORG_SUCCESS: {
            const { orgID, repoID } = action.payload
            return {
                ...state,
                orgs: {
                    ...state.orgs,
                    [orgID]: {
                        ...state.orgs[orgID],
                        repos: [
                            ...state.orgs[orgID].repos,
                            repoID,
                        ],
                    },
                },
            }
        }

        case OrgActionType.REMOVE_REPO_FROM_ORG_SUCCESS: {
            const { orgID, repoID } = action.payload
            const updatedRepos = state.orgs[orgID].repos
                .filter((id: string) => id !== repoID)
            return {
                ...state,
                orgs: {
                    ...state.orgs,
                    [orgID]: {
                        ...state.orgs[orgID],
                        repos: updatedRepos,
                    },
                },
            }
        }

        case OrgActionType.CHANGE_ORG_FEATURED_REPOS_SUCCESS: {
            const { orgID, featuredRepos } = action.payload
            return {
                ...state,
                orgs: {
                    ...state.orgs,
                    [orgID]: {
                        ...state.orgs[orgID],
                        featuredRepos: featuredRepos,
                    },
                },
            }
        }

        case OrgActionType.FETCH_ORG_BLOGS_SUCCESS: {
            const { orgID, blogs } = action.payload
            const existingIDs = (state.blogs[orgID] || {}).sortedIDs || []
            const newIDs = values(blogs).map(b => b.created)
            const sortedIDs = sortedUniq(existingIDs.concat(newIDs).sort()).reverse()
            return {
                ...state,
                blogs: {
                    ...state.blogs,
                    [orgID]: {
                        ...state.blogs[orgID],
                        map: {
                            ...(state.blogs[orgID] || {}).map,
                            ...blogs,
                        },
                        sortedIDs,
                    },
                },
            }
        }

        case OrgActionType.CREATE_ORG_BLOG_SUCCESS: {
            const { blog } = action.payload
            const { orgID } = blog
            const sortedIDs = (state.blogs[orgID] || {}).sortedIDs || []
            sortedIDs.unshift(blog.created)
            return {
                ...state,
                blogs: {
                    ...state.blogs,
                    [orgID]: {
                        ...state.blogs[orgID],
                        map: {
                            ...(state.blogs[orgID] || {}).map,
                            [`${blog.created}`]: blog,
                        },
                        sortedIDs,
                    },
                },
            }
        }

        case OrgActionType.UPDATE_ORG_COLORS_SUCCESS: {
            const { orgID, primaryColor, secondaryColor } = action.payload
            console.log('22222222222222', action)
            return {
                ...state,
                orgs: {
                    ...state.orgs,
                    [orgID]: {
                        ...state.orgs[orgID],
                        primaryColor: primaryColor,
                        secondaryColor: secondaryColor
                    },
                }
            }
        }
    }
    return state
}

export default orgReducer