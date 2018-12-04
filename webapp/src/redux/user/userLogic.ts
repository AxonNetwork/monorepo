// import { IUser, ISharedRepoInfo } from 'conscience-lib/common'
import {
    UserActionType,
    IWhoAmIAction, IWhoAmISuccessAction,
    ILoginAction, ILoginSuccessAction,
} from './userActions'
import { push } from 'connected-react-router'
import { makeLogic } from '../reduxUtils'
import ServerRelay from 'conscience-lib/ServerRelay'

const whoAmILogic = makeLogic<IWhoAmIAction, IWhoAmISuccessAction>({
    type: UserActionType.WHO_AM_I,
    async process({ action }, dispatch) {
        const jwt = localStorage.getItem('jwt')
        console.log("JWT: ", jwt)
        if( !jwt || jwt.length === 0 ) {
            return new Error("No jwt")
        }

        ServerRelay.setJWT(jwt)
        const resp = await ServerRelay.whoami()
        const { userID, emails, name, username, picture } = resp
        if (resp instanceof Error) {
            return resp
        }
        
        dispatch(push('/'))

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

        dispatch(push('/'))

        return { userID, emails, name, username, picture }
    }
})

export default [
    whoAmILogic,
	loginLogic,
]
