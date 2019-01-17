import {
    UserActionType,
    IFetchUserDataAction, IFetchUserDataSuccessAction,
    IFetchUserDataByUsernameAction, IFetchUserDataByUsernameSuccessAction,
    IFetchUserDataByEmailAction, IFetchUserDataByEmailSuccessAction,
    IUploadUserPictureAction, IUploadUserPictureSuccessAction,
    IModifyUserEmailAction, IModifyUserEmailSuccessAction,
    IUpdateUserProfileAction, IUpdateUserProfileSuccessAction,
    IFetchUserOrgsAction, IFetchUserOrgsSuccessAction,
} from './userActions'
import { fetchOrgInfo } from '../org/orgActions'
import { makeLogic } from '../reduxUtils'
import { keyBy, uniq } from 'lodash'
import { IUser } from 'conscience-lib/common'
import ServerRelay from 'conscience-lib/ServerRelay'

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
        const users = keyBy(userList, 'userID') as { [userID: string]: IUser }

        return { users }
    },
})

const fetchUserDataByEmailLogic = makeLogic<IFetchUserDataByEmailAction, IFetchUserDataByEmailSuccessAction>({
    type: UserActionType.FETCH_USER_DATA_BY_EMAIL,
    async process({ action, getState }) {
        const inRedux = Object.keys(getState().user.users)
        const toFetch = action.payload.emails.filter(email => !inRedux.includes(email))
        const userList = await ServerRelay.fetchUsersByEmail(toFetch)

        let usersByEmail = {} as { [email: string]: string }
        for (let i = 0; i < userList.length; i++) {
            const user = userList[i]
            for (let j = 0; j < user.emails.length; j++) {
                usersByEmail[user.emails[j]] = user.userID
            }
        }
        // Convert the list into an object
        const users = keyBy(userList, 'userID') as { [userID: string]: IUser }

        return { users, usersByEmail }
    },
})

const fetchUserDataByUsernameLogic = makeLogic<IFetchUserDataByUsernameAction, IFetchUserDataByUsernameSuccessAction>({
    type: UserActionType.LOGOUT,
    async process({ action }, getState) {
        const knownUsernames = getState().user.users.reduce((acc: string[], curr: IUser) => {
            acc.push(curr.username)
            return acc
        }, [])
        const toFetch = uniq(action.payload.usernames).filter(username => knownUsernames.indexOf(username) > -1)
        if (toFetch.length <= 0) {
            return { users: {} }
        }
        const userList = await ServerRelay.fetchUsersByUsername(toFetch)

        // Convert the list into an object
        const users = keyBy(userList, 'userID') as { [userID: string]: IUser }

        return { users }
    },
})

const uploadUserPictureLogic = makeLogic<IUploadUserPictureAction, IUploadUserPictureSuccessAction>({
    type: UserActionType.UPLOAD_USER_PICTURE,
    async process({ action }) {
        const { fileInput } = action.payload
        const { userID, picture } = await ServerRelay.uploadUserPicture(fileInput)
        return { userID, picture }
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

const updateUserProfileLogic = makeLogic<IUpdateUserProfileAction, IUpdateUserProfileSuccessAction>({
    type: UserActionType.UPDATE_USER_PROFILE,
    async process({ action }) {
        const { userID, profile } = action.payload
        const user = await ServerRelay.updateUserProfile(profile)
        return { userID, profile: user.profile! }
    },
})

export {
    fetchUserDataLogic,
    fetchUserDataByEmailLogic,
    fetchUserDataByUsernameLogic,
    uploadUserPictureLogic,
    modifyUserEmailLogic,
    fetchUserOrgsLogic,
    updateUserProfileLogic,
}
