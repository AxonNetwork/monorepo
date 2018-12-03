import userLogic from './user/userLogic'
import repoLogic from './repository/repoLogic'
import navigationLogic from './navigation/navigationLogic'
import discussionLogic from './discussion/discussionLogic'
import editorLogic from './editor/editorLogic'
import orgLogic from './org/orgLogic'

export default [
    ...userLogic,
    ...repoLogic,
    ...navigationLogic,
    ...discussionLogic,
    ...editorLogic,
    ...orgLogic,
]
