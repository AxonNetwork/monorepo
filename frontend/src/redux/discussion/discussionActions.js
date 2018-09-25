// action types
export const GET_DISCUSSIONS = 'GET_DISCUSSIONS'
export const GOT_DISCUSSIONS = 'GOT_DISCUSSIONS'
export const SELECT_DISCUSSION = 'SELECT_DISCUSSION'
export const CREATE_DISCUSSION = 'CREATE_DISCUSSION'
export const CREATE_COMMENT = 'CREATE_COMMENT'

export const actionTypes = {
    GET_DISCUSSIONS,
    GOT_DISCUSSIONS,
    SELECT_DISCUSSION,
    CREATE_DISCUSSION,
    CREATE_COMMENT,
}

// action creators
export const getDiscussions = (repoID) => ({ type: GET_DISCUSSIONS, repoID: repoID })
export const selectDiscussion = (created) => ({ type: SELECT_DISCUSSION, created: created })
export const createDiscussion = (repoID, subject, commentText) => ({ type: CREATE_DISCUSSION, repoID: repoID, subject: subject, commentText: commentText })
export const createComment = (repoID, text, attachedTo, user) => ({ type: CREATE_COMMENT, repoID: repoID, text: text, attachedTo: attachedTo, user: user })

export const actionCreators = {
    getDiscussions,
    selectDiscussion,
    createDiscussion,
    createComment,
}
