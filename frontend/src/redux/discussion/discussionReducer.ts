import { DiscussionActionType, IDiscussionAction } from './discussionActions'
import { IDiscussion } from '../../common'

const initialState = {
    discussions: {},
    selected: undefined,
}

export interface IDiscussionState {
    discussions: {
        [repoID: string]: {
            [created: number]: IDiscussion,
        },
    }
    selected: number | undefined
}

const discussionReducer = (state: IDiscussionState = initialState, action: IDiscussionAction): IDiscussionState => {
    switch (action.type) {
        case DiscussionActionType.CREATE_DISCUSSION_SUCCESS: {
            const { discussion } = action.payload
            return {
                ...state,
                discussions: {
                    [discussion.repoID]: {
                        ...(state.discussions[discussion.repoID] || {}),
                        [discussion.created]: discussion,
                    },
                },
            }
        }

        case DiscussionActionType.GET_DISCUSSIONS_SUCCESS: {
            const { repoID, discussions } = action.payload
            return {
                ...state,
                discussions: {
                    [repoID]: {
                        ...(state.discussions[repoID] || {}),
                        ...discussions,
                    },
                },
            }
        }

        case DiscussionActionType.SELECT_DISCUSSION: {
            return {
                ...state,
                selected: action.payload.created,
            }
        }

        default:
            return state
    }
}

export default discussionReducer
