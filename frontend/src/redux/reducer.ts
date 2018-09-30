import { combineReducers } from 'redux'
// import { routerReducer } from 'react-router-redux'

import userReducer from './user/userReducer'
import repoReducer from './repository/repoReducer'
import navigationReducer from './navigation/navigationReducer'
import commentReducer from './comment/commentReducer'
import discussionReducer from './discussion/discussionReducer'

import { IGlobalState } from './store'
// @@TODO: is this necessary?
// import { UserActionType } from './user/userActions'

const appReducer = combineReducers({
    // routing: routerReducer,
    user: userReducer,
    repository: repoReducer,
    navigation: navigationReducer,
    comment: commentReducer,
    discussion: discussionReducer,
})

const rootReducer = (state: IGlobalState|undefined, action: {type: string}): IGlobalState => {
    // @@TODO: is this necessary?
    // if (action.type === UserActionType.LOGOUT_SUCCESS) {
    //     state = undefined
    // }
    return appReducer(state, action)
}

export default rootReducer