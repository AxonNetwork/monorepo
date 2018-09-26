import { makeLogic } from '../reduxUtils'
import { IUser } from '../../common'
import { UserActionType, ILoginAction, ILoginSuccessAction, ISignupAction, ISignupSuccessAction, IFetchUserDataAction, IFetchUserDataSuccessAction, ILogoutAction, ILogoutSuccessAction, fetchUserData } from './userActions'
import ServerRelay from '../../lib/ServerRelay'
import UserData from '../../lib/UserData'

const loginLogic = makeLogic<ILoginAction, ILoginSuccessAction>({
    type: UserActionType.LOGIN,
    async process({ action }, dispatch): Promise<ILoginSuccessAction['payload']> {
        const { email, password } = action.payload

        // Login and set the JWT
        const resp = await ServerRelay.login(email, password)
        await UserData.set('jwt', resp.jwt)

        // Fetch the user's data
        await dispatch(fetchUserData({ emails: [ email ] }))
        // @@TODO: remove payload now that we're calling fetchUserData?
        return { email: resp.email, name: resp.name }
    },
})

const signupLogic = makeLogic<ISignupAction, ISignupSuccessAction>({
    type: UserActionType.SIGNUP,
    async process({ action }, dispatch) {
        const { name, email, password } = action.payload

        // Create the user, login, and set the JWT
        const resp = await ServerRelay.signup(name, email, password)
        await UserData.set('jwt', resp.jwt)

        // Fetch the user's data
        await dispatch(fetchUserData({ emails: [ email ] }))
        // @@TODO: remove payload now that we're calling fetchUserData?
        return { name: resp.name, email: resp.email }
    },
})

const fetchUserDataLogic = makeLogic<IFetchUserDataAction, IFetchUserDataSuccessAction>({
    type: UserActionType.FETCH_USER_DATA,
    async process({ action }) {
        const userList = await ServerRelay.fetchUsers(action.payload.emails)

        // Convert the list into an object
        const users = userList.reduce((into, each) => {
            into[each.email] = each
            return into
        }, {} as {[email: string]: IUser})

        return { users }
    },
})

const logoutLogic = makeLogic<ILogoutAction, ILogoutSuccessAction>({
    type: UserActionType.LOGOUT,
    async process() {
        ServerRelay.removeJWT()
        await UserData.set('jwt', null)
        return {}
    },
})

export default [
    loginLogic,
    signupLogic,
    fetchUserDataLogic,
    logoutLogic,
]