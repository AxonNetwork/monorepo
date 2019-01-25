import { bugsnagClient } from 'bugsnag'
import keyBy from 'lodash/keyBy'
import { makeLogic } from 'conscience-components/redux/reduxUtils'
import { getRepo } from 'conscience-components/env-specific'
import { ISharedRepoInfo } from 'conscience-lib/common'
import ServerRelay from 'conscience-lib/ServerRelay'
import * as rpc from 'conscience-lib/rpc'
import {
    UserActionType,
    ILoginAction, ILoginSuccessAction,
    ISignupAction, ISignupSuccessAction,
    ILogoutAction, ILogoutSuccessAction,
    ISawCommentAction, ISawCommentSuccessAction,
    fetchUserOrgs,
} from 'conscience-components/redux/user/userActions'
import {
    fetchUserDataLogic,
    fetchUserDataByUsernameLogic,
    fetchUserDataByEmailLogic,
    fetchUserOrgsLogic,
    uploadUserPictureLogic,
    updateUserProfileLogic,
    modifyUserEmailLogic,
} from 'conscience-components/redux/user/userLogic'
import {
    DesktopUserActionType,
    ICheckNodeUserAction, ICheckNodeUserSuccessAction,
    ICheckBalanceAndHitFaucetAction, ICheckBalanceAndHitFaucetSuccessAction,
    IGetSharedReposAction, IGetSharedReposSuccessAction,
    IIgnoreSharedRepoAction, IIgnoreSharedRepoSuccessAction,
    IUnshareRepoFromSelfAction, IUnshareRepoFromSelfSuccessAction,
    IReadLocalConfigAction, IReadLocalConfigSuccessAction,
    ISetLocalConfigAction, ISetLocalConfigSuccessAction,
    getSharedRepos, gotNodeUsername,
} from './userActions'
import { getLocalRepoList } from 'conscience-components/redux/repo/repoActions'
import UserData from '../../lib/UserData'
import ElectronRelay from '../../lib/ElectronRelay'

const checkNodeUserLogic = makeLogic<ICheckNodeUserAction, ICheckNodeUserSuccessAction>({
    type: DesktopUserActionType.CHECK_NODE_USER,
    async process(_, dispatch) {
        const rpcResp = await rpc.getClient().getUsernameAsync({})

        if (!rpcResp.username || rpcResp.username === '') {
            return new Error('No node user')
        } else {
            dispatch(gotNodeUsername({ username: rpcResp.username }))
        }

        const hexSignature = rpcResp.signature.toString('hex')
        const resp = await ServerRelay.loginWithKey(rpcResp.username, hexSignature)
        if (resp instanceof Error) {
            return resp
        }
        const { userID, emails, name, username, picture, orgs, profile, jwt } = resp
        await UserData.setJWT(jwt)
        bugsnagClient.user = { userID, emails, name, username, loginMethod: 'checkNodeUser' }

        dispatch(getSharedRepos({ userID }))
        dispatch(fetchUserOrgs({ userID }))
        dispatch(getLocalRepoList({}))

        return { userID, emails, name, username, picture, orgs, profile }
    },
})

const checkBalanceAndHitFaucetLogic = makeLogic<ICheckBalanceAndHitFaucetAction, ICheckBalanceAndHitFaucetSuccessAction>({
    type: DesktopUserActionType.CHECK_BALANCE_AND_HIT_FAUCET,
    async process(_, dispatch) {
        const { address } = await rpc.getClient().ethAddressAsync({})
        let balance = await ServerRelay.getEthBalance(address)
        if (balance < 1) {
            await ServerRelay.hitEthFaucet(address)
            balance += 10
        }
        return { balance }
    },
})


const loginLogic = makeLogic<ILoginAction, ILoginSuccessAction>({
    type: UserActionType.LOGIN,
    async process({ action }, dispatch) {
        const { email, password } = action.payload

        // Login and set the JWT
        const resp = await ServerRelay.login(email, password)
        if (resp instanceof Error) {
            return resp
        }
        const { userID, emails, name, username, picture, orgs, profile, jwt, mnemonic } = resp
        bugsnagClient.user = { userID, emails, name, username, jwt, mnemonic, loginMethod: 'login' }
        await UserData.setJWT(jwt)
        await ElectronRelay.killNode()
        await UserData.setMnemonic(mnemonic)
        await ElectronRelay.startNode()

        dispatch(getSharedRepos({ userID }))
        dispatch(fetchUserOrgs({ userID }))
        dispatch(getLocalRepoList({}))

        return { userID, emails, name, username, picture, orgs, profile }
    },
})

const signupLogic = makeLogic<ISignupAction, ISignupSuccessAction>({
    type: UserActionType.SIGNUP,
    async process({ action }, dispatch) {
        const { payload } = action
        const { signature } = await rpc.getClient().setUsernameAsync({ username: payload.username })
        const hexSignature = signature.toString('hex')

        const mnemonic = await UserData.getMnemonic()

        // Create the user, login, and set the JWT
        const resp = await ServerRelay.signup(payload.name, payload.username, payload.email, payload.password, hexSignature, mnemonic)
        if (resp instanceof Error) {
            return resp
        }
        const { userID, emails, name, username, picture, orgs, profile, jwt } = resp
        bugsnagClient.user = { userID, emails, name, username, jwt, mnemonic, loginMethod: 'signup' }
        await UserData.set('jwt', jwt)

        // Fetch the user's data
        dispatch(getSharedRepos({ userID }))
        dispatch(fetchUserOrgs({ userID }))
        dispatch(getLocalRepoList({}))

        return { userID, emails, name, username, picture, orgs, profile }
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
    type: DesktopUserActionType.FETCH_SHARED_REPOS,
    async process({ action }) {
        const { userID } = action.payload
        const sharedRepoIDs = await ServerRelay.getSharedRepos(userID)
        const ignoredList = await Promise.all(sharedRepoIDs.map(UserData.isRepoIgnored))
        const sharedReposList = sharedRepoIDs.map((repoID, i) => ({
            repoID,
            ignored: ignoredList[i],
        }))
        const sharedRepos = keyBy(sharedReposList, 'repoID') as { [repoID: string]: ISharedRepoInfo }
        return { sharedRepos }
    },
})

const sawCommentLogic = makeLogic<ISawCommentAction, ISawCommentSuccessAction>({
    type: UserActionType.SAW_COMMENT,
    async process({ getState, action }) {
        const { uri, discussionID, commentTimestamp } = action.payload
        const repoID = (getRepo(uri) || {}).repoID

        await UserData.setNewestViewedCommentTimestamp(repoID, discussionID, commentTimestamp)
        return { repoID, discussionID, commentTimestamp }
    },
})

const ignoreSharedRepoLogic = makeLogic<IIgnoreSharedRepoAction, IIgnoreSharedRepoSuccessAction>({
    type: DesktopUserActionType.IGNORE_SHARED_REPO,
    async process({ action }) {
        const { repoID } = action.payload
        await UserData.ignoreSharedRepo(repoID)
        return { repoID }
    },
})

const unshareRepoFromSelfLogic = makeLogic<IUnshareRepoFromSelfAction, IUnshareRepoFromSelfSuccessAction>({
    type: DesktopUserActionType.UNSHARE_REPO_FROM_SELF,
    async process({ action, getState }) {
        const { repoID } = action.payload
        const userID = getState().user.currentUser || ""
        await ServerRelay.unshareRepo(repoID, userID)
        return { repoID }
    },
})

const readLocalConfigLogic = makeLogic<IReadLocalConfigAction, IReadLocalConfigSuccessAction>({
    type: DesktopUserActionType.READ_LOCAL_CONFIG,
    async process(_) {
        const config = await UserData.readAll()
        return { config }
    },
})

const setLocalConfigLogic = makeLogic<ISetLocalConfigAction, ISetLocalConfigSuccessAction>({
    type: DesktopUserActionType.SET_LOCAL_CONFIG,
    async process({ action }) {
        const { config } = action.payload
        await UserData.merge(config)
        return { config }
    },
})



export default [
    // imported from conscience-components
    fetchUserDataLogic,
    fetchUserDataByEmailLogic,
    fetchUserDataByUsernameLogic,
    fetchUserOrgsLogic,
    modifyUserEmailLogic,
    uploadUserPictureLogic,
    updateUserProfileLogic,

    // desktop-specific
    loginLogic,
    signupLogic,
    checkNodeUserLogic,
    checkBalanceAndHitFaucetLogic,
    logoutLogic,
    getSharedReposLogic,
    ignoreSharedRepoLogic,
    unshareRepoFromSelfLogic,
    sawCommentLogic,
    readLocalConfigLogic,
    setLocalConfigLogic,
]