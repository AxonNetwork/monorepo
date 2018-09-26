import { IComment, IDiscussion, IAttachedTo } from '../../common'

export enum DiscussionActionType {
    GET_DISCUSSIONS = 'GET_DISCUSSIONS',
    GET_DISCUSSIONS_SUCCESS = 'GET_DISCUSSIONS_SUCCESS',
    SELECT_DISCUSSION = 'SELECT_DISCUSSION',
    CREATE_DISCUSSION = 'CREATE_DISCUSSION',
    CREATE_COMMENT = 'CREATE_COMMENT',
}

export interface IGetDiscussionsAction {
    type: DiscussionActionType.GET_DISCUSSIONS
    repoID: string
}

export interface IGetDiscussionsSuccessAction {
    type: DiscussionActionType.GET_DISCUSSIONS_SUCCESS
    discussions: IDiscussion[]
    comments: IComment[]
}

export interface ISelectDiscussionAction {
    type: DiscussionActionType.SELECT_DISCUSSION
    created: number
}

export interface ICreateDiscussionAction {
    type: DiscussionActionType.CREATE_DISCUSSION
    repoID: string
    subject: string
    commentText: string
}

export interface ICreateCommentAction {
    type: DiscussionActionType.CREATE_COMMENT
    repoID: string
    text: string
    attachedTo: IAttachedTo
    user: string
}

export type IDiscussionAction =
    IGetDiscussionsAction |
    IGetDiscussionsSuccessAction |
    ISelectDiscussionAction |
    ICreateDiscussionAction |
    ICreateCommentAction

export const getDiscussions = (params: { repoID: string }): IGetDiscussionsAction => ({ type: DiscussionActionType.GET_DISCUSSIONS, ...params })
export const getDiscussionsSuccess = (params: { discussions: IDiscussion[], comments: IComment[] }): IGetDiscussionsSuccessAction => ({ type: DiscussionActionType.GET_DISCUSSIONS_SUCCESS, ...params })
export const selectDiscussion = (params: { created: number }): ISelectDiscussionAction => ({ type: DiscussionActionType.SELECT_DISCUSSION, ...params })
export const createDiscussion = (params: { repoID: string, subject: string, commentText: string }): ICreateDiscussionAction => ({ type: DiscussionActionType.CREATE_DISCUSSION, ...params })
export const createComment = (params: { repoID: string, text: string, attachedTo: IAttachedTo, user: string }): ICreateCommentAction => ({ type: DiscussionActionType.CREATE_COMMENT, ...params })
