import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import FormHelperText from '@material-ui/core/FormHelperText'
import CancelIcon from '@material-ui/icons/Cancel'
import autobind from 'utils/autobind'

export interface CreateDiscussionProps {
    repoID: string
    createDiscussion: Function
    unselect: Function
    classes: any
}

export interface CreateDiscussionState {
    error: string
    subject: string
    comment: string
}

@autobind
class CreateDiscussion extends React.Component<CreateDiscussionProps, CreateDiscussionState>
{
    state={
        error: '',
        subject: '',
        comment: '',
    }

    handleChange = (name: string) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState((current)=>({
            ...current,
            [name]: event.target.value,
        }))
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault()
        const valid = this.state.comment.length > 0 && this.state.subject.length > 0
        this.setState({error: 'Oops! You need both a subject and a comment.'})
        if (valid) {
            this.setState({
                subject: '',
                comment: '',
                error: '',
            })
            this.props.createDiscussion(this.props.repoID, this.state.subject, this.state.comment)
        }
    }

    render() {
        const classes = this.props.classes

        return (
            <React.Fragment>
                <IconButton
                    onClick={this.props.unselect as any}
                    className={classes.cancel}
                >
                    <CancelIcon />
                </IconButton>
                <Typography variant="title" className={classes.title}>Start a New Discussion</Typography>
                <form className={classes.form} onSubmit={this.handleSubmit}>
                    <TextField
                        id="subject"
                        label="Subject"
                        value={this.state.subject}
                        className={classes.textField}
                        fullWidth
                        onChange={this.handleChange('subject')}
                    />
                    <TextField
                        id="comment"
                        label="Comment"
                        value={this.state.comment}
                        className={classes.textField}
                        fullWidth
                        multiline
                        rows={3}
                        onChange={this.handleChange('comment')}
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
        padding: theme.spacing.unit,
    },
    textField: {
        display: 'block',
        marginBottom: theme.spacing.unit,
    },
})

export default withStyles(styles)(CreateDiscussion)
