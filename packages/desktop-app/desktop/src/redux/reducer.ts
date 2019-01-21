import { combineReducers } from 'redux'

import discussionReducer from 'conscience-components/redux/discussion/discussionReducer'
import orgReducer from 'conscience-components/redux/org/orgReducer'
import userReducer from './user/userReducer'
import repoReducer from './repo/repoReducer'
import uiReducer from './ui/uiReducer'

import { IGlobalState } from './store'

const appReducer = combineReducers({
    user: userReducer,
    repo: repoReducer,
    discussion: discussionReducer,
    org: orgReducer,
    ui: uiReducer,
})

const rootReducer = (state: IGlobalState | undefined, action: { type: string }): IGlobalState => {
    return appReducer(state, action)
}

export default rootReducer