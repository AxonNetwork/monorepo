import { FailedAction } from '../reduxUtils'

export enum EditorActionType {
    LOAD_TEXT_CONTENT = 'LOAD_TEXT_CONTENT',
    LOAD_TEXT_CONTENT_SUCCESS = 'LOAD_TEXT_CONTENT_SUCCESS',
    LOAD_TEXT_CONTENT_FAILED = 'LOAD_TEXT_CONTENT_FAILED'
}

export interface ILoadTextContentAction {
    type: EditorActionType.LOAD_TEXT_CONTENT
    payload: {
        repoRoot: string
        file: string
    }
}

export interface ILoadTextContentSuccessAction {
    type: EditorActionType.LOAD_TEXT_CONTENT_SUCCESS
    payload: {
        repoRoot: string
        file: string
        content: string
    }
}

export type ILoadTextContentFailedAction = FailedAction<EditorActionType.LOAD_TEXT_CONTENT_FAILED>

export type IEditorAction =
    ILoadTextContentAction |
    ILoadTextContentSuccessAction

export const loadTextContent = (payload: ILoadTextContentAction['payload']): ILoadTextContentAction => ({ type: EditorActionType.LOAD_TEXT_CONTENT, payload })