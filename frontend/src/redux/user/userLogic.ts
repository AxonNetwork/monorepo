import { keyBy } from 'lodash'
import { makeLogic } from '../reduxUtils'
import { IUser, ISharedRepoInfo } from '../../common'
import {
    UserActionType,
    ILoginAction, ILoginSuccessAction,
    ISignupAction, ISignupSuccessAction,
    IFetchUserDataAction, IFetchUserDataSuccessAction,
    ICheckLocalUserAction, ICheckLocalUserSuccessAction,
    ICheckBalanceAndHitFaucetAction, ICheckBalanceAndHitFaucetSuccessAction,
    ILogoutAction, ILogoutSuccessAction,
    IGetSharedReposAction, IGetSharedReposSuccessAction,
    ICloneSharedRepoAction, ICloneSharedRepoSuccessAction,
    IIgnoreSharedRepoAction, IIgnoreSharedRepoSuccessAction,
    IReadLocalConfigAction, IReadLocalConfigSuccessAction,
    ISetCodeColorSchemeAction, ISetCodeColorSchemeSuccessAction,
    IHideMenuLabelsAction, IHideMenuLabelsSuccessAction,
    ISawCommentAction, ISawCommentSuccessAction,
    IUploadUserPictureAction, IUploadUserPictureSuccessAction,
    IModifyUserEmailAction, IModifyUserEmailSuccessAction,
    checkBalanceAndHitFaucet, getSharedRepos,
} from './userActions'
import { selectRepo } from '../repository/repoActions'
import ServerRelay from '../../lib/ServerRelay'
import UserData from '../../lib/UserData'
import * as rpc from '../../rpc'

const loginLogic = makeLogic<ILoginAction, ILoginSuccessAction>({
    type: UserActionType.LOGIN,
    async process({ action }, dispatch): Promise<ILoginSuccessAction['payload']> {
        const { email, password } = action.payload

        // Login and set the JWT
        const { userID, emails, name, picture, jwt } = await ServerRelay.login(email, password)
        await UserData.setJWT(jwt)

        dispatch(checkBalanceAndHitFaucet())
        dispatch(getSharedRepos({ userID }))

        return { userID, emails, name, picture }
    },
})

const signupLogic = makeLogic<ISignupAction, ISignupSuccessAction>({
    type: UserActionType.SIGNUP,
    async process({ action }, dispatch) {
        const { payload } = action

        const rpcClient = rpc.initClient()
        const { signature } = await rpcClient.signMessageAsync({ message: new Buffer(payload.email, 'utf8') })

        const hexSignature = signature.toString('hex')

        // Create the user, login, and set the JWT
        const { userID, emails, name, jwt } = await ServerRelay.signup(payload.name, payload.email, payload.password, hexSignature)
        await UserData.set('jwt', jwt)

        // Fetch the user's data
        dispatch(checkBalanceAndHitFaucet())
        dispatch(getSharedRepos({ userID }))

        return { userID, emails, name, picture: undefined }
    },
})

const fetchUserDataLogic = makeLogic<IFetchUserDataAction, IFetchUserDataSuccessAction>({
    type: UserActionType.FETCH_USER_DATA,
    async process({ action }) {
        const userList = await ServerRelay.fetchUsers(action.payload.userIDs)

        // Convert the list into an object
        const users = keyBy(userList, 'userID') as {[userID: string]: IUser}

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
        ServerRelay.setJWT(jwt)
        const { userID, emails, name, picture } = await ServerRelay.whoami()

        dispatch(checkBalanceAndHitFaucet())
        dispatch(getSharedRepos({ userID }))
        return { userID, emails, name, picture }
    },
})

const checkBalanceAndHitFaucetLogic = makeLogic<ICheckBalanceAndHitFaucetAction, ICheckBalanceAndHitFaucetSuccessAction>({
    type: UserActionType.CHECK_BALANCE_AND_HIT_FAUCET,
    async process(_, dispatch) {
        const rpcClient = rpc.initClient()
        const { address } = await rpcClient.ethAddressAsync({})
        let balance = await ServerRelay.getEthBalance(address)
        if (balance < 1) {
            await ServerRelay.hitEthFaucet(address)
            balance += 10
        }
        return { balance }
    },
})

const logoutLogic = makeLogic<ILogoutAction, ILogoutSuccessAction>({
    type: UserActionType.LOGOUT,
    async process() {
        ServerRelay.setJWT(undefined)
        await UserData.setJWT(undefined)
        return {}
    },
})

const getSharedReposLogic = makeLogic<IGetSharedReposAction, IGetSharedReposSuccessAction>({
    type: UserActionType.FETCH_SHARED_REPOS,
    async process({ action }) {
        const { userID } = action.payload
        const sharedRepoIDs = await ServerRelay.getSharedRepos(userID)
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
    async process({ action, getState }, dispatch) {
        const { repoID } = action.payload
        const state = getState()
        const { name, email } = state.user.users[state.user.currentUser || '']

        const rpcClient = rpc.initClient()
        const { path } = await rpcClient.cloneRepoAsync({
            repoID: repoID,
            name: name,
            email: email,
         })
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

const modifyUserEmailLogic = makeLogic<IModifyUserEmailAction, IModifyUserEmailSuccessAction>({
    type: UserActionType.MODIFY_USER_EMAIL,
    async process({ action }) {
        const { userID, email, add } = action.payload
        await ServerRelay.modifyEmail(email, add)
        return { userID, email, add }
    },
})

export default [
    loginLogic,
    signupLogic,
    fetchUserDataLogic,
    checkLocalUserLogic,
    checkBalanceAndHitFaucetLogic,
    logoutLogic,
    getSharedReposLogic,
    cloneSharedRepoLogic,
    ignoreSharedRepoLogic,
    sawCommentLogic,
    readLocalConfigLogic,
    setCodeColorSchemeLogic,
    hideMenuLabelsLogic,
    uploadUserPictureLogic,
    modifyUserEmailLogic,
]