import { makeLogic } from '../reduxUtils'
import { EditorActionType,
    ILoadTextContentAction, ILoadTextContentSuccessAction,
    ISaveTextContentAction, ISaveTextContentSuccessAction
} from './editorActions'
const fs = (window as any).require('fs')
import path from 'path'

const loadTextContentLogic = makeLogic<ILoadTextContentAction, ILoadTextContentSuccessAction>({
    type: EditorActionType.LOAD_TEXT_CONTENT,
    async process({ action }) {
        const { repoRoot, file } = action.payload
        const fPath = path.join(repoRoot, file)
        let content=""
        try{
            content = fs.readFileSync(fPath).toString()
        }catch(err){
            // if file doesn't exist return blank
        }
        return { repoRoot, file, content}
    }
})

const saveTextContentLogic = makeLogic<ISaveTextContentAction, ISaveTextContentSuccessAction>({
    type: EditorActionType.SAVE_TEXT_CONTENT,
    async process({ action }) {
        console.log(action)
        const { repoRoot, file, content } = action.payload
    const fPath = path.join(repoRoot, file)
        fs.writeFileSync(fPath, content)
        return { repoRoot, file }
    }
})

export default [
    loadTextContentLogic,
    saveTextContentLogic
]
