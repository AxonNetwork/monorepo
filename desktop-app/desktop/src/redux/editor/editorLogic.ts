import { makeLogic } from '../reduxUtils'
import { EditorActionType,
    ILoadTextContentAction, ILoadTextContentSuccessAction,
    ISaveTextContentAction, ISaveTextContentSuccessAction,
} from './editorActions'
const fs = (window as any).require('fs')
import path from 'path'

const loadTextContentLogic = makeLogic<ILoadTextContentAction, ILoadTextContentSuccessAction>({
    type: EditorActionType.LOAD_TEXT_CONTENT,
    async process({ action }) {
        const { repoRoot, filename } = action.payload
        const fullpath = path.join(repoRoot, filename)
        let content = ''
        try {
            content = fs.readFileSync(fullpath, 'utf8')
        } catch (err) {
            // if file doesn't exist return blank
        }
        return { repoRoot, filename, content }
    },
})

const saveTextContentLogic = makeLogic<ISaveTextContentAction, ISaveTextContentSuccessAction>({
    type: EditorActionType.SAVE_TEXT_CONTENT,
    async process({ action }) {
        const { repoRoot, filename, content } = action.payload
        const fullpath = path.join(repoRoot, filename)
        fs.writeFileSync(fullpath, content, 'utf8')
        return { repoRoot, filename }
    },
})

export default [
    loadTextContentLogic,
    saveTextContentLogic,
]
