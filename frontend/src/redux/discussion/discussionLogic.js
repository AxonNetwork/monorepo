import { createLogic } from 'redux-logic'
import { CREATE_DISCUSSION, GET_DISCUSSIONS, GOT_DISCUSSIONS, CREATE_COMMENT } from './discussionActions'
import { FETCHED_OTHER_USER_INFO } from '../user/userActions'
import ServerRelay from '../../lib/ServerRelay'
import { getNames } from '../reduxUtils'
import to from 'await-to-js'
import Promise from 'bluebird'

const getDiscussions = createLogic({
    type: GET_DISCUSSIONS,
    async process({ getState, action }, dispatch, done) {
        let discussions, comments
        try{
            [discussions, comments] = await Promise.all([
                ServerRelay.getDiscussions(action.repoID),
                ServerRelay.getComments(action.repoID)
            ])
        }catch(err){
            console.log(err)
            done()
        }
        const users = getState().user.users
        comments = await attachNames(comments, users, dispatch)
        await dispatch({
            type: GOT_DISCUSSIONS,
            discussions: discussions,
            comments: comments
        })
        done()
    }
})

const attachNames = async function(comments, users, dispatch){
    const onlyUnique = (value, index, self) =>{
        return self.indexOf(value) === index
    }
    const emails = comments.map(c=>c.user).filter(onlyUnique)
    const names = await getNames(emails, users, dispatch)
    comments = comments.map(c=>{
        c.name=names[c.user]
        return c
    })
    return comments
}

const createDiscussion = createLogic({
    type: CREATE_DISCUSSION,
    async process({ getState, action }, dispatch, done) {
        try{
            await to(ServerRelay.createDiscussion(action.repoID, action.subject, action.commentText))
        }catch(err){
            done()
        }
        await dispatch({
            type: GET_DISCUSSIONS,
            repoID: action.repoID
        })
        done()
    }
})

const createComment = createLogic({
    type: CREATE_COMMENT,
    async process({ getState, action }, dispatch, done) {
        const [response, err] = await to(ServerRelay.createComment(action.repoID, action.text, action.attachedTo))
        if(err) done()
        done()
    }
})

export default [
    getDiscussions,
    createDiscussion,
    createComment,
]
