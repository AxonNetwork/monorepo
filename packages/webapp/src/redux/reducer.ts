import { combineReducers } from 'redux'

import userReducer from './user/userReducer'
import repoReducer from './repo/repoReducer'

import { IGlobalState } from './store'

const appReducer = combineReducers({
	user: userReducer,
	repo: repoReducer,
})

const rootReducer = (state: IGlobalState | undefined, action: {type: string}): IGlobalState => {
	return appReducer(state, action)
}

export default rootReducer