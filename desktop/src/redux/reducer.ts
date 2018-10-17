import { combineReducers } from 'redux'
// import { routerReducer } from 'react-router-redux'

import userReducer from './user/userReducer'
import repoReducer from './repository/repoReducer'
import navigationReducer from './navigation/navigationReducer'
import discussionReducer from './discussion/discussionReducer'
import editorReducer from './editor/editorReducer'

import { IGlobalState } from './store'
// @@TODO: is this necessary?
// import { UserActionType } from './user/userActions'

const appReducer = combineReducers({
    // routing: routerReducer,
    user: userReducer,
    repository: repoReducer,
    navigation: navigationReducer,
    discussion: discussionReducer,
    editor: editorReducer,
})

const rootReducer = (state: IGlobalState | undefined, action: {type: string}): IGlobalState => {
    // @@TODO: is this necessary?
    // if (action.type === UserActionType.LOGOUT_SUCCESS) {
    //     state = undefined
    // }
    return appReducer(state, action)
}

export default rootReducer