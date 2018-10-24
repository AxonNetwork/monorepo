import React from 'react'
import { connect } from 'react-redux'
import { values } from 'lodash'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CancelIcon from '@material-ui/icons/Cancel'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'

import { createComment } from 'redux/discussion/discussionActions'
import { selectFile } from 'redux/repository/repoActions'
import { sawComment } from 'redux/user/userActions'
import { IUser, IComment, IRepo, IDiscussion } from 'common'
import autobind from 'utils/autobind'
import { IGlobalState } from 'redux/store'
import RenderMarkdown from 'components/RenderMarkdown/RenderMarkdown'
import SmartTextarea from 'components/SmartTextarea'
import CommentWrapper from 'components/Repository/elements/Discussion/CommentWrapper'
import checkVisible from 'utils/checkVisible'


@autobind
class Thread extends React.Component<Props, State>
{
    _intervalID: any | undefined // Timer ID, can't get Typescript to accept this
    _commentRefs = {} as {[commentID: string]: {created: number, ref: any}}
    _inputComment!: any
    _bottomDiv: HTMLDivElement | null = null

    state = {
        createCommentError: undefined,
    }

    componentDidMount() {
        // Check each rendered comment to see if it's visible.  If so, and the user hasn't seen it yet, we mark it as seen based on its timestamp.
        // @@TODO: consider doing this with a debounced window.scroll event rather than a naive interval timer
        const checkSeenComments = () => {
            let mostRecentVisible = { commentID: '', created: -1 } as {commentID: string, created: number}

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
                this.props.sawComment({ repoID: this.props.repo.repoID, discussionID: this.props.discussionID, commentTimestamp: mostRecentVisible.created })
            }
        }
        this._intervalID = setInterval(checkSeenComments, 5000)
        checkSeenComments()
    }

    componentWillUnmount() {
        if (this._intervalID) {
            clearInterval(this._intervalID)
            this._intervalID = undefined
        }
    }

    async onClickCreateComment() {
        const comment = this._inputComment.getValue()
        if (comment.length === 0) {
            return
        }
        await this.props.createComment({
            repoID: this.props.repo.repoID,
            discussionID: this.props.discussionID,
            text: comment,
            callback: (err) => {
                if (err) {
                    this.setState({ createCommentError: err.toString() })
                } else {
                    this._inputComment.setValue('')
                    this.setState({ createCommentError: undefined })
                }
            },
        })
    }

    render() {
        const { classes, title, comments } = this.props
        const commentsList = values(comments).filter(c => c.discussionID === this.props.discussionID)

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
                <Typography variant="title" className={classes.title}>{title}</Typography>
                <div className={classes.thread}>
                    <div className={classes.comments}>
                        {commentsList.length === 0 &&
                            <Typography className={classes.comment}>No comments yet. Start the discussion!</Typography>
                        }
                        {commentsList.map(c => {
                            const username = (this.props.users[c.userID] || {}).name || c.userID
                            const userPicture = (this.props.users[c.userID] || {}).picture
                            return (
                                <CommentWrapper
                                    key={c.created}
                                    username={username}
                                    userPicture={userPicture}
                                    created={c.created}
                                    showBadge={c.created > this.props.newestViewedCommentTimestamp}
                                    onClickReplyLink={() => this.onClickReplyLink(c.commentID)}
                                >
                                    <div ref={ ref => this._commentRefs[c.created] = {ref, created: c.created} }></div>
                                    <RenderMarkdown
                                        text={c.text}
                                        basePath={this.props.repo.path}
                                    />
                                </CommentWrapper>
                            )
                        })}

                        {/* Create comment form */}
                        <CommentWrapper
                            username={this.props.username}
                            userPicture={this.props.userPicture}
                            created={new Date().getTime()}
                        >
                            {this.state.createCommentError &&
                                <FormHelperText error className={classes.createCommentError}>{this.state.createCommentError}</FormHelperText>
                            }
                            <SmartTextarea
                                placeholder="Write your comment"
                                rows={3}
                                innerRef={(x: any) => this._inputComment = x}
                                files={this.props.repo.files}
                                discussions={this.props.discussions}
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
            </div>
        )
    }

    onClickReplyLink(commentID: string) {
        const currentValue = this._inputComment.getValue()
        if (currentValue.trim().length > 0) {
            this._inputComment.setValue(currentValue + ` @comment:[${commentID}] `)
        } else {
            this._inputComment.setValue(currentValue + `@comment:[${commentID}] `)
        }

        if (this._bottomDiv) {
            this._bottomDiv.scrollIntoView({ behavior: 'smooth' })
            setTimeout(() => this._inputComment.focus(), 1000)
        }
    }
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    title: string
    discussionID: string
    repo: IRepo
    unselect?: Function
}

interface StateProps {
    users: {[userID: string]: IUser}
    comments: {[commentID: string]: IComment}
    discussions: {[discussionID: string]: IDiscussion}
    username: string | undefined
    userPicture: string | undefined
    newestViewedCommentTimestamp: number
}

interface DispatchProps {
    createComment: typeof createComment
    selectFile: typeof selectFile
    sawComment: typeof sawComment
}

interface State {
    createCommentError: string | undefined
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
    },
    comments: {
        overflow: 'auto',
        flexGrow: 1,
        backgroundColor: '#f7f7f76b',
    },
    createCommentError: {
        fontSize: '0.9rem',
        fontWeight: 500,
    },
})


const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const discussions = state.discussion.discussions || {}
    const username = (state.user.users[ state.user.currentUser || '' ] || {}).name
    const userPicture = (state.user.users[ state.user.currentUser || '' ] || {}).picture
    return {
        comments: state.discussion.comments,
        users: state.user.users,
        newestViewedCommentTimestamp: (state.user.newestViewedCommentTimestamp[ownProps.repo.repoID] || {})[ownProps.discussionID] || -1,
        discussions,
        username: username,
        userPicture: userPicture,
    }
}

const mapDispatchToProps = {
    createComment,
    selectFile,
    sawComment,
}

const ThreadContainer = connect< StateProps, DispatchProps, OwnProps, IGlobalState >(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(Thread))

export default ThreadContainer