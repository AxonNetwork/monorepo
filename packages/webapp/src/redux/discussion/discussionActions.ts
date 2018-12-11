import { FailedAction } from '../reduxUtils'
import { IDiscussion, IComment } from 'conscience-lib/common'

export enum DiscussionActionType {
    GET_DISCUSSIONS = 'GET_DISCUSSIONS',
    GET_DISCUSSIONS_SUCCESS = 'GET_DISCUSSIONS_SUCCESS',
    GET_DISCUSSIONS_FAILED = 'GET_DISCUSSIONS_FAILED',

    CREATE_DISCUSSION = 'CREATE_DISCUSSION',
    CREATE_DISCUSSION_SUCCESS = 'CREATE_DISCUSSION_SUCCESS',
    CREATE_DISCUSSION_FAILED = 'CREATE_DISCUSSION_FAILED',

    GET_COMMENTS_FOR_DISCUSSION = 'GET_COMMENTS_FOR_DISCUSSION',
    GET_COMMENTS_FOR_DISCUSSION_SUCCESS = 'GET_COMMENTS_FOR_DISCUSSION_SUCCESS',
    GET_COMMENTS_FOR_DISCUSSION_FAILED = 'GET_COMMENTS_FOR_DISCUSSION_FAILED',

    CREATE_COMMENT = 'CREATE_COMMENT',
    CREATE_COMMENT_SUCCESS = 'CREATE_COMMENT_SUCCESS',
    CREATE_COMMENT_FAILED = 'CREATE_COMMENT_FAILED',
}

export interface IGetDiscussionsAction {
    type: DiscussionActionType.GET_DISCUSSIONS
    payload: {
        repoID: string,
    }
}

export interface IGetDiscussionsSuccessAction {
    type: DiscussionActionType.GET_DISCUSSIONS_SUCCESS
    payload: {
        repoID: string
        discussions: {[discussionID: string]: IDiscussion},
    }
}

export type IGetDiscussionsFailedAction = FailedAction<DiscussionActionType.GET_DISCUSSIONS_FAILED>

export interface ICreateDiscussionAction {
    type: DiscussionActionType.CREATE_DISCUSSION
    payload: {
        repoID: string
        subject: string
        commentText: string,
    }
}

export interface ICreateDiscussionSuccessAction {
    type: DiscussionActionType.CREATE_DISCUSSION_SUCCESS
    payload: {
        discussion: IDiscussion,
        comment: IComment,
    }
}

export type ICreateDiscussionFailedAction = FailedAction<DiscussionActionType.CREATE_DISCUSSION_FAILED>

export interface IGetCommentsForDiscussionAction {
    type: DiscussionActionType.GET_COMMENTS_FOR_DISCUSSION
    payload: {
        discussionID: string,
    }
}

export interface IGetCommentsForDiscussionSuccessAction {
    type: DiscussionActionType.GET_COMMENTS_FOR_DISCUSSION_SUCCESS
    payload: {
        discussionID: string
        comments: {[commentID: string]: IComment},
    }
}

export type IGetCommentsForDiscussionFailedAction = FailedAction<DiscussionActionType.GET_COMMENTS_FOR_DISCUSSION_FAILED>

export interface ICreateCommentAction {
    type: DiscussionActionType.CREATE_COMMENT
    payload: {
        repoID: string
        discussionID: string
        text: string
        callback: (error?: Error) => void,
    }
}

export interface ICreateCommentSuccessAction {
    type: DiscussionActionType.CREATE_COMMENT_SUCCESS
    payload: {
        comment: IComment,
    }
}

export type ICreateCommentFailedAction = FailedAction<DiscussionActionType.CREATE_COMMENT_FAILED>

export type IDiscussionAction =
    IGetDiscussionsAction |
    IGetDiscussionsSuccessAction |
    IGetDiscussionsFailedAction |

    ICreateDiscussionAction |
    ICreateDiscussionSuccessAction |
    ICreateDiscussionFailedAction |

    IGetCommentsForDiscussionAction |
    IGetCommentsForDiscussionSuccessAction |
    IGetCommentsForDiscussionFailedAction |

    ICreateCommentAction |
    ICreateCommentSuccessAction |
    ICreateCommentFailedAction

export const getDiscussions = (payload: IGetDiscussionsAction['payload']): IGetDiscussionsAction => ({ type: DiscussionActionType.GET_DISCUSSIONS, payload })
export const createDiscussion = (payload: ICreateDiscussionAction['payload']): ICreateDiscussionAction => ({ type: DiscussionActionType.CREATE_DISCUSSION, payload })

export const getCommentsForDiscussion = (payload: IGetCommentsForDiscussionAction['payload']): IGetCommentsForDiscussionAction => ({ type: DiscussionActionType.GET_COMMENTS_FOR_DISCUSSION, payload })
export const createComment = (payload: ICreateCommentAction['payload']): ICreateCommentAction => ({ type: DiscussionActionType.CREATE_COMMENT, payload })


