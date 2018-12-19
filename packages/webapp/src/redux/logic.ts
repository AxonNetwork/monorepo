import userLogic from './user/userLogic'
import repoLogic from './repo/repoLogic'
import discussionLogic from './discussion/discussionLogic'
import orgLogic from './org/orgLogic'

export default [
	...userLogic,
	...repoLogic,
	...discussionLogic,
	...orgLogic,
]