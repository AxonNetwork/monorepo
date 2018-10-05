import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import FormHelperText from '@material-ui/core/FormHelperText'
import CancelIcon from '@material-ui/icons/Cancel'
import { createDiscussion } from 'redux/discussion/discussionActions'
import autobind from 'utils/autobind'


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
            <React.Fragment>
                {this.props.unselect &&
                    <IconButton
                        onClick={this.props.unselect as any}
                        className={classes.cancel}
                    >
                        <CancelIcon />
                    </IconButton>
                }
                <Typography variant="title" className={classes.title}>Start a New Discussion</Typography>
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
            </React.Fragment>
        )
    }
}

interface Props {
    repoID: string
    createDiscussion: typeof createDiscussion
    unselect?: () => void
    classes: any
}

interface State {
    error: string
}

const styles = (theme: Theme) => createStyles({
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
