import { makeLogic } from 'conscience-components/redux/reduxUtils'
import ServerRelay from 'conscience-lib/ServerRelay'
import { fetchOrgInfo } from 'conscience-components/redux/org/orgActions'
import { getRepoID } from 'conscience-components/env-specific'
import {
    UserActionType,
    IWhoAmIAction, IWhoAmISuccessAction,
    ILoginAction, ILoginSuccessAction,
    ILogoutAction, ILogoutSuccessAction,
    ISawCommentAction, ISawCommentSuccessAction,
    IGetUserSettingsAction, IGetUserSettingsSuccessAction,
    IUpdateUserSettingsAction, IUpdateUserSettingsSuccessAction,
    getUserSettings,
} from 'conscience-components/redux/user/userActions'
import {
    fetchUserDataLogic,
    fetchUserDataByEmailLogic,
    fetchUserDataByUsernameLogic,
    uploadUserPictureLogic,
    modifyUserEmailLogic,
    updateUserProfileLogic,
    fetchUserOrgsLogic,
} from 'conscience-components/redux/user/userLogic'

const whoAmILogic = makeLogic<IWhoAmIAction, IWhoAmISuccessAction>({
    type: UserActionType.WHO_AM_I,
    async process({ action }, dispatch) {
        const jwt = localStorage.getItem('jwt')
        if (!jwt || jwt.length === 0) {
            return new Error('No jwt')
        }

        ServerRelay.setJWT(jwt)
        const resp = await ServerRelay.whoami()
        if (resp instanceof Error) {
            return resp
        }
        const { userID, emails, name, username, picture, orgs, profile } = resp

        await dispatch(getUserSettings({}))
        await Promise.all(orgs.map(orgID => dispatch(fetchOrgInfo({ orgID }))))

        return { userID, emails, name, username, picture, orgs, profile }
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
        const { userID, emails, name, username, picture, orgs, profile, jwt } = resp
        if (jwt) {
            localStorage.setItem('jwt', jwt)
        }

        await dispatch(getUserSettings({}))
        await Promise.all(orgs.map(orgID => dispatch(fetchOrgInfo({ orgID }))))

        return { userID, emails, name, username, picture, orgs, profile }
    },
})

const logoutLogic = makeLogic<ILogoutAction, ILogoutSuccessAction>({
    type: UserActionType.LOGOUT,
    async process({ action }, dispatch) {
        localStorage.setItem('jwt', '')
        ServerRelay.setJWT(undefined)
        return {}
    },
})

const sawCommentLogic = makeLogic<ISawCommentAction, ISawCommentSuccessAction>({
    type: UserActionType.SAW_COMMENT,
    async process({ getState, action }) {
        const { uri, discussionID, commentTimestamp } = action.payload
        const repoID = getRepoID(uri)
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

export default [
    // imported from conscience-components
    fetchUserDataLogic,
    fetchUserDataByEmailLogic,
    fetchUserDataByUsernameLogic,
    fetchUserOrgsLogic,
    modifyUserEmailLogic,
    uploadUserPictureLogic,
    updateUserProfileLogic,

    // web-specific
    whoAmILogic,
    loginLogic,
    logoutLogic,
    sawCommentLogic,
    getUserSettingsLogic,
    updateUserSettingsLogic,
]
