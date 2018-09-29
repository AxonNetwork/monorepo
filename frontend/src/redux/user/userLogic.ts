import { keyBy } from 'lodash'
import { makeLogic } from '../reduxUtils'
import { IUser, ISharedRepoInfo } from '../../common'
import {
    UserActionType,
    ILoginAction, ILoginSuccessAction,
    ISignupAction, ISignupSuccessAction,
    IFetchUserDataAction, IFetchUserDataSuccessAction,
    ICheckLocalUserAction, ICheckLocalUserSuccessAction,
    ILogoutAction, ILogoutSuccessAction,
    IGetSharedReposAction, IGetSharedReposSuccessAction,
    ICloneSharedRepoAction, ICloneSharedRepoSuccessAction,
    IIgnoreSharedRepoAction, IIgnoreSharedRepoSuccessAction,
    fetchUserData,
} from './userActions'
import { selectRepo } from '../repository/repoActions'
import ServerRelay from '../../lib/ServerRelay'
import ConscienceRelay from '../../lib/ConscienceRelay'
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

        // // Convert the list into an object
        const users = userList.reduce((into, each) => {
            into[each.email] = each
            return into
        }, {} as {[email: string]: IUser})

        return { users }
    },
})

const checkLocalUserLogic = makeLogic<ICheckLocalUserAction, ICheckLocalUserSuccessAction>({
    type: UserActionType.CHECK_LOCAL_USER,
    async process(_, dispatch) {
        const jwt = await UserData.get('jwt')
        if (!jwt || jwt === '') {
            throw new Error('Not logged in')
        }
        const resp = await ServerRelay.whoami(jwt)
        await dispatch(fetchUserData({ emails: [ resp.email ] }))
        return { email: resp.email, name: resp.name }
    }
})

const logoutLogic = makeLogic<ILogoutAction, ILogoutSuccessAction>({
    type: UserActionType.LOGOUT,
    async process() {
        ServerRelay.removeJWT()
        await UserData.set('jwt', null)
        return {}
    },
})

const getSharedReposLogic = makeLogic<IGetSharedReposAction, IGetSharedReposSuccessAction>({
    type: UserActionType.FETCH_SHARED_REPOS,
    async process({ action }) {
        const { email } = action.payload
        const sharedRepoIDs = await ServerRelay.getSharedRepos(email)
        const ignoredList = await Promise.all( sharedRepoIDs.map(UserData.isRepoIgnored) )
        const sharedReposList = sharedRepoIDs.map((repoID, i) => ({
            repoID,
            ignored: ignoredList[i],
        }))
        const sharedRepos = keyBy(sharedReposList, 'repoID') as {[repoID: string]: ISharedRepoInfo}
        return { sharedRepos, email }
      },
})

const cloneSharedRepoLogic = makeLogic<ICloneSharedRepoAction, ICloneSharedRepoSuccessAction>({
    type: UserActionType.CLONE_SHARED_REPO,
    async process({ action }, dispatch) {
        const { repoID } = action.payload
        const { folderPath: path } = await ConscienceRelay.cloneRepo(repoID, UserData.conscienceLocation)
        await dispatch(selectRepo({ repoID, path }))
        return {}
    },
})

const ignoreSharedRepoLogic = makeLogic<IIgnoreSharedRepoAction, IIgnoreSharedRepoSuccessAction>({
    type: UserActionType.IGNORE_SHARED_REPO,
    async process({ getState, action }) {
        const { repoID } = action.payload
        const email = getState().user.currentUser
        await UserData.ignoreSharedRepo(repoID)
        return { repoID, email }
    },
})

export default [
    loginLogic,
    signupLogic,
    fetchUserDataLogic,
    checkLocalUserLogic,
    logoutLogic,
    getSharedReposLogic,
    cloneSharedRepoLogic,
    ignoreSharedRepoLogic,
]