import { EditorActionType, IEditorAction } from './editorActions'

const initialState = {
    content: {},
    loaded: false
}

export interface IEditorState {
    content: {
        [repoRoot: string]: {
            [file: string]: string
        }
    }
    loaded: boolean
}

const editorReducer = (state: IEditorState = initialState, action: IEditorAction): IEditorState => {
    switch (action.type) {
        case EditorActionType.LOAD_TEXT_CONTENT: {
            return {
                ...state,
                loaded: false
            }
        }

        case EditorActionType.LOAD_TEXT_CONTENT_SUCCESS: {
            const { repoRoot, file, content } = action.payload
            return {
                ...state,
                content: {
                    [repoRoot]: {
                        ...state.content[repoRoot],
                        [file]: content
                    }
                },
                loaded: true
            }
        }


        default:
            return state
    }
}

export default editorReducer
