import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import ButtonBase from '@material-ui/core/ButtonBase'
import SendIcon from '@material-ui/icons/Send'
import CancelIcon from '@material-ui/icons/Cancel'
import moment from 'moment'

import { createComment } from '../../../../redux/discussion/discussionActions'
import { IComment } from '../../../../common'
import autobind from 'utils/autobind'
import { IGlobalState } from 'redux/store'

export interface ThreadProps {
    title: string
    type: string
    subject: number|string
    repoID: string
    user: string
    comments: IComment[]
    unselect: Function
    createComment: Function
    classes: any
}

export interface ThreadState {
    comment: string
}

@autobind
class Thread extends React.Component<ThreadProps, ThreadState>
{
    state = {
        comment: '',
    }

    handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>){
        if (event.key === 'Enter' && event.shiftKey) {
            this.handleSubmit(event)
        }
    }

    handleChange(event:  React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>){
        this.setState({comment: event.target.value})
    }

    handleSubmit(event: React.KeyboardEvent<HTMLDivElement>|React.FormEvent<HTMLFormElement>){
        event.preventDefault()
        if (this.state.comment.length === 0) {
            return
        }
        this.props.createComment(
            this.props.repoID,
            this.state.comment,
            {type: this.props.type, subject: this.props.subject},
            this.props.user,
        )

        this.setState({comment: ''})
    }

    render() {
        const {classes, title, comments} = this.props

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
                        {comments.length === 0 &&
                            <Typography className={classes.comment}>No comments yet. Start the discussion!</Typography>
                        }
                        {comments.map(c => {
                            return (
                                <div className={classes.comment} key={c.created}>
                                    <Typography><strong>{c.name || c.user}</strong> <small>({moment(c.created).fromNow()})</small></Typography>
                                    {c.text.split('\n').map((p, i) => (
                                        <Typography className={classes.text} key={i}>{p}</Typography>
                                    ))}
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
        overflow: 'scroll',
        flexGrow: 1,
    },
    comment: {
        margin: theme.spacing.unit,
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


const mapStateToProps = (state: IGlobalState, ownProps: Partial<ThreadProps>) => {
    const selected = state.repository.selectedRepo || ""
    const repoID = state.repository.repos[selected].repoID
    const comments = state.discussion.comments.filter(c => c.attachedTo.subject === ownProps.subject)
    return {
        repoID: repoID,
        comments: comments,
        user: state.user.name,
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