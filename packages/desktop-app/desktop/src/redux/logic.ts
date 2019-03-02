import discussionLogic from 'conscience-components/redux/discussion/discussionLogic'
import orgLogic from 'conscience-components/redux/org/orgLogic'
import searchLogic from 'conscience-components/redux/search/searchLogic'
import userLogic from './user/userLogic'
import repoLogic from './repo/repoLogic'

export default [
    ...userLogic,
    ...repoLogic,
    ...discussionLogic,
    ...orgLogic,
    ...searchLogic,
]
