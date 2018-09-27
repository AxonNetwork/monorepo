import { FailedAction } from '../reduxUtils'
import { IComment, IAttachedTo } from '../../common'

export enum CommentActionType {
    GET_COMMENTS_FOR_REPO = 'GET_COMMENTS_FOR_REPO',
    GET_COMMENTS_FOR_REPO_SUCCESS = 'GET_COMMENTS_FOR_REPO_SUCCESS',
    GET_COMMENTS_FOR_REPO_FAILED = 'GET_COMMENTS_FOR_REPO_FAILED',
    CREATE_COMMENT = 'CREATE_COMMENT',
    CREATE_COMMENT_SUCCESS = 'CREATE_COMMENT_SUCCESS',
    CREATE_COMMENT_FAILED = 'CREATE_COMMENT_FAILED',
}

export interface IGetCommentsForRepoAction {
    type: CommentActionType.GET_COMMENTS_FOR_REPO
    payload: {
        repoID: string
    }
}

export interface IGetCommentsForRepoSuccessAction {
    type: CommentActionType.GET_COMMENTS_FOR_REPO_SUCCESS
    payload: {
        repoID: string
        comments: {[id: string]: IComment}
    }
}

export type IGetCommentsForRepoFailedAction = FailedAction<CommentActionType.GET_COMMENTS_FOR_REPO_FAILED>

export interface ICreateCommentAction {
    type: CommentActionType.CREATE_COMMENT
    payload: {
        repoID: string
        text: string
        attachedTo: IAttachedTo
    }
}

export interface ICreateCommentSuccessAction {
    type: CommentActionType.CREATE_COMMENT_SUCCESS
    payload: {
        comment: IComment
    }
}

export type ICreateCommentFailedAction = FailedAction<CommentActionType.CREATE_COMMENT_FAILED>

export type ICommentAction =
    IGetCommentsForRepoAction |
    IGetCommentsForRepoSuccessAction |
    IGetCommentsForRepoFailedAction |
    ICreateCommentAction |
    ICreateCommentSuccessAction |
    ICreateCommentFailedAction

export const getComments = (payload: IGetCommentsForRepoAction['payload']): IGetCommentsForRepoAction => ({ type: CommentActionType.GET_COMMENTS_FOR_REPO, payload })
export const createComment = (payload: ICreateCommentAction['payload']): ICreateCommentAction => ({ type: CommentActionType.CREATE_COMMENT, payload })
