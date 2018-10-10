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
    IReadLocalConfigAction, IReadLocalConfigSuccessAction,
    ISetCodeColorSchemeAction, ISetCodeColorSchemeSuccessAction,
    IHideMenuLabelsAction, IHideMenuLabelsSuccessAction,
    ISawCommentAction, ISawCommentSuccessAction,
    IUploadUserPictureAction, IUploadUserPictureSuccessAction,
    fetchUserData, getSharedRepos,
} from './userActions'
import { selectRepo } from '../repository/repoActions'
import ServerRelay from '../../lib/ServerRelay'
import ConscienceRelay from '../../lib/ConscienceRelay'
import UserData, { CONSCIENCE_LOCATION } from '../../lib/UserData'
import * as rpc from '../../rpc'

const loginLogic = makeLogic<ILoginAction, ILoginSuccessAction>({
    type: UserActionType.LOGIN,
    async process({ action }, dispatch): Promise<ILoginSuccessAction['payload']> {
        const { email, password } = action.payload

        // Login and set the JWT
        const resp = await ServerRelay.login(email, password)
        await UserData.setJWT(resp.jwt)

        // Fetch the user's data
        await dispatch(fetchUserData({ emails: [ email ] }))
        dispatch(getSharedRepos({ email }))
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
        dispatch(getSharedRepos({ email }))
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
        const jwt = await UserData.getJWT()
        if (!jwt || jwt === '') {
            throw new Error('Not logged in')
        }
        const resp = await ServerRelay.whoami(jwt)
        await dispatch(fetchUserData({ emails: [ resp.email ] }))
        dispatch(getSharedRepos({ email: resp.email }))
        return { email: resp.email, name: resp.name }
    },
})

const logoutLogic = makeLogic<ILogoutAction, ILogoutSuccessAction>({
    type: UserActionType.LOGOUT,
    async process() {
        ServerRelay.removeJWT()
        await UserData.setJWT(undefined)
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
        return { sharedRepos }
      },
})

const cloneSharedRepoLogic = makeLogic<ICloneSharedRepoAction, ICloneSharedRepoSuccessAction>({
    type: UserActionType.CLONE_SHARED_REPO,
    async process({ action }, dispatch) {
        const { repoID } = action.payload
        const rpcClient = rpc.initClient()
        const { path } = await rpcClient.cloneRepoAsync({ repoID: repoID })
        await dispatch(selectRepo({ repoID, path }))
        return {}
    },
})

const sawCommentLogic = makeLogic<ISawCommentAction, ISawCommentSuccessAction>({
    type: UserActionType.SAW_COMMENT,
    async process({ getState, action }) {
        const { repoID, discussionID, commentID } = action.payload

        await UserData.setNewestViewedCommentTimestamp(repoID, discussionID, commentID)

        const state = getState()
        if (
            (state.user.newestViewedCommentTimestamp[repoID] || {})[discussionID] !== undefined &&
            (state.user.newestViewedCommentTimestamp[repoID] || {})[discussionID] >= commentID
        ) {
            // If we return nulls here, it indicates that no actual update occurred
            return { repoID: null, discussionID: null, commentID: null }
        } else {
            return { repoID, discussionID, commentID }
        }
    },
})

const ignoreSharedRepoLogic = makeLogic<IIgnoreSharedRepoAction, IIgnoreSharedRepoSuccessAction>({
    type: UserActionType.IGNORE_SHARED_REPO,
    async process({ action }) {
        const { repoID } = action.payload
        await UserData.ignoreSharedRepo(repoID)
        return { repoID }
    },
})

const readLocalConfigLogic = makeLogic<IReadLocalConfigAction, IReadLocalConfigSuccessAction>({
    type: UserActionType.READ_LOCAL_CONFIG,
    async process(_) {
        const config = await UserData.readAll()
        return { config }
    },
})

const setCodeColorSchemeLogic = makeLogic<ISetCodeColorSchemeAction, ISetCodeColorSchemeSuccessAction>({
    type: UserActionType.SET_CODE_COLOR_SCHEME,
    async process({ action }) {
        const { codeColorScheme } = action.payload
        await UserData.setCodeColorScheme(codeColorScheme)
        return { codeColorScheme }
    },
})

const hideMenuLabelsLogic = makeLogic<IHideMenuLabelsAction, IHideMenuLabelsSuccessAction>({
    type: UserActionType.HIDE_MENU_LABELS,
    async process({ action }) {
        const { menuLabelsHidden } = action.payload
        await UserData.hideMenuLabels(menuLabelsHidden)
        return { menuLabelsHidden }
    },
})

const uploadUserPictureLogic = makeLogic<IUploadUserPictureAction, IUploadUserPictureSuccessAction>({
    type: UserActionType.UPLOAD_USER_PICTURE,
    async process({ action }) {
        const { fileInput } = action.payload
        const { userID, picture } = await ServerRelay.uploadUserPicture(fileInput)
        return { userID, picture: picture + '?' + (new Date().getTime()) }
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
    sawCommentLogic,
    readLocalConfigLogic,
    setCodeColorSchemeLogic,
    hideMenuLabelsLogic,
    uploadUserPictureLogic,
]