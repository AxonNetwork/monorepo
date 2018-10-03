import { makeLogic } from '../reduxUtils'
import { EditorActionType,
    ILoadTextContentAction, ILoadTextContentSuccessAction
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
export default [
    loadTextContentLogic
]
