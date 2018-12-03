import { FailedAction } from '../reduxUtils'

export enum EditorActionType {
    LOAD_TEXT_CONTENT = 'LOAD_TEXT_CONTENT',
    LOAD_TEXT_CONTENT_SUCCESS = 'LOAD_TEXT_CONTENT_SUCCESS',
    LOAD_TEXT_CONTENT_FAILED = 'LOAD_TEXT_CONTENT_FAILED',

    UPDATE_TEXT_BUFFER = 'UPDATE_TEXT_BUFFER',

    SAVE_TEXT_CONTENT = 'SAVE_TEXT_CONTENT',
    SAVE_TEXT_CONTENT_SUCCESS = 'SAVE_TEXT_CONTENT_SUCCESS',
    SAVE_TEXT_CONTENT_FAILED = 'SAVE_TEXT_CONTENT_FAILED',
}

export interface ILoadTextContentAction {
    type: EditorActionType.LOAD_TEXT_CONTENT
    payload: {
        repoRoot: string
        filename: string,
    }
}

export interface ILoadTextContentSuccessAction {
    type: EditorActionType.LOAD_TEXT_CONTENT_SUCCESS
    payload: {
        repoRoot: string
        filename: string
        content: string,
    }
}

export type ILoadTextContentFailedAction = FailedAction<EditorActionType.LOAD_TEXT_CONTENT_FAILED>

export interface IUpdateTextBufferAction {
    type: EditorActionType.UPDATE_TEXT_BUFFER
    payload: {
        repoRoot: string
        filename: string
        contents: string,
    }
}

export interface ISaveTextContentAction {
    type: EditorActionType.SAVE_TEXT_CONTENT
    payload: {
        repoRoot: string
        filename: string
        content: string,
    }
}

export interface ISaveTextContentSuccessAction {
    type: EditorActionType.SAVE_TEXT_CONTENT_SUCCESS
    payload: {
        repoRoot: string
        filename: string,
    }
}

export type ISaveTextContentFailedAction = FailedAction<EditorActionType.SAVE_TEXT_CONTENT_FAILED>

export type IEditorAction =
    ILoadTextContentAction |
    ILoadTextContentSuccessAction |
    IUpdateTextBufferAction |
    ISaveTextContentAction |
    ISaveTextContentSuccessAction

export const loadTextContent = (payload: ILoadTextContentAction['payload']): ILoadTextContentAction => ({ type: EditorActionType.LOAD_TEXT_CONTENT, payload })
export const saveTextContent = (payload: ISaveTextContentAction['payload']): ISaveTextContentAction => ({ type: EditorActionType.SAVE_TEXT_CONTENT, payload })
export const updateTextBuffer = (payload: IUpdateTextBufferAction['payload']): IUpdateTextBufferAction => ({ type: EditorActionType.UPDATE_TEXT_BUFFER, payload })

