import userLogic from './user/userLogic'
import repoLogic from './repo/repoLogic'

export default [
	...userLogic,
	...repoLogic,
]