import { FailedAction } from 'conscience-components/redux/reduxUtils'
import { UserActionType, IUserAction } from 'conscience-components/redux/user/userActions'
import { IUserSettings } from 'conscience-lib/common'

export interface IGetUserSettingsAction {
    type: UserActionType.GET_USER_SETTINGS
    payload: {}
}

export interface IGetUserSettingsSuccessAction {
    type: UserActionType.GET_USER_SETTINGS_SUCCESS
    payload: {
        settings: IUserSettings,
    }
}

export type IGetUserSettingsFailedAction = FailedAction<UserActionType.GET_USER_SETTINGS_FAILED>

export interface IUpdateUserSettingsAction {
    type: UserActionType.UPDATE_USER_SETTINGS
    payload: {
        settings: IUserSettings,
    }
}

export interface IUpdateUserSettingsSuccessAction {
    type: UserActionType.UPDATE_USER_SETTINGS_SUCCESS
    payload: {
        settings: IUserSettings,
    }
}

export type IUpdateUserSettingsFailedAction = FailedAction<UserActionType.UPDATE_USER_SETTINGS_FAILED>

export type IWebUserAction =
    IUserAction |

    IGetUserSettingsAction |
    IGetUserSettingsSuccessAction |
    IGetUserSettingsFailedAction |

    IUpdateUserSettingsAction |
    IUpdateUserSettingsSuccessAction |
    IUpdateUserSettingsFailedAction

export const getUserSettings = (payload: IGetUserSettingsAction['payload']): IGetUserSettingsAction => ({ type: UserActionType.GET_USER_SETTINGS, payload })
export const updateUserSettings = (payload: IUpdateUserSettingsAction['payload']): IUpdateUserSettingsAction => ({ type: UserActionType.UPDATE_USER_SETTINGS, payload })
