import userLogic from './user/userLogic'
import repoLogic from './repo/repoLogic'
import discussionLogic from './discussion/discussionLogic'

export default [
	...userLogic,
	...repoLogic,
	...discussionLogic,
]