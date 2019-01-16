import userReducer, { IUserState, initialState } from 'conscience-components/redux/user/userReducer'
import { UserActionType, IUserAction } from 'conscience-components/redux/user/userActions'
import { IWebUserAction } from './userActions'

const webInitialState = {
    ...initialState,
}

declare module 'conscience-components/redux/user/userReducer' {
    export interface IUserState {
    }
}

const webUserReducer = (state: IUserState = initialState, action: IWebUserAction): IUserState => {
    switch (action.type) {
        case UserActionType.GET_USER_SETTINGS_SUCCESS:
        case UserActionType.UPDATE_USER_SETTINGS:
        case UserActionType.UPDATE_USER_SETTINGS_SUCCESS: {
            const { settings } = action.payload
            const updated = {
                codeColorScheme: settings.codeColorScheme !== undefined ? settings.codeColorScheme : state.userSettings.codeColorScheme,
                menuLabelsHidden: settings.menuLabelsHidden !== undefined ? settings.menuLabelsHidden : state.userSettings.menuLabelsHidden,
                fileExtensionsHidden: settings.fileExtensionsHidden !== undefined ? settings.fileExtensionsHidden : state.userSettings.fileExtensionsHidden,
                newestViewedCommentTimestamp: settings.newestViewedCommentTimestamp !== undefined ? settings.newestViewedCommentTimestamp : state.userSettings.newestViewedCommentTimestamp,
            }
            return {
                ...state,
                userSettings: updated,
            }
        }

        default:
            return state
    }
}

export default function(state: IUserState = webInitialState, action: IWebUserAction): IUserState {
    state = userReducer(state, action as IUserAction)
    state = webUserReducer(state, action)
    return state
}
