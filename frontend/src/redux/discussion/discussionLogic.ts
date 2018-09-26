import { createLogic } from 'redux-logic'
import { DiscussionActionType, getDiscussions, getDiscussionsSuccess } from './discussionActions'
import { FETCHED_OTHER_USER_INFO } from '../user/userActions'
import ServerRelay from '../../lib/ServerRelay'
import { getNames } from '../reduxUtils'
import to from 'await-to-js'
import Promise from 'bluebird'
import * as uniq from 'lodash.uniq'

const getDiscussionsLogic = createLogic({
    type: DiscussionActionType.GET_DISCUSSIONS,
    async process({ getState, action }, dispatch, done) {
        let discussions, comments
        try {
            [discussions, comments] = await Promise.all([
                ServerRelay.getDiscussions(action.repoID),
                ServerRelay.getComments(action.repoID)
            ])
        } catch (err) {
            console.log('error in getDiscussionsLogic ~>', err)
            return done(err)
        }
        const users = getState().user.users
        comments = await attachNames(comments, users, dispatch)
        await dispatch(getDiscussionsSuccess({ discussions, comments }))
        done()
    }
})

// @@TODO: do this join in the components rather than here in the redux state
const attachNames = async function(comments, users, dispatch) {
    const emails = uniq(comments.map(c => c.user))
    const names = await getNames(emails, users, dispatch)
    comments = comments.map(c => {
        c.name = names[c.user]
        return c
    })
    return comments
}

const createDiscussionLogic = createLogic({
    type: DiscussionActionType.CREATE_DISCUSSION,
    async process({ getState, action }, dispatch, done) {
        try {
            await to(ServerRelay.createDiscussion(action.repoID, action.subject, action.commentText))
        } catch (err) {
            console.error('error in createDiscussionLogic ~>', err)
            return done(err)
        }
        await dispatch(getDiscussions({ repoID: action.repoID }))
        done()
    }
})

const createCommentLogic = createLogic({
    type: DiscussionActionType.CREATE_COMMENT,
    async process({ getState, action }, dispatch, done) {
        const [response, err] = await to(ServerRelay.createComment(action.repoID, action.text, action.attachedTo))
        if (err) {
            console.error('error in createCommentLogic ~>', err)
            return done(err)
        }
        done()
    }
})

export default [
    getDiscussionsLogic,
    createDiscussionLogic,
    createCommentLogic,
]
