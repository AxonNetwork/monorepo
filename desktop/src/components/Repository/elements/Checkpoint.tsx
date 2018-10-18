import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import autobind from 'utils/autobind'

@autobind
class Checkpoint extends React.Component<Props, State>
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
                <Button
                variant="raised"
                color="secondary"
                className={classes.button}
                disabled={this.props.checkpointLoading}
                type="submit"
                >
                    Checkpoint
                    {this.props.checkpointLoading && <CircularProgress size={24} className={classes.buttonLoading} />}
                </Button>
            </form>
        )
    }
}

interface Props {
    folderPath: string
    repoID: string
    checkpointLoading: boolean
    checkpointRepo: Function
    classes: any
}

interface State {
    message: string
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
    buttonLoading: {
        color: theme.palette.secondary.main,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
})

export default withStyles(styles)(Checkpoint)
