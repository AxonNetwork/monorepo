import {
    UserActionType,
    IWhoAmIAction, IWhoAmISuccessAction,
    ILoginAction, ILoginSuccessAction,
    IFetchUserDataAction, IFetchUserDataSuccessAction,
    ISawCommentAction, ISawCommentSuccessAction,
} from './userActions'
import { makeLogic } from '../reduxUtils'
import { IUser } from 'conscience-lib/common'
import { keyBy, uniq } from 'lodash'
import ServerRelay from 'conscience-lib/ServerRelay'

const whoAmILogic = makeLogic<IWhoAmIAction, IWhoAmISuccessAction>({
    type: UserActionType.WHO_AM_I,
    async process({ action }, dispatch) {
        const jwt = localStorage.getItem('jwt')
        console.log(jwt)
        if( !jwt || jwt.length === 0 ) {
            return new Error("No jwt")
        }

        ServerRelay.setJWT(jwt)
        const resp = await ServerRelay.whoami()
        const { userID, emails, name, username, picture } = resp
        if (resp instanceof Error) {
            return resp
        }

        return { userID, emails, name, username, picture }
    }
})

const loginLogic = makeLogic<ILoginAction, ILoginSuccessAction>({
    type: UserActionType.LOGIN,
    async process({ action }, dispatch) {
    	const { email, password } = action.payload
    	const resp = await ServerRelay.login(email, password)
    	if (resp instanceof Error) {
    		return resp
		}
        const { userID, emails, name, username, picture, jwt } = resp
        localStorage.setItem('jwt', jwt)

        return { userID, emails, name, username, picture }
    }
})

const fetchUserDataLogic = makeLogic<IFetchUserDataAction, IFetchUserDataSuccessAction>({
    type: UserActionType.FETCH_USER_DATA,
    async process({ action, getState }) {
        const knownUsers = getState().user.users
        const toFetch = uniq(action.payload.userIDs).filter(userID => !knownUsers[userID])
        if (toFetch.length <= 0) {
            return { users: {} }
        }
        const userList = await ServerRelay.fetchUsers(toFetch)

        // Convert the list into an object
        const users = keyBy(userList, 'userID') as {[userID: string]: IUser}

        return { users }
    },
})

const sawCommentLogic = makeLogic<ISawCommentAction, ISawCommentSuccessAction>({
    type: UserActionType.SAW_COMMENT,
    async process({ getState, action }) {
        const { repoID, discussionID, commentTimestamp } = action.payload

        // await UserData.setNewestViewedCommentTimestamp(repoID, discussionID, commentTimestamp)
        return { repoID, discussionID, commentTimestamp }
    },
})

export default [
    whoAmILogic,
	loginLogic,
    fetchUserDataLogic,
    sawCommentLogic,
]
