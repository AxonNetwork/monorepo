import { FailedAction } from '../reduxUtils'
import { IDiscussion, IComment, URI } from 'conscience-lib/common'

export enum DiscussionActionType {
    GET_DISCUSSIONS = 'GET_DISCUSSIONS',
    GET_DISCUSSIONS_SUCCESS = 'GET_DISCUSSIONS_SUCCESS',
    GET_DISCUSSIONS_FAILED = 'GET_DISCUSSIONS_FAILED',

    GET_DISCUSSIONS_FOR_REPO = 'GET_DISCUSSIONS_FOR_REPO',
    GET_DISCUSSIONS_FOR_REPO_SUCCESS = 'GET_DISCUSSIONS_FOR_REPO_SUCCESS',
    GET_DISCUSSIONS_FOR_REPO_FAILED = 'GET_DISCUSSIONS_FOR_REPO_FAILED',

    CREATE_DISCUSSION = 'CREATE_DISCUSSION',
    CREATE_DISCUSSION_SUCCESS = 'CREATE_DISCUSSION_SUCCESS',
    CREATE_DISCUSSION_FAILED = 'CREATE_DISCUSSION_FAILED',

    GET_COMMENTS = 'GET_COMMENTS',
    GET_COMMENTS_SUCCESS = 'GET_COMMENTS_SUCCESS',
    GET_COMMENTS_FAILED = 'GET_COMMENTS_FAILED',

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
        discussionIDs: string[]
    }
}

export interface IGetDiscussionsSuccessAction {
    type: DiscussionActionType.GET_DISCUSSIONS_SUCCESS
    payload: {
        discussions: { [discussionID: string]: IDiscussion }
    }
}

export type IGetDiscussionsFailedAction = FailedAction<DiscussionActionType.GET_DISCUSSIONS_FAILED>

export interface IGetDiscussionsForRepoAction {
    type: DiscussionActionType.GET_DISCUSSIONS_FOR_REPO
    payload: {
        uri: URI
    }
}

export interface IGetDiscussionsForRepoSuccessAction {
    type: DiscussionActionType.GET_DISCUSSIONS_FOR_REPO_SUCCESS
    payload: {
        repoID: string
        discussions: { [discussionID: string]: IDiscussion }
    }
}

export type IGetDiscussionsForRepoFailedAction = FailedAction<DiscussionActionType.GET_DISCUSSIONS_FOR_REPO_FAILED>

export interface ICreateDiscussionAction {
    type: DiscussionActionType.CREATE_DISCUSSION
    payload: {
        uri: URI
        subject: string
        commentText: string
    }
}

export interface ICreateDiscussionSuccessAction {
    type: DiscussionActionType.CREATE_DISCUSSION_SUCCESS
    payload: {
        discussion: IDiscussion
        comment: IComment
    }
}

export type ICreateDiscussionFailedAction = FailedAction<DiscussionActionType.CREATE_DISCUSSION_FAILED>

export interface IGetCommentsAction {
    type: DiscussionActionType.GET_COMMENTS
    payload: {
        commentIDs: string[]
    }
}

export interface IGetCommentsSuccessAction {
    type: DiscussionActionType.GET_COMMENTS_SUCCESS
    payload: {
        comments: { [commentID: string]: IComment }
    }
}

export type IGetCommentsFailedAction = FailedAction<DiscussionActionType.GET_COMMENTS_FAILED>

export interface IGetCommentsForDiscussionAction {
    type: DiscussionActionType.GET_COMMENTS_FOR_DISCUSSION
    payload: {
        discussionID: string
    }
}

export interface IGetCommentsForDiscussionSuccessAction {
    type: DiscussionActionType.GET_COMMENTS_FOR_DISCUSSION_SUCCESS
    payload: {
        discussionID: string
        comments: { [commentID: string]: IComment }
    }
}

export type IGetCommentsForDiscussionFailedAction = FailedAction<DiscussionActionType.GET_COMMENTS_FOR_DISCUSSION_FAILED>

export interface ICreateCommentAction {
    type: DiscussionActionType.CREATE_COMMENT
    payload: {
        uri: URI
        discussionID: string
        text: string
        callback: (error?: Error) => void
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

    IGetDiscussionsForRepoAction |
    IGetDiscussionsForRepoSuccessAction |
    IGetDiscussionsForRepoFailedAction |

    ICreateDiscussionAction |
    ICreateDiscussionSuccessAction |
    ICreateDiscussionFailedAction |

    IGetCommentsAction |
    IGetCommentsSuccessAction |
    IGetCommentsFailedAction |

    IGetCommentsForDiscussionAction |
    IGetCommentsForDiscussionSuccessAction |
    IGetCommentsForDiscussionFailedAction |

    ICreateCommentAction |
    ICreateCommentSuccessAction |
    ICreateCommentFailedAction

export const getDiscussions = (payload: IGetDiscussionsAction['payload']): IGetDiscussionsAction => ({ type: DiscussionActionType.GET_DISCUSSIONS, payload })
export const getDiscussionsForRepo = (payload: IGetDiscussionsForRepoAction['payload']): IGetDiscussionsForRepoAction => ({ type: DiscussionActionType.GET_DISCUSSIONS_FOR_REPO, payload })
export const createDiscussion = (payload: ICreateDiscussionAction['payload']): ICreateDiscussionAction => ({ type: DiscussionActionType.CREATE_DISCUSSION, payload })

export const getComments = (payload: IGetCommentsAction['payload']): IGetCommentsAction => ({ type: DiscussionActionType.GET_COMMENTS, payload })
export const getCommentsForDiscussion = (payload: IGetCommentsForDiscussionAction['payload']): IGetCommentsForDiscussionAction => ({ type: DiscussionActionType.GET_COMMENTS_FOR_DISCUSSION, payload })
export const createComment = (payload: ICreateCommentAction['payload']): ICreateCommentAction => ({ type: DiscussionActionType.CREATE_COMMENT, payload })


