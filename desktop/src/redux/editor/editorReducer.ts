import { EditorActionType, IEditorAction } from './editorActions'

const initialState = {
    content: {},
    loaded: false,
    editingFile: null,
    textBuffer: '',
}

export interface IEditorState {
    content: {
        [repoRoot: string]: {
            [file: string]: string,
        },
    }
    loaded: boolean
    editingFile: { repoRoot: string, filename: string } | null
    textBuffer: string
}

const editorReducer = (state: IEditorState = initialState, action: IEditorAction): IEditorState => {
    switch (action.type) {
        case EditorActionType.LOAD_TEXT_CONTENT: {
            return {
                ...state,
                loaded: false,
            }
        }

        case EditorActionType.LOAD_TEXT_CONTENT_SUCCESS: {
            const { repoRoot, filename, content } = action.payload
            return {
                ...state,
                content: {
                    [repoRoot]: {
                        ...state.content[repoRoot],
                        [filename]: content,
                    },
                },
                loaded: true,
                editingFile: {
                    repoRoot,
                    filename,
                },
                textBuffer: content,
            }
        }

        case EditorActionType.UPDATE_TEXT_BUFFER: {
            const { contents } = action.payload
            return {
                ...state,
                textBuffer: contents,
            }
        }

        default:
            return state
    }
}

export default editorReducer
