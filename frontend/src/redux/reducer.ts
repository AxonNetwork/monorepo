import { combineReducers } from 'redux'
// import { routerReducer } from 'react-router-redux'

import userReducer from './user/userReducer'
import repoReducer from './repository/repoReducer'
import sharedReposReducer from './sharedRepos/sharedReposReducer'
import navigationReducer from './navigation/navigationReducer'
import commentReducer from './comment/commentReducer'
import discussionReducer from './discussion/discussionReducer'

// @@TODO: is this necessary?
import { LOGOUT_SUCCESS } from './user/userActions'

const appReducer = combineReducers({
    // routing: routerReducer,
    user: userReducer,
    repository: repoReducer,
    sharedRepos: sharedReposReducer,
    navigation: navigationReducer,
    comment: commentReducer,
    discussion: discussionReducer,
})

const rootReducer = (state, action) => {
    // @@TODO: is this necessary?
    if (action.type === LOGOUT_SUCCESS) {
        state = undefined
    }
    return appReducer(state, action)
}

export default rootReducer