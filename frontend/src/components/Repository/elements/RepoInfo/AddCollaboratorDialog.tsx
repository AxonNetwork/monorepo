import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

class AddCollaboratorDialog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
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
        this.props.onClose()
        this.props.addCollaborator(this.props.folderPath, this.props.repoID, this.state.email)
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
            >
                <DialogTitle>Add Collaborator</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email"
                            label="Email Address"
                            type="email"
                            value={this.state.email}
                            onChange={this.handleChange('email')}
                            fullWidth
                        />
                    </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleSubmit} color="secondary">
                        Add
                    </Button>
                    <Button onClick={this.props.onClose} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

AddCollaboratorDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    addCollaborator: PropTypes.func.isRequired,
    repoID: PropTypes.string.isRequired,
    folderPath: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
}

const styles = theme => ({

})

export default withStyles(styles)(AddCollaboratorDialog)
