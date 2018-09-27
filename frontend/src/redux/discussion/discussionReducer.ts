import { DiscussionActionType, IDiscussionAction } from './discussionActions'
import { IDiscussion } from '../../common'

const initialState = {
    discussions: {},
    selected: null,
}

export interface IDiscussionState {
    discussions: {
        [repoID: string]: {
            [id: string]: IDiscussion
        }
    }
    selected: number | null
}

const discussionReducer = (state: IDiscussionState = initialState, action: IDiscussionAction): IDiscussionState => {
    switch (action.type) {
        case DiscussionActionType.GET_DISCUSSIONS_SUCCESS:
            const { repoID, discussions } = action.payload
            return {
                ...state,
                discussions: {
                    [repoID]: {
                        ...(state.discussions[repoID] || {}),
                        ...discussions,
                    }
                },
            }

        case DiscussionActionType.SELECT_DISCUSSION:
            return {
                ...state,
                selected: action.payload.created,
            }

        default:
            return state
    }
}

export default discussionReducer
