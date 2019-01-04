import {
    UserActionType,
    IWhoAmIAction, IWhoAmISuccessAction,
    ILoginAction, ILoginSuccessAction,
    ILogoutAction, ILogoutSuccessAction,
    IFetchUserDataAction, IFetchUserDataSuccessAction,
    ISawCommentAction, ISawCommentSuccessAction,
    IGetUserSettingsAction, IGetUserSettingsSuccessAction,
    IUpdateUserSettingsAction, IUpdateUserSettingsSuccessAction,
    IUploadUserPictureAction, IUploadUserPictureSuccessAction,
    IModifyUserEmailAction, IModifyUserEmailSuccessAction,
    IFetchUserOrgsAction, IFetchUserOrgsSuccessAction,
    getUserSettings,
} from './userActions'
import { fetchOrgInfo } from '../org/orgActions'
import { makeLogic } from '../reduxUtils'
import { keyBy, uniq } from 'lodash'
import { IUser } from 'conscience-lib/common'
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
        const { userID, emails, name, username, picture, orgs } = resp
        if (resp instanceof Error) {
            return resp
        }

        await dispatch(getUserSettings({})),
        await Promise.all(orgs.map(orgID => dispatch(fetchOrgInfo({ orgID }))))

        return { userID, emails, name, username, picture, orgs }
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
        const { userID, emails, name, username, picture, jwt, orgs } = resp
        localStorage.setItem('jwt', jwt)

        await dispatch(getUserSettings({}))
        await Promise.all(orgs.map(orgID => dispatch(fetchOrgInfo({ orgID }))))

        return { userID, emails, name, username, picture, orgs }
    }
})

const logoutLogic = makeLogic<ILogoutAction, ILogoutSuccessAction>({
    type: UserActionType.LOGOUT,
    async process({ action }, dispatch) {
        localStorage.setItem('jwt', '')
        ServerRelay.setJWT('')
        return {}
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
        await ServerRelay.sawComment(repoID, discussionID, commentTimestamp)
        return { repoID, discussionID, commentTimestamp }
    },
})

const getUserSettingsLogic = makeLogic<IGetUserSettingsAction, IGetUserSettingsSuccessAction>({
    type: UserActionType.GET_USER_SETTINGS,
    async process({ getState, action }) {
        const settings = await ServerRelay.getUserSettings()
        return { settings }
    },
})

const updateUserSettingsLogic = makeLogic<IUpdateUserSettingsAction, IUpdateUserSettingsSuccessAction>({
    type: UserActionType.UPDATE_USER_SETTINGS,
    async process({ getState, action }) {
        let { settings } = action.payload
        settings = await ServerRelay.updateUserSettings(settings)
        return { settings }
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

const fetchUserOrgsLogic = makeLogic<IFetchUserOrgsAction, IFetchUserOrgsSuccessAction>({
    type: UserActionType.FETCH_USER_ORGS,
    async process({ getState, action }, dispatch) {
        const userID = getState().user.currentUser || ''
        const { orgs } = await ServerRelay.fetchOrgs()
        await Promise.all(orgs.map(orgID => dispatch(fetchOrgInfo({ orgID }))))
        return { userID, orgs }
    },
})

export default [
    whoAmILogic,
	loginLogic,
    logoutLogic,
    fetchUserDataLogic,
    sawCommentLogic,
    getUserSettingsLogic,
    updateUserSettingsLogic,
    uploadUserPictureLogic,
    modifyUserEmailLogic,
    fetchUserOrgsLogic,
]
