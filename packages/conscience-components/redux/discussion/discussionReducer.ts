import uniq from 'lodash/uniq'
import { DiscussionActionType, IDiscussionAction } from './discussionActions'
import { IDiscussion, IComment } from 'conscience-lib/common'

const initialState = {
    discussions: {},
    discussionsByRepo: {},
    comments: {},
    commentsByDiscussion: {},
}

export interface IDiscussionState {
    discussions: { [discussionID: string]: IDiscussion }
    discussionsByRepo: { [repoID: string]: string[] } // array of discussionIDs

    comments: { [commentID: string]: IComment }
    commentsByDiscussion: { [repoID: string]: string[] } // array of commentIDs
}

const discussionReducer = (state: IDiscussionState = initialState, action: IDiscussionAction): IDiscussionState => {
    switch (action.type) {
        case DiscussionActionType.CREATE_DISCUSSION_SUCCESS: {
            const { discussion, comment } = action.payload
            const { repoID, discussionID } = discussion
            return {
                ...state,
                discussions: {
                    ...state.discussions,
                    [discussion.discussionID]: discussion,
                },
                discussionsByRepo: {
                    [repoID]: uniq([
                        ...(state.discussionsByRepo[repoID] || []),
                        discussion.discussionID,
                    ]),
                },
                comments: {
                    ...state.comments,
                    [comment.commentID]: comment,
                },
                commentsByDiscussion: {
                    [discussionID]: uniq([
                        ...(state.commentsByDiscussion[discussionID] || []),
                        comment.commentID,
                    ]),
                },
            }
        }

        case DiscussionActionType.GET_DISCUSSIONS_SUCCESS: {
            const { discussions } = action.payload
            return {
                ...state,
                discussions: {
                    ...state.discussions,
                    ...discussions,
                },
            }
        }

        case DiscussionActionType.GET_COMMENTS_SUCCESS: {
            const { comments } = action.payload
            return {
                ...state,
                comments: {
                    ...state.comments,
                    ...comments,
                },
            }
        }

        case DiscussionActionType.GET_DISCUSSIONS_FOR_REPO_SUCCESS: {
            const { repoID, discussions } = action.payload
            return {
                ...state,
                discussions: {
                    ...state.discussions,
                    ...discussions,
                },
                discussionsByRepo: {
                    ...state.discussionsByRepo,
                    [repoID]: uniq([
                        ...(state.discussionsByRepo[repoID] || []),
                        ...Object.keys(discussions),
                    ]),
                },
            }
        }

        case DiscussionActionType.GET_COMMENTS_FOR_DISCUSSION_SUCCESS: {
            const { discussionID, comments } = action.payload
            return {
                ...state,
                comments: {
                    ...state.comments,
                    ...comments,
                },
                commentsByDiscussion: {
                    ...state.commentsByDiscussion,
                    [discussionID]: uniq([
                        ...(state.commentsByDiscussion[discussionID] || []),
                        ...Object.keys(comments),
                    ]),
                },
            }
        }

        case DiscussionActionType.CREATE_COMMENT_SUCCESS: {
            const { comment } = action.payload
            const { commentID, discussionID } = comment
            return {
                ...state,
                discussions: {
                    ...state.discussions,
                    [discussionID]: {
                        ...state.discussions[discussionID],
                        lastCommentUser: comment.userID,
                        lastCommentTime: comment.created,
                    }
                },
                comments: {
                    ...state.comments,
                    [commentID]: comment,
                },
                commentsByDiscussion: {
                    ...state.commentsByDiscussion,
                    [discussionID]: uniq([
                        ...(state.commentsByDiscussion[discussionID] || []),
                        comment.commentID,
                    ]),
                },
            }
        }

        default:
            return state
    }
}

export default discussionReducer

// const derivedDataReducer = (state: IDiscussionState = initialState, action: IDiscussionAction): IDiscussionState => {
//     switch (action.type) {
//         case DiscussionActionType.CREATE_DISCUSSION_SUCCESS:
//         case DiscussionActionType.GET_DISCUSSIONS_FOR_REPO_SUCCESS:
//         case DiscussionActionType.GET_COMMENTS_FOR_DISCUSSION_SUCCESS:
//         case DiscussionActionType.CREATE_COMMENT_SUCCESS: {
//             const newestCommentTimestampPerDiscussion =
//                 values(state.comments)
//                     .reduce((into, each) => {
//                         if (into[each.discussionID] === undefined || into[each.discussionID] < each.created) {
//                             into[each.discussionID] = each.created
//                         }
//                         return into
//                     }, {} as { [discussionID: string]: number })


//             const discussionIDsSortedByNewestComment = {} as { [repoID: string]: string[] }
//             for (let repoID of Object.keys(state.discussionsByRepo)) {
//                 let discussionIDs = state.discussionsByRepo[repoID]
//                 let pairs = discussionIDs.map(discussionID => ({ discussionID, timestamp: newestCommentTimestampPerDiscussion[discussionID] }))
//                 discussionIDsSortedByNewestComment[repoID] =
//                     sortBy(pairs, 'timestamp')
//                         .reverse()
//                         .map(({ discussionID }) => discussionID)
//             }

//             return {
//                 ...state,
//                 newestCommentTimestampPerDiscussion,
//                 discussionIDsSortedByNewestComment,
//             }
//         }

//         default:
//             return state
//     }
// }

// export default function(state: IDiscussionState = initialState, action: IDiscussionAction): IDiscussionState {
//     state = discussionReducer(state, action)
//     state = derivedDataReducer(state, action)
//     return state
// }
