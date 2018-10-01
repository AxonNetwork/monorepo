import React from 'react'
import { connect } from 'react-redux'
import { values } from 'lodash'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import ButtonBase from '@material-ui/core/ButtonBase'
import SendIcon from '@material-ui/icons/Send'
import CancelIcon from '@material-ui/icons/Cancel'
import Avatar from '@material-ui/core/Avatar'
import moment from 'moment'

import { createComment } from '../../../../redux/comment/commentActions'
import { IUser, IComment } from '../../../../common'
import autobind from 'utils/autobind'
import { strToColor } from 'utils'
import { IGlobalState } from 'redux/store'

@autobind
class Thread extends React.Component<Props, State>
{
    state = {
        comment: '',
    }

    handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>) {
        if (event.key === 'Enter' && event.shiftKey) {
            this.handleSubmit(event)
        }
    }

    handleChange(event:  React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) {
        this.setState({comment: event.target.value})
    }

    async handleSubmit(event: React.KeyboardEvent<HTMLDivElement>|React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (this.state.comment.length === 0) {
            return
        }
        await this.props.createComment({
            repoID: this.props.repoID,
            text: this.state.comment,
            attachedTo: {
                type: this.props.type,
                subject: this.props.subject,
            },
        })

        this.setState({comment: ''})
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

                                    <div className={classes.comment}>
                                        <Typography className={classes.commentHeader}><strong>{username}</strong> <small>({moment(c.created).fromNow()})</small></Typography>
                                        <div className={classes.commentBody}>
                                            {c.text.split('\n').map((p, i) => (
                                                <Typography className={classes.commentText} key={i}>{p}</Typography>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <form onSubmit={this.handleSubmit} className={classes.reply}>
                        <TextField
                            id="comment"
                            value={this.state.comment}
                            placeholder="Comment (Shift + Enter to send)"
                            multiline
                            rows={2}
                            rowsMax={8}
                            onChange={this.handleChange}
                            onKeyUp={this.handleKeyPress}
                            className={classes.textField}
                        />
                        <ButtonBase type="submit" className={classes.submit}>
                            <SendIcon className={classes.icon}/>
                        </ButtonBase>
                    </form>
                </div>
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
    unselect?: Function
    createComment: Function
    classes: any
}

interface State {
    comment: string
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
    comment: {
        margin: theme.spacing.unit * 2,
        padding: 0,
        border: '1px solid #e2e2e2',
        borderRadius: 6,
        backgroundColor: 'white',
        flexGrow: 1,
    },
    commentHeader: {
        backgroundColor: '#f1f1f1',
        padding: '8px 12px',
        borderBottom: '1px solid #e2e2e2',
        color: '#545454',
    },
    commentBody: {
        padding: theme.spacing.unit * 2,

        '& p': {
            paddingBottom: 6,
        },
    },
    text: {
        paddingBottom: theme.spacing.unit * 0.25,
        marginLeft: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 0.5,
        borderLeft: '2px solid',
        borderColor: theme.palette.grey[400],
    },
    reply: {
        display: 'flex',
        alignSelf: 'flex-end',
        width: '100%',
        borderTop: '1px solid',
        borderColor: theme.palette.grey[300],
    },
    textField: {
        flexGrow: 1,
        padding: theme.spacing.unit,
    },
    submit: {
        padding: theme.spacing.unit,
        borderRadius: 4,
    },
    icon: {
        color: theme.palette.grey[700],
    },
})


const mapStateToProps = (state: IGlobalState) => {
    const selected = state.repository.selectedRepo || ''
    const repoID = (state.repository.repos[selected] || {}).repoID
    return {
        repoID,
        comments: state.comment.comments[repoID] || {},
        users: state.user.users,
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