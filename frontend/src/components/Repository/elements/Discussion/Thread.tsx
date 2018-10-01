import React from 'react'
import { connect } from 'react-redux'
import { values } from 'lodash'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CancelIcon from '@material-ui/icons/Cancel'
import Avatar from '@material-ui/core/Avatar'

import { createComment } from '../../../../redux/comment/commentActions'
import { IUser, IComment, IRepoFile } from '../../../../common'
import autobind from 'utils/autobind'
import { strToColor } from 'utils'
import { IGlobalState } from 'redux/store'
import CommentText from './CommentText'
import CreateComment from './CreateComment'

@autobind
class Thread extends React.Component<Props>
{
    async handleSubmit(comment: string) {
        if (comment.length === 0) {
            return
        }
        await this.props.createComment({
            repoID: this.props.repoID,
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
                            const userInitials = username.split(' ').map(x => x.substring(0, 1)).map(x => x.toUpperCase()).join('')
                            const color = strToColor(username)
                            return (
                                <div className={classes.commentRow} key={c.created}>
                                    <div className={classes.commentAvatar}>
                                        <Avatar style={{ backgroundColor: color }}>{userInitials}</Avatar>
                                    </div>
                                    <CommentText
                                        username={username}
                                        created={c.created}
                                        text={c.text}
                                    />

                                </div>
                            )
                        })}
                    </div>
                </div>
                <CreateComment
                    files={this.props.files}
                    onSubmit={this.handleSubmit}
                />
            </div>
        )
    }
}

interface Props {
    title: string
    type: string
    subject: number|string
    repoID: string
    users: {[id: string]: IUser}
    comments: {[id: string]: IComment}
    files:{[name: string]: IRepoFile}
    unselect?: Function
    createComment: Function
    classes: any
}

const styles = (theme: Theme) => createStyles({
    threadContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
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
    commentRow: {
        display: 'flex',
    },
    commentAvatar: {
        flexGrow: 0,
        flexShrink: 0,
        padding: '24px 0 10px 16px',
        '& div': {
            backgroundColor: '#006ea2',
        },
    },
})


const mapStateToProps = (state: IGlobalState) => {
    const selected = state.repository.selectedRepo || ''
    const repoID = (state.repository.repos[selected] || {}).repoID
    const files = (state.repository.repos[selected] || {}).files
    return {
        repoID,
        comments: state.comment.comments[repoID] || {},
        users: state.user.users,
        files: files
    }
}

const mapDispatchToProps = {
    createComment,
}

const ThreadContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(Thread))

export default ThreadContainer