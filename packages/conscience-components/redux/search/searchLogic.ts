import {
    SearchActionType,
    IDoSearchAction, IDoSearchSuccessAction,
} from './searchActions'
import { makeLogic } from '../reduxUtils'
import ServerRelay from 'conscience-lib/ServerRelay'

const searchLogic = makeLogic<IDoSearchAction, IDoSearchSuccessAction>({
    type: SearchActionType.SEARCH,
    async process({ action, getState }) {
        const resp = await ServerRelay.search(action.payload.query)
        return { comments: resp.comments, files: resp.files }
    },
})

export {
    searchLogic,
}
