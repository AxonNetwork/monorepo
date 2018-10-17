import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import autobind from 'utils/autobind'

export interface CheckpointProps {
    folderPath: string
    repoID: string
    checkpointRepo: Function
    classes: any
}

export interface CheckpointState {
    message: string
}

@autobind
class Checkpoint extends React.Component<CheckpointProps, CheckpointState>
{
    state={
        message: ''
    }

    handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        this.setState((current)=>({
            ...current,
            [name]: value,
        }))
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        this.props.checkpointRepo({
            folderPath: this.props.folderPath,
            repoID: this.props.repoID,
            message: this.state.message
        })
    }

    render() {
        const classes = this.props.classes
        return (
            <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                <TextField
                    id="checkpoint-message"
                    label="Checkpoint Message (optional)"
                    value={this.state.message}
                    onChange={this.handleChange('message')}
                    multiline={true}
                    rows={2}
                    rowsMax={2}
                    className={classes.textField}
                />
                <Button variant="raised" color="secondary" className={classes.button} type="submit">
                    Checkpoint
                </Button>
            </form>
        )
    }
}

const styles = (theme: Theme) => createStyles({
    textField: {
        width: '100%',
    },
    button: {
        display: 'block',
        textTransform: 'none',
        marginTop: theme.spacing.unit*2,
        marginBottom: theme.spacing.unit*2,
    },
})

export default withStyles(styles)(Checkpoint)
