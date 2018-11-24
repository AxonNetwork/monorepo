import { keyBy, uniq } from 'lodash'
import { makeLogic, makeContinuousLogic } from '../reduxUtils'
import { IUser, ISharedRepoInfo } from '../../common'
import {
    UserActionType,
    ILoginAction, ILoginSuccessAction,
    ISignupAction, ISignupSuccessAction,
    IFetchUserDataAction, IFetchUserDataSuccessAction,
    IFetchUserDataByEmailAction, IFetchUserDataByEmailSuccessAction,
    ICheckNodeUserAction, ICheckNodeUserSuccessAction,
    ICheckBalanceAndHitFaucetAction, ICheckBalanceAndHitFaucetSuccessAction,
    ILogoutAction, ILogoutSuccessAction,
    IGetSharedReposAction, IGetSharedReposSuccessAction,
    ICloneSharedRepoAction,
    IIgnoreSharedRepoAction, IIgnoreSharedRepoSuccessAction,
    IUnshareRepoFromSelfAction, IUnshareRepoFromSelfSuccessAction,
    IFetchOrgsAction, IFetchOrgsSuccessAction,
    IReadLocalConfigAction, IReadLocalConfigSuccessAction,
    ISetLocalConfigAction, ISetLocalConfigSuccessAction,
    // ISetCodeColorSchemeAction, ISetCodeColorSchemeSuccessAction,
    // IHideMenuLabelsAction, IHideMenuLabelsSuccessAction,
    ISawCommentAction, ISawCommentSuccessAction,
    IUploadUserPictureAction, IUploadUserPictureSuccessAction,
    IModifyUserEmailAction, IModifyUserEmailSuccessAction,
    getSharedRepos, cloneSharedRepoProgress, fetchOrgs, gotNodeUsername,
} from './userActions'
import { selectRepo, getLocalRepos, watchRepo } from '../repository/repoActions'
import { fetchOrgInfo } from '../org/orgActions'
import ServerRelay from '../../lib/ServerRelay'
import UserData from '../../lib/UserData'
import ElectronRelay from '../../lib/ElectronRelay'
import * as rpc from '../../rpc'

const loginLogic = makeLogic<ILoginAction, ILoginSuccessAction>({
    type: UserActionType.LOGIN,
    async process({ action }, dispatch): Promise<ILoginSuccessAction['payload']> {
        const { email, password } = action.payload

        // Login and set the JWT
        const { userID, emails, name, username, picture, jwt, mnemonic } = await ServerRelay.login(email, password)
        await UserData.setJWT(jwt)
        await ElectronRelay.killNode()
        await UserData.setMnemonic(mnemonic)
        await ElectronRelay.startNode()

        dispatch(getSharedRepos({ userID }))
        dispatch(fetchOrgs({ userID }))
        dispatch(getLocalRepos())

        return { userID, emails, name, username, picture }
    },
})

const signupLogic = makeLogic<ISignupAction, ISignupSuccessAction>({
    type: UserActionType.SIGNUP,
    async process({ action }, dispatch) {
        const { payload } = action
        const rpcClient = rpc.initClient()
        const { signature } = await rpcClient.setUsernameAsync({ username: payload.username })
        const hexSignature = signature.toString('hex')

        const mnemonic = await UserData.getMnemonic()

        // Create the user, login, and set the JWT
        const { userID, emails, name, username, jwt } = await ServerRelay.signup(payload.name, payload.username, payload.email, payload.password, hexSignature, mnemonic)
        await UserData.set('jwt', jwt)

        // Fetch the user's data
        dispatch(getSharedRepos({ userID }))
        dispatch(fetchOrgs({ userID }))
        dispatch(getLocalRepos())

        return { userID, emails, name, username, picture: undefined }
    },
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

const fetchUserDataByEmailLogic = makeLogic<IFetchUserDataByEmailAction, IFetchUserDataByEmailSuccessAction>({
    type: UserActionType.FETCH_USER_DATA_BY_EMAIL,
    async process({ action, getState }) {
        const inRedux = Object.keys(getState().user.users)
        const toFetch = action.payload.emails.filter(email => !inRedux.includes(email))
        const userList = await ServerRelay.fetchUsersByEmail(toFetch)

        let usersByEmail = {} as {[email: string]: string}
        for (let i = 0; i < userList.length; i++) {
            const user = userList[i]
            for (let j = 0; j < user.emails.length; j++) {
                usersByEmail[user.emails[j]] = user.userID
            }
        }
        // Convert the list into an object
        const users = keyBy(userList, 'userID') as {[userID: string]: IUser}

        return { users, usersByEmail }
    },
})

const checkNodeUserLogic = makeLogic<ICheckNodeUserAction, ICheckNodeUserSuccessAction>({
    type: UserActionType.CHECK_NODE_USER,
    async process(_, dispatch) {
        console.log("HERE")
        const rpcClient = rpc.initClient()
        console.log("init client")
        const { username, signature } = await rpcClient.getUsernameAsync({})
        console.log("USERNAME: ", username)

        if (!username || username === '') {
            throw new Error('No node user')
        } else {
            dispatch(gotNodeUsername({username}))
        }

        const hexSignature = signature.toString('hex')
        const { userID, emails, name, picture } = await ServerRelay.loginWithKey(username, hexSignature)

        dispatch(getSharedRepos({ userID }))
        dispatch(fetchOrgs({ userID }))
        dispatch(getLocalRepos())

        return { userID, emails, name, picture, username }
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

const cloneSharedRepoLogic = makeContinuousLogic<ICloneSharedRepoAction>({
    type: UserActionType.CLONE_SHARED_REPO,
    async process({ action, getState }, dispatch, done) {
        const { repoID } = action.payload
        const state = getState()
        const { name, emails } = state.user.users[state.user.currentUser || '']

        const rpcClient = rpc.initClient()
        const stream = rpcClient.cloneRepo({
            repoID: repoID,
            name: name,
            email: emails[0],
        })
        dispatch(cloneSharedRepoProgress({ repoID, fetched: 0, toFetch: 0 }))
        stream.on('data', async (data: any) => {
            const toFetch = data.toFetch !== undefined ? data.toFetch.toNumber() : 0
            const fetched = data.fetched !== undefined ? data.fetched.toNumber() : 0
            console.log(toFetch)
            console.log(fetched)
            await dispatch(cloneSharedRepoProgress({ repoID, fetched, toFetch }))
        })
        stream.on('end', async () => {
            const path= ""
            await dispatch(watchRepo({ repoID, path }))
            await dispatch(selectRepo({ repoID, path }))
            done()
        })
        stream.on('error', (err: any) => {
            throw err
        })
    },
})

const fetchOrgsLogic = makeLogic<IFetchOrgsAction, IFetchOrgsSuccessAction>({
    type: UserActionType.FETCH_ORGS,
    async process({ action }, dispatch) {
        const { userID } = action.payload
        const { orgs } = await ServerRelay.fetchOrgs(userID)

        await Promise.all( orgs.map(orgID => dispatch(fetchOrgInfo({ orgID }))) )
        return { userID, orgs }
    },
})

const sawCommentLogic = makeLogic<ISawCommentAction, ISawCommentSuccessAction>({
    type: UserActionType.SAW_COMMENT,
    async process({ getState, action }) {
        const { repoID, discussionID, commentTimestamp } = action.payload

        await UserData.setNewestViewedCommentTimestamp(repoID, discussionID, commentTimestamp)
        return { repoID, discussionID, commentTimestamp }
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

const unshareRepoFromSelfLogic = makeLogic<IUnshareRepoFromSelfAction, IUnshareRepoFromSelfSuccessAction>({
    type: UserActionType.UNSHARE_REPO_FROM_SELF,
    async process({ action, getState }) {
        const { repoID } = action.payload
        const userID = getState().user.currentUser || ""
        await ServerRelay.unshareRepo(repoID, userID)
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

const setLocalConfigLogic = makeLogic<ISetLocalConfigAction, ISetLocalConfigSuccessAction>({
    type: UserActionType.SET_LOCAL_CONFIG,
    async process({ action }) {
        const { config } = action.payload
        await UserData.merge(config)
        return { config }
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
    fetchUserDataByEmailLogic,
    checkNodeUserLogic,
    checkBalanceAndHitFaucetLogic,
    logoutLogic,
    getSharedReposLogic,
    cloneSharedRepoLogic,
    ignoreSharedRepoLogic,
    unshareRepoFromSelfLogic,
    fetchOrgsLogic,
    sawCommentLogic,
    readLocalConfigLogic,
    setLocalConfigLogic,
    uploadUserPictureLogic,
    modifyUserEmailLogic,
]