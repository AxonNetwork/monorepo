import userLogic from './user/userLogic'
import repoLogic from './repository/repoLogic'
import sharedReposLogic from './sharedRepos/sharedReposLogic'
import navigationLogic from './navigation/navigationLogic'
import discussionLogic from './discussion/discussionLogic'

export default [
    ...userLogic,
    ...repoLogic,
    ...sharedReposLogic,
    ...navigationLogic,
    ...discussionLogic
]
