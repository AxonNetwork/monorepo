import userLogic from './user/userLogic'
import repoLogic from './repo/repoLogic'
import discussionLogic from 'conscience-components/redux/discussion/discussionLogic'
import orgLogic from 'conscience-components/redux/org/orgLogic'
import { searchLogic } from 'conscience-components/redux/search/searchLogic'

export default [
    ...userLogic,
    ...repoLogic,
    ...discussionLogic,
    ...orgLogic,
    searchLogic,
]