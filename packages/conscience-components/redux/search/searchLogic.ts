import {
    SearchActionType,
    IDoSearchAction, IDoSearchSuccessAction,
    IDoSearchUsersAction, IDoSearchUsersSuccessAction,
} from './searchActions'
import { fetchUserData } from '../user/userActions'
import { makeLogic } from '../reduxUtils'
import ServerRelay from 'conscience-lib/ServerRelay'

const searchLogic = makeLogic<IDoSearchAction, IDoSearchSuccessAction>({
    type: SearchActionType.SEARCH,
    async process({ action, getState }) {
        const results = await ServerRelay.search(action.payload.query)
        return { results }
    },
})

const searchUsersLogic = makeLogic<IDoSearchUsersAction, IDoSearchUsersSuccessAction>({
    type: SearchActionType.SEARCH_USERS,
    async process({ action, getState }, dispatch) {
        const results = await ServerRelay.searchUsers(action.payload.query)
        const userIDs = results.map(user => user.userID)
        await dispatch(fetchUserData({ userIDs }))
        return { results }
    },
})

export default [
    searchLogic,
    searchUsersLogic,
]
