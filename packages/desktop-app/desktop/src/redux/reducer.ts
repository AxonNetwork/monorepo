import { combineReducers } from 'redux'
// import { routerReducer } from 'react-router-redux'

import discussionReducer from 'conscience-components/redux/discussion/discussionReducer'
import orgReducer from 'conscience-components/redux/org/orgReducer'
import userReducer from './user/userReducer'
import repoReducer from './repository/repoReducer'
import editorReducer from './editor/editorReducer'
import navigationReducer from './navigation/navigationReducer'
import uiReducer from './ui/uiReducer'

import { IGlobalState } from './store'
// @@TODO: is this necessary?
// import { UserActionType } from './user/userActions'

const appReducer = combineReducers({
    // routing: routerReducer,
    user: userReducer,
    repo: repoReducer,
    discussion: discussionReducer,
    editor: editorReducer,
    org: orgReducer,
    navigation: navigationReducer,
    ui: uiReducer,
})

const rootReducer = (state: IGlobalState | undefined, action: { type: string }): IGlobalState => {
    // @@TODO: is this necessary?
    // if (action.type === UserActionType.LOGOUT_SUCCESS) {
    //     state = undefined
    // }
    return appReducer(state, action)
}

export default rootReducer