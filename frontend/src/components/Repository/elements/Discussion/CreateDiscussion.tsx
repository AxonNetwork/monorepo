import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'
import { createDiscussion } from 'redux/discussion/discussionActions'
import autobind from 'utils/autobind'
import CommentWrapper from './CommentWrapper'


@autobind
class CreateDiscussion extends React.Component<Props, State>
{
    state = {
        error: '',
    }

    _inputSubject!: HTMLInputElement
    _inputComment!: HTMLInputElement

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const valid = this._inputComment.value.length > 0 && this._inputSubject.value.length > 0
        if (valid) {
            this.setState({ error: '' })
            this.props.createDiscussion({
                repoID: this.props.repoID,
                subject: this._inputSubject.value,
                commentText: this._inputComment.value,
            })
        } else {
            this.setState({ error: 'Oops! You need both a subject and a comment.' })
        }
    }

    render() {
        const classes = this.props.classes
        return (
            <CommentWrapper
                classes={this.props.commentWrapperClasses}
                username={this.props.username}
                created={new Date().getTime()}
            >
                <form className={classes.form} onSubmit={this.handleSubmit}>
                    <TextField
                        id="subject"
                        label="Subject"
                        className={classes.textField}
                        fullWidth
                        inputRef={x => this._inputSubject = x}
                    />
                    <TextField
                        id="comment"
                        label="Comment"
                        className={classes.textField}
                        fullWidth
                        multiline
                        rows={3}
                        inputRef={x => this._inputComment = x}
                    />
                    <Button color="secondary" variant="contained" type="submit">
                        Create
                    </Button>
                    <FormHelperText error className={classes.error}>{this.state.error}</FormHelperText>
                </form>
            </CommentWrapper>
        )
    }
}

interface Props {
    username: string | undefined
    repoID: string
    createDiscussion: typeof createDiscussion
    commentWrapperClasses?: any
    classes: any
}

interface State {
    error: string
}

const styles = (theme: Theme) => createStyles({
    commentWrapper: {}, // this is just here so it can be overridden
    form: {
        width: '100%',
        padding: '16px 36px',
    },
    textField: {
        display: 'block',
        marginBottom: theme.spacing.unit,
    },
})

export default withStyles(styles)(CreateDiscussion)
