import userLogic from './user/userLogic'
import repoLogic from './repository/repoLogic'
import navigationLogic from './navigation/navigationLogic'
import commentLogic from './comment/commentLogic'
import discussionLogic from './discussion/discussionLogic'

export default [
    ...userLogic,
    ...repoLogic,
    ...navigationLogic,
    ...commentLogic,
    ...discussionLogic
]
