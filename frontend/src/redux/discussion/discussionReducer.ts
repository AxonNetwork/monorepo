import { DiscussionActionType, IDiscussionAction } from './discussionActions'
import { IDiscussion, IComment } from '../../common'

const initialState = {
    discussions: [],
    comments: [],
    selected: undefined,
}

export interface IDiscussionState {
    discussions: IDiscussion[]
    comments: IComment[]
    selected: number | undefined
}

const discussionReducer = (state: IDiscussionState = initialState, action: IDiscussionAction): IDiscussionState => {
    switch (action.type) {
        case DiscussionActionType.GET_DISCUSSIONS_SUCCESS:
            return {
                ...state,
                discussions: action.discussions,
                comments: action.comments
            }

        case DiscussionActionType.SELECT_DISCUSSION:
            return {
                ...state,
                selected: action.created
            }

        case DiscussionActionType.CREATE_COMMENT:
            return {
                ...state,
                comments: [
                    ...state.comments,
                    {
                        attachedTo: action.attachedTo,
                        repoID: action.repoID,
                        text: action.text,
                        user: action.user,
                        created: new Date().getTime(),
                    }
                ]
            }

        default:
            return state
    }
}

export default discussionReducer
