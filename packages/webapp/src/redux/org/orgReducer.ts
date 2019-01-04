import { OrgActionType, IOrgAction } from './orgActions'
import { IOrganization } from 'conscience-lib/common'

const initialState = {
    orgs: {},
}

export interface IOrgState {
    orgs: {[orgID: string]: IOrganization}
}

const orgReducer = (state: IOrgState = initialState, action: IOrgAction): IOrgState => {
    switch(action.type){

        case OrgActionType.CREATE_ORG_SUCCESS: {
            const { org } = action.payload
            return {
                ...state,
                orgs: {
                    ...state.orgs,
                    [org.orgID]: org
                }
            }
        }

        case OrgActionType.FETCH_ORG_INFO_SUCCESS:
        case OrgActionType.UPDATE_ORG_SUCCESS: {
            const { org } = action.payload
            return {
                ...state,
                orgs:{
                    ...state.orgs,
                    [org.orgID]: org
                }
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
                        picture: picture
                    }
                }
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
                        banner: banner
                    }
                }
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
                            userID
                        ]
                    }
                }
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
                        members: updatedMembers
                    }
                }
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
                            repoID
                        ]
                    }
                }
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
                        repos: updatedRepos
                    }
                }
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
                        featuredRepos: featuredRepos
                    }
                }
            }

        }

    }
    return state
}

export default orgReducer