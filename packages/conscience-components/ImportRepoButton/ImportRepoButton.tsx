import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import CircularProgress from '@material-ui/core/CircularProgress'
import { IOrganization } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import path from 'path'


@autobind
class ImportRepoButton extends React.Component<Props, State>
{
    _inputRepoID: HTMLInputElement | null = null

    state = {
        toImport: '',
        orgID: '',
    }

    render() {
        const { orgs, classes } = this.props
        return (
            <React.Fragment>
                <Button
                    variant="raised"
                    color="secondary"
                    className={classes.root}
                    onClick={this.importFolder}
                    disabled={this.props.importRepoLoading}
                >
                    Import
                    {this.props.importRepoLoading && <CircularProgress size={24} className={classes.buttonLoading} />}
                </Button>

                <Dialog open={this.state.toImport.length > 0} onClose={this.closeDialog}>
                    <DialogTitle>Import Repository</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Choose a Repository ID for:
                            {this.state.toImport}
                        </DialogContentText>
                        <br />
                        <TextField
                            id="repo-id"
                            label="Repository ID"
                            fullWidth
                            inputRef={x => this._inputRepoID = x}
                            defaultValue={path.basename(this.state.toImport || '')}
                        />
                        <FormControl className={classes.selectContainer}>
                            <InputLabel>
                                Organization
                            </InputLabel>
                            <Select
                                value={this.state.orgID}
                                onChange={this.handleSelectChange}
                                fullWidth
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                {Object.keys(orgs).map(orgID => (
                                    <MenuItem value={orgID}>{orgs[orgID].name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="secondary"
                            variant="raised"
                            onClick={this.confirmImport}
                            autoFocus
                        >
                            Confirm
                        </Button>
                        <Button
                            color="secondary"
                            variant="outlined"
                            onClick={this.closeDialog}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment >
        )
    }

    confirmImport() {
        if (this.state.toImport.length > 0 &&
            this._inputRepoID !== null &&
            this._inputRepoID.value.length > 0
        ) {
            const repoID = this._inputRepoID.value
            const path = this.state.toImport
            const orgID = this.state.orgID
            this.props.onImport(repoID, path, orgID)
        }
        this.closeDialog()
    }

    closeDialog() {
        this.setState({ toImport: '' })
    }

    handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({ orgID: event.target.value || '' })
    }

    importFolder() {
        const dialog = (window as any).require('electron').remote.dialog
        dialog.showOpenDialog({
            properties: ['openDirectory']
        }, (filepaths: string[]) => {
            if (filepaths.length > 0) {
                this.setState({ toImport: filepaths[0] })
            }
        })
    }
}

interface State {
    toImport: string
    orgID: string
}

interface Props {
    orgs: { [orgID: string]: IOrganization }
    importRepoLoading: boolean
    onImport: (repoID: string, path: string, orgID: string) => void
    classes: any
}

const styles = (theme: Theme) => createStyles({
    root: {},
    selectContainer: {
        width: '100%',
        marginTop: 16
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

export default (withStyles(styles)(ImportRepoButton)
