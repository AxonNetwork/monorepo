import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

class Checkpoint extends Component {

    constructor(props) {
        super(props)
        this.state = {
            message: '',
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        this.props.checkpointRepo(this.props.folderPath, this.props.repoID, this.state.message)
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

Checkpoint.propTypes = {
    folderPath: PropTypes.string.isRequired,
    repoID: PropTypes.string.isRequired,
    checkpointRepo: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
}

const styles = theme => ({
    textField: {
        width: '100%',
    },
    button: {
        display: 'block',
        textTransform: 'none',
        marginTop: '16px',
    },
})

export default withStyles(styles)(Checkpoint)
