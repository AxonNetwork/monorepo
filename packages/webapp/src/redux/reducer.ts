import { combineReducers } from 'redux'

import userReducer from './user/userReducer'
import repoReducer from './repo/repoReducer'
import discussionReducer from 'conscience-components/redux/discussion/discussionReducer'
import orgReducer from 'conscience-components/redux/org/orgReducer'
import uiReducer from 'conscience-components/redux/ui/uiReducer'
import searchReducer from 'conscience-components/redux/search/searchReducer'

import { IGlobalState } from 'conscience-components/redux'

const appReducer = combineReducers({
    user: userReducer,
    repo: repoReducer,
    discussion: discussionReducer,
    org: orgReducer,
    ui: uiReducer,
    search: searchReducer,
})

const rootReducer = (state: IGlobalState | undefined, action: { type: string }): IGlobalState => {
    return appReducer(state, action)
}

export default rootReducer