import discussionLogic from 'conscience-components/redux/discussion/discussionLogic'
import orgLogic from 'conscience-components/redux/org/orgLogic'
import userLogic from './user/userLogic'
import repoLogic from './repo/repoLogic'
import navigationLogic from './navigation/navigationLogic'
import editorLogic from './editor/editorLogic'

export default [
    ...userLogic,
    ...repoLogic,
    ...navigationLogic,
    ...discussionLogic,
    ...editorLogic,
    ...orgLogic,
]
