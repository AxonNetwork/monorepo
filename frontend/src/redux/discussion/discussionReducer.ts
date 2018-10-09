import { DiscussionActionType, IDiscussionAction } from './discussionActions'
import { IDiscussion, IComment } from '../../common'
import { values, flatMap, sortBy, toPairs } from 'lodash'

const initialState = {
    discussions: {},
    newestCommentTimestampPerDiscussion: {},
    selected: undefined,
    comments: {},
    discussionIDsSortedByNewestComment: {},
}

export interface IDiscussionState {
    discussions: {
        [repoID: string]: {
            [created: number]: IDiscussion,
        },
    }

    selected: number | undefined

    comments: {
        [repoID: string]: {
            [id: string]: IComment,
        },
    }

    newestCommentTimestampPerDiscussion: {[repoID: string]: {[discussionID: number]: number} }
    discussionIDsSortedByNewestComment: {[repoID: string]: number[]}
}

const discussionReducer = (state: IDiscussionState = initialState, action: IDiscussionAction): IDiscussionState => {
    switch (action.type) {
        case DiscussionActionType.CREATE_DISCUSSION_SUCCESS: {
            const { discussion, comment } = action.payload
            const repoID = discussion.repoID
            return {
                ...state,
                discussions: {
                    ...state.discussions,
                    [repoID]: {
                        ...(state.discussions[repoID] || {}),
                        [discussion.created]: discussion,
                    },
                },
                comments: {
                    ...state.comments,
                    [repoID]: {
                        ...(state.comments[repoID] || {}),
                        [`${comment.attachedTo.type}/${comment.attachedTo.subject}/${comment.created}`]: comment,
                    },
                },
            }
        }

        case DiscussionActionType.GET_DISCUSSIONS_SUCCESS: {
            const { repoID, discussions } = action.payload
            return {
                ...state,
                discussions: {
                    ...state.discussions,
                    [repoID]: {
                        ...(state.discussions[repoID] || {}),
                        ...discussions,
                    },
                },
            }
        }

        case DiscussionActionType.SELECT_DISCUSSION: {
            return {
                ...state,
                selected: action.payload.created,
            }
        }

        case DiscussionActionType.GET_COMMENTS_FOR_REPO_SUCCESS: {
            const { repoID, comments } = action.payload
            return {
                ...state,
                comments: {
                    ...state.comments,
                    [repoID]: {
                        ...(state.comments[repoID] || {}),
                        ...comments,
                    },
                },
            }
        }

        case DiscussionActionType.CREATE_COMMENT_SUCCESS: {
            const { comment } = action.payload
            const repoID = comment.repoID
            return {
                ...state,
                comments: {
                    ...state.comments,
                    [repoID]: {
                        ...(state.comments[repoID] || {}),
                        [`${comment.attachedTo.type}/${comment.attachedTo.subject}/${comment.created}`]: comment,
                    },
                },
            }
        }

        default:
            return state
    }
}

const derivedDataReducer = (state: IDiscussionState = initialState, action: IDiscussionAction): IDiscussionState => {
    switch (action.type) {
        case DiscussionActionType.CREATE_DISCUSSION_SUCCESS:
        case DiscussionActionType.GET_DISCUSSIONS_SUCCESS:
        case DiscussionActionType.GET_COMMENTS_FOR_REPO_SUCCESS:
        case DiscussionActionType.CREATE_COMMENT_SUCCESS: {
            const newestCommentTimestampPerDiscussion =
                flatMap(
                    values(state.comments)
                    .map(comments => values(comments)),
                )
                .filter(c => c.attachedTo.type === 'discussion')
                .reduce((into, each) => {
                    if (into[each.repoID] === undefined) {
                        into[each.repoID] = {}
                    }
                    if (into[each.repoID][each.attachedTo.subject] === undefined || into[each.repoID][each.attachedTo.subject] < each.created) {
                        into[each.repoID][each.attachedTo.subject] = each.created
                    }
                    return into
                }, {} as { [repoID: string]: {[discussionID: number]: number} })

            const discussionIDsSortedByNewestComment = {} as { [repoID: string]: number[] }
            for (let repoID of Object.keys(newestCommentTimestampPerDiscussion)) {
                discussionIDsSortedByNewestComment[repoID] =
                    sortBy(toPairs(newestCommentTimestampPerDiscussion[repoID]), (pair) => pair[1])
                    .map(pair => parseInt(pair[0], 10))
                    .reverse()
            }

            return {
                ...state,
                newestCommentTimestampPerDiscussion,
                discussionIDsSortedByNewestComment,
            }
        }

        default:
            return state
    }
}

export default function (state: IDiscussionState = initialState, action: IDiscussionAction): IDiscussionState {
    state = discussionReducer(state, action)
    state = derivedDataReducer(state, action)
    return state
}
