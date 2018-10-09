import { FailedAction } from '../reduxUtils'
import { IDiscussion, IComment, IAttachedTo } from '../../common'

export enum DiscussionActionType {
    GET_DISCUSSIONS = 'GET_DISCUSSIONS',
    GET_DISCUSSIONS_SUCCESS = 'GET_DISCUSSIONS_SUCCESS',
    GET_DISCUSSIONS_FAILED = 'GET_DISCUSSIONS_FAILED',
    SELECT_DISCUSSION = 'SELECT_DISCUSSION',
    CREATE_DISCUSSION = 'CREATE_DISCUSSION',
    CREATE_DISCUSSION_SUCCESS = 'CREATE_DISCUSSION_SUCCESS',
    CREATE_DISCUSSION_FAILED = 'CREATE_DISCUSSION_FAILED',

    GET_COMMENTS_FOR_REPO = 'GET_COMMENTS_FOR_REPO',
    GET_COMMENTS_FOR_REPO_SUCCESS = 'GET_COMMENTS_FOR_REPO_SUCCESS',
    GET_COMMENTS_FOR_REPO_FAILED = 'GET_COMMENTS_FOR_REPO_FAILED',
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
        discussions: {[id: string]: IDiscussion},
    }
}

export type IGetDiscussionsFailedAction = FailedAction<DiscussionActionType.GET_DISCUSSIONS_FAILED>

export interface ISelectDiscussionAction {
    type: DiscussionActionType.SELECT_DISCUSSION
    payload: {
        created: number | undefined,
    }
}

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

export interface IGetCommentsForRepoAction {
    type: DiscussionActionType.GET_COMMENTS_FOR_REPO
    payload: {
        repoID: string,
    }
}

export interface IGetCommentsForRepoSuccessAction {
    type: DiscussionActionType.GET_COMMENTS_FOR_REPO_SUCCESS
    payload: {
        repoID: string
        comments: {[id: string]: IComment},
    }
}

export type IGetCommentsForRepoFailedAction = FailedAction<DiscussionActionType.GET_COMMENTS_FOR_REPO_FAILED>

export interface ICreateCommentAction {
    type: DiscussionActionType.CREATE_COMMENT
    payload: {
        repoID: string
        text: string
        attachedTo: IAttachedTo,
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
    ISelectDiscussionAction |
    ICreateDiscussionAction |
    ICreateDiscussionSuccessAction |
    ICreateDiscussionFailedAction |
    IGetCommentsForRepoAction |
    IGetCommentsForRepoSuccessAction |
    IGetCommentsForRepoFailedAction |
    ICreateCommentAction |
    ICreateCommentSuccessAction |
    ICreateCommentFailedAction

export const getDiscussions = (payload: IGetDiscussionsAction['payload']): IGetDiscussionsAction => ({ type: DiscussionActionType.GET_DISCUSSIONS, payload })
export const selectDiscussion = (payload: ISelectDiscussionAction['payload']): ISelectDiscussionAction => ({ type: DiscussionActionType.SELECT_DISCUSSION, payload })
export const createDiscussion = (payload: ICreateDiscussionAction['payload']): ICreateDiscussionAction => ({ type: DiscussionActionType.CREATE_DISCUSSION, payload })

export const getCommentsForRepo = (payload: IGetCommentsForRepoAction['payload']): IGetCommentsForRepoAction => ({ type: DiscussionActionType.GET_COMMENTS_FOR_REPO, payload })
export const createComment = (payload: ICreateCommentAction['payload']): ICreateCommentAction => ({ type: DiscussionActionType.CREATE_COMMENT, payload })


