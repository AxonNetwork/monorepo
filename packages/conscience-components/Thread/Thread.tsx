import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CancelIcon from '@material-ui/icons/Cancel'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'

import { createComment, getCommentsForDiscussion } from '../redux/discussion/discussionActions'
import { sawComment } from '../redux/user/userActions'
import { IGlobalState } from '../redux'
import { getRepoID } from '../env-specific'
import { IUser, IComment, IDiscussion, URI } from 'conscience-lib/common'
import { autobind, checkVisible } from 'conscience-lib/utils'
import RenderMarkdown from '../RenderMarkdown'
import SmartTextarea from '../SmartTextarea'
import CommentWrapper from '../CommentWrapper'
import CommentLoader from '../ContentLoaders/CommentLoader'
import values from 'lodash/values'


@autobind
class Thread extends React.Component<Props, State>
{
    _intervalID: any | undefined // Timer ID, can't get Typescript to accept this
    _commentRefs = {} as { [commentID: string]: { created: number, ref: any } }
    _inputComment: {
        setSelectionRange(start: number, end: number): void
        focus(): void
    } | null = null
    _bottomDiv: HTMLDivElement | null = null

    state = {
        createCommentError: undefined,
        didInitialScroll: false,
        newCommentText: '',
    }

    componentDidMount() {
        this.props.getCommentsForDiscussion({ discussionID: this.props.discussionID })

        // Check each rendered comment to see if it's visible.  If so, and the user hasn't seen it yet, we mark it as seen based on its timestamp.
        // @@TODO: consider doing this with a debounced window.scroll event rather than a naive interval timer
        const checkSeenComments = () => {
            let mostRecentVisible = { commentID: '', created: -1 } as { commentID: string, created: number }

            for (let commentID of Object.keys(this._commentRefs)) {
                // Sometimes refs are null, probably when an element hasn't been rendered yet
                if (this._commentRefs[commentID] === null || this._commentRefs[commentID] === undefined ||
                    this._commentRefs[commentID].ref === null || this._commentRefs[commentID].ref === undefined) {
                    continue
                }
                if (checkVisible(this._commentRefs[commentID].ref) && this._commentRefs[commentID].created > mostRecentVisible.created) {
                    mostRecentVisible = { commentID, created: this._commentRefs[commentID].created }
                }
            }
            if (this.props.newestViewedCommentTimestamp < mostRecentVisible.created) {
                this.props.sawComment({ uri: this.props.uri, discussionID: this.props.discussionID, commentTimestamp: mostRecentVisible.created })
            }
        }
        this._intervalID = setInterval(checkSeenComments, 5000)
        checkSeenComments()

        // Scroll to comment if we have a URL hash
        this.checkURLHashForCommentID()
    }

    checkURLHashForCommentID() {
        if (this.props.history.location.hash.length > 0 && !this.state.didInitialScroll) {
            const commentID = this.props.history.location.hash.slice(1)

            if (this._commentRefs[commentID] && this._commentRefs[commentID].ref) {
                this._commentRefs[commentID].ref.scrollIntoView()
                this.setState({ didInitialScroll: true })
            }
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.discussionID != prevProps.discussionID) {
            this.props.getCommentsForDiscussion({ discussionID: this.props.discussionID })
        }
        // Scroll to comment if we have a URL hash.  We continue to do this after componentDidMount
        // in case the comment doesn't render the first time.
        this.checkURLHashForCommentID()
    }

    componentWillUnmount() {
        if (this._intervalID) {
            clearInterval(this._intervalID)
            this._intervalID = undefined
        }
    }

    async onClickCreateComment() {
        if (this.state.newCommentText.length === 0) {
            return
        }

        await this.props.createComment({
            uri: this.props.uri,
            discussionID: this.props.discussionID,
            text: this.state.newCommentText,
            callback: (err?: Error) => {
                if (err) {
                    this.setState({ createCommentError: err.toString() })
                } else {
                    this.setState({ newCommentText: '', createCommentError: undefined })
                }
            },
        })
    }

    render() {
        const { discussionID, discussions, comments, users, currentUser, classes } = this.props

        const discussion = discussions[discussionID]
        if (!discussion) {
            return null
        }
        const commentsList = values(comments).filter(c => c.discussionID === this.props.discussionID)
        const selectedCommentID = this.props.history.location.hash.slice(1)

        return (
            <div className={classes.threadContainer}>
                {this.props.unselect !== undefined &&
                    <IconButton
                        onClick={this.props.unselect as any}
                        className={classes.cancel}
                    >
                        <CancelIcon />
                    </IconButton>
                }
                <Typography variant="title" className={classes.title}>{discussion.subject}</Typography>
                {commentsList.length === 0 ?
                    Array(3).fill(0).map(i => (
                        <CommentLoader />
                    )) : null
                }
                {commentsList.length > 0 &&
                    <div className={classes.thread}>
                        <div className={classes.comments}>

                            {commentsList.map(c => {
                                return (
                                    <div ref={ref => this._commentRefs[c.commentID] = { ref, created: c.created }}>
                                        <CommentWrapper
                                            key={c.created}
                                            user={users[c.userID]}
                                            created={c.created}
                                            showBadge={c.created > this.props.newestViewedCommentTimestamp}
                                            onClickReplyLink={() => this.onClickReplyLink(c.commentID)}
                                            classes={{ commentText: selectedCommentID === c.commentID ? classes.selectedComment : undefined }}
                                        >
                                            <RenderMarkdown
                                                uri={this.props.uri}
                                                text={c.text}
                                            />
                                        </CommentWrapper>
                                    </div>
                                )
                            })}

                            {/* Create comment form */}
                            <CommentWrapper
                                user={users[currentUser]}
                                created={"right now"}
                            >
                                {this.state.createCommentError &&
                                    <FormHelperText error className={classes.createCommentError}>{this.state.createCommentError}</FormHelperText>
                                }
                                <SmartTextarea
                                    uri={this.props.uri}
                                    placeholder="Write your comment"
                                    value={this.state.newCommentText}
                                    onChange={this.onChangeNewCommentText}
                                    rows={3}
                                    innerRef={(x: any) => this._inputComment = x}
                                    onSubmit={this.onClickCreateComment}
                                />
                                <Button color="secondary" variant="contained" onClick={this.onClickCreateComment}>
                                    Comment
                                </Button>
                            </CommentWrapper>

                            {/* this div is used for scrolling down to CreateComment when a user clicks 'reply' */}
                            <div ref={x => this._bottomDiv = x}></div>
                        </div>
                    </div>
                }
            </div>
        )
    }

    onChangeNewCommentText = (newCommentText: string) => {
        this.setState({ newCommentText })
    }

    onClickReplyLink(commentID: string) {
        if (!this._inputComment) {
            return
        }

        const currentValue = this.state.newCommentText
        const newValue = currentValue.trim().length > 0
            ? currentValue + ` @comment:[${commentID}] `
            : currentValue + `@comment:[${commentID}] `

        this.setState({ newCommentText: newValue }, () => {
            setTimeout(() => {
                // move cursor to end of box
                if (this._inputComment.setSelectionRange) {
                    this._inputComment.setSelectionRange(newValue.length, newValue.length)
                }

                if (this._bottomDiv) {
                    this._bottomDiv.scrollIntoView({ behavior: 'smooth' })
                    setTimeout(() => this._inputComment.focus(), 1000)
                }
            }, 0)
        })
    }
}

type Props = OwnProps & StateProps & DispatchProps & RouteComponentProps & { classes: any }

interface OwnProps {
    uri: URI
    discussionID: string
    unselect?: () => void
}

interface StateProps {
    repoID: string
    currentUser: string
    users: { [userID: string]: IUser }
    discussions: { [discussionID: string]: IDiscussion }
    comments: { [commentID: string]: IComment }
    newestViewedCommentTimestamp: number
}

interface DispatchProps {
    getCommentsForDiscussion: typeof getCommentsForDiscussion
    createComment: typeof createComment
    sawComment: typeof sawComment
}

interface State {
    createCommentError: string | undefined
    didInitialScroll: boolean
    newCommentText: string
}

const styles = (theme: Theme) => createStyles({
    threadContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',

        '& a': {
            wordBreak: 'break-all',
        },
    },
    cancel: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: theme.spacing.unit,
    },
    title: {
        padding: theme.spacing.unit,
        fontSize: '1.8rem',
    },
    thread: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        alignItems: 'center',
    },
    comments: {
        overflow: 'auto',
        flexGrow: 1,
        backgroundColor: '#f7f7f76b',
        maxWidth: 660,
        width: '100%',
    },
    createCommentError: {
        fontSize: '0.9rem',
        fontWeight: 500,
    },
    selectedComment: {
        backgroundColor: '#fff8d4',
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const repoID = getRepoID(ownProps.uri)
    return {
        repoID,
        currentUser: state.user.currentUser || '',
        users: state.user.users,
        discussions: state.discussion.discussions,
        comments: state.discussion.comments,
        newestViewedCommentTimestamp: (((state.user.userSettings.newestViewedCommentTimestamp || {})[repoID] || {})[ownProps.discussionID]) || 0,
    }
}

const mapDispatchToProps = {
    getCommentsForDiscussion,
    createComment,
    sawComment,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(withRouter(Thread)))
