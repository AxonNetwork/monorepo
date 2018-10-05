import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import autobind from '../../../../utils/autobind'

export interface AddCollaboratorDialogProps {
    open: boolean
    repoID: string
    folderPath: string
    onClose: () => void
    addCollaborator: Function
}

export interface AddCollaboratorDialogState {
    email: string
}

@autobind
class AddCollaboratorDialog extends React.Component<AddCollaboratorDialogProps>
{
    state = {
        email: ''
    }

    handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) =>{
        this.setState({
            [name]: event.target.value,
        })
    }

    handleSubmit(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault()
        this.props.onClose()
        this.props.addCollaborator({
            folderPath: this.props.folderPath,
            repoID: this.props.repoID,
            email: this.state.email
        })
    }

    render() {
        const { open, onClose } = this.props
        return (
            <Dialog
                open={open}
                onClose={onClose}
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

export default AddCollaboratorDialog
