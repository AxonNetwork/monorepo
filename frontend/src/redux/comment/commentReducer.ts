import { CommentActionType, ICommentAction } from './commentActions'
import { DiscussionActionType } from 'redux/discussion/discussionActions'
import { IComment } from '../../common'

const initialState = {
    comments: {},
}

export interface ICommentState {
    comments: {
        [repoID: string]: {
            [id: string]: IComment,
        },
    }
}

const commentReducer = (state: ICommentState = initialState, action: ICommentAction): ICommentState => {
    switch (action.type) {
        case CommentActionType.GET_COMMENTS_FOR_REPO_SUCCESS:
            return {
                ...state,
                comments: {
                    [action.payload.repoID]: {
                        ...(state.comments[action.payload.repoID] || {}),
                        ...action.payload.comments,
                    },
                },
            }

        case CommentActionType.CREATE_COMMENT_SUCCESS:
        case DiscussionActionType.CREATE_DISCUSSION_SUCCESS:
            const { comment } = action.payload
            const repoID = comment.repoID
            return {
                ...state,
                comments: {
                    [repoID]: {
                        ...(state.comments[repoID] || {}),
                        [`${comment.attachedTo.type}/${comment.attachedTo.subject}/${comment.created}`]: comment,
                    },
                },
            }


        default:
            return state
    }
}

export default commentReducer
