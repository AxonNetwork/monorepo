import React from 'react'
import { connect } from 'react-redux'
import { values } from 'lodash'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CancelIcon from '@material-ui/icons/Cancel'

import { createComment } from 'redux/comment/commentActions'
import { selectFile } from 'redux/repository/repoActions'
import { IUser, IComment, IRepo, IDiscussion } from 'common'
import autobind from 'utils/autobind'
import { IGlobalState } from 'redux/store'
import CommentWrapper from './CommentWrapper'
import RenderMarkdown from 'components/RenderMarkdown/RenderMarkdown'
import CreateComment from './CreateComment'

@autobind
class Thread extends React.Component<Props>
{
    async handleSubmit(comment: string) {
        if (comment.length === 0) {
            return
        }
        await this.props.createComment({
            repoID: this.props.repo.repoID,
            text: comment,
            attachedTo: {
                type: this.props.type,
                subject: this.props.subject,
            },
        })
    }

    render() {
        const { classes, title, comments } = this.props
        const commentsList = values(comments).filter(c => c.attachedTo.type === this.props.type && c.attachedTo.subject === this.props.subject)

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
                            const username = (this.props.users[c.user] || {}).name || c.user
                            return (
                                <CommentWrapper
                                    key={c.created}
                                    username={username}
                                    created={c.created}
                                >
                                    <RenderMarkdown
                                        text={c.text}
                                        basePath={this.props.repo.path}
                                    />
                                </CommentWrapper>
                            )
                        })}
                    </div>
                </div>
                <CreateComment
                    files={this.props.repo.files}
                    discussions={this.props.discussions}
                    onSubmit={this.handleSubmit}
                />
            </div>
        )
    }
}

interface Props {
    title: string
    type: 'discussion' | 'file' | 'event'
    subject: number | string
    repo: IRepo
    users: {[id: string]: IUser}
    comments: {[id: string]: IComment}
    discussions: {[created: number]: IDiscussion}
    unselect?: Function
    createComment: typeof createComment
    selectFile: typeof selectFile
    classes?: any
}

const styles = (theme: Theme) => createStyles({
    threadContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        wordBreak: 'break-all',
    },
    cancel: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: theme.spacing.unit,
    },
    title: {
        backgroundColor: theme.palette.grey[300],
        padding: theme.spacing.unit,
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
})


const mapStateToProps = (state: IGlobalState, ownProps: Props) => {
    const discussions = state.discussion.discussions[ownProps.repo.repoID] || {}
    return {
        comments: state.comment.comments[ownProps.repo.repoID] || {},
        users: state.user.users,
        discussions,
    }
}

const mapDispatchToProps = {
    createComment,
    selectFile,
}

const ThreadContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(Thread))

export default ThreadContainer