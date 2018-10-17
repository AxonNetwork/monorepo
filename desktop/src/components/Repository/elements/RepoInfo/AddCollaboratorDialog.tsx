import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import autobind from 'utils/autobind'


@autobind
class AddCollaboratorDialog extends React.Component<Props>
{
    _inputEmail!: HTMLInputElement

    handleSubmit(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault()
        this.props.onClose()
        this.props.addCollaborator({
            folderPath: this.props.folderPath,
            repoID: this.props.repoID,
            email: this._inputEmail.value,
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
                        inputRef={x => this._inputEmail = x}
                        autoFocus
                        margin="dense"
                        label="Email Address"
                        type="email"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleSubmit} color="secondary">Add</Button>
                    <Button onClick={this.props.onClose} color="secondary">Cancel</Button>
                </DialogActions>
            </Dialog>
        )
    }
}

interface Props {
    open: boolean
    repoID: string
    folderPath: string
    onClose: () => void
    addCollaborator: Function
}

export default AddCollaboratorDialog
