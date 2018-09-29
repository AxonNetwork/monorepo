import { FailedAction } from '../reduxUtils'
import { IDiscussion } from '../../common'

export enum DiscussionActionType {
    GET_DISCUSSIONS = 'GET_DISCUSSIONS',
    GET_DISCUSSIONS_SUCCESS = 'GET_DISCUSSIONS_SUCCESS',
    GET_DISCUSSIONS_FAILED = 'GET_DISCUSSIONS_FAILED',
    SELECT_DISCUSSION = 'SELECT_DISCUSSION',
    CREATE_DISCUSSION = 'CREATE_DISCUSSION',
    CREATE_DISCUSSION_SUCCESS = 'CREATE_DISCUSSION_SUCCESS',
    CREATE_DISCUSSION_FAILED = 'CREATE_DISCUSSION_FAILED',
}

export interface IGetDiscussionsAction {
    type: DiscussionActionType.GET_DISCUSSIONS
    payload: {
        repoID: string
    }
}

export interface IGetDiscussionsSuccessAction {
    type: DiscussionActionType.GET_DISCUSSIONS_SUCCESS
    payload: {
        repoID: string
        discussions: {[id: string]: IDiscussion}
    }
}

export type IGetDiscussionsFailedAction = FailedAction<DiscussionActionType.GET_DISCUSSIONS_FAILED>

export interface ISelectDiscussionAction {
    type: DiscussionActionType.SELECT_DISCUSSION
    payload: {
        created: number
    }
}

export interface ICreateDiscussionAction {
    type: DiscussionActionType.CREATE_DISCUSSION
    payload: {
        repoID: string
        subject: string
        commentText: string
    }
}

export interface ICreateDiscussionSuccessAction {
    type: DiscussionActionType.CREATE_DISCUSSION_SUCCESS
    payload: {}
}

export type ICreateDiscussionFailedAction = FailedAction<DiscussionActionType.CREATE_DISCUSSION_FAILED>

export type IDiscussionAction =
    IGetDiscussionsAction |
    IGetDiscussionsSuccessAction |
    IGetDiscussionsFailedAction |
    ISelectDiscussionAction |
    ICreateDiscussionAction |
    ICreateDiscussionSuccessAction |
    ICreateDiscussionFailedAction

export const getDiscussions = (payload: IGetDiscussionsAction['payload']): IGetDiscussionsAction => ({ type: DiscussionActionType.GET_DISCUSSIONS, payload })
export const selectDiscussion = (payload: ISelectDiscussionAction['payload']): ISelectDiscussionAction => ({ type: DiscussionActionType.SELECT_DISCUSSION, payload })
export const createDiscussion = (payload: ICreateDiscussionAction['payload']): ICreateDiscussionAction => ({ type: DiscussionActionType.CREATE_DISCUSSION, payload })
