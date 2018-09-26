import { GOT_DISCUSSIONS, SELECT_DISCUSSION, CREATE_COMMENT } from './discussionActions'

const initialState = {
    discussions: [],
    comments: []
}

const discussionReducer = (state = initialState, action) => {
    switch(action.type){
        case GOT_DISCUSSIONS:
            return{
                ...state,
                discussions: action.discussions,
                comments: action.comments
            }
        case SELECT_DISCUSSION:
            return{
                ...state,
                selected: action.created
            }
        case CREATE_COMMENT:
            return{
                ...state,
                comments:[
                    ...state.comments,
                    {
                        attachedTo: action.attachedTo,
                        repoID: action.repoID,
                        text: action.text,
                        user: action.user,
                        created: new Date().getTime(),
                    }
                ]
            }
        default:
            return state
    }
}

export default discussionReducer
