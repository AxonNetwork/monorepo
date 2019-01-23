import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CircularProgress from '@material-ui/core/CircularProgress'
import BackupIcon from '@material-ui/icons/Backup'
import SyncIcon from '@material-ui/icons/Sync'
import FolderIcon from '@material-ui/icons/Folder'
import Tooltip from '@material-ui/core/Tooltip'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { selectFile } from 'conscience-components/navigation'
import { getRepo } from 'conscience-components/env-specific'
import { FileMode, URI, URIType } from 'conscience-lib/common'
import autobind from 'conscience-lib/utils/autobind'


@autobind
class PushPullButtons extends React.Component<Props, State>
{
    state = {
        pushDialogOpen: false,
        mergeConflictDialogOpen: false,
    }

    _inputCommitMessage: HTMLInputElement | null = null

    render() {
        const { uri, pullProgress, checkpointLoading, classes } = this.props
        const repo = getRepo(uri)

        let pullLoading = pullProgress !== undefined
        let percentPulled
        if (pullLoading) {
            percentPulled = Math.floor(100 * ((pullProgress || {} as any).fetched || 0) / ((pullProgress || {} as any).toFetch || 1))
            // min 10 so the progress spinner shows something pulled
            percentPulled = Math.max(percentPulled, 10)
            if (percentPulled === 100) {
                // pull complete
                pullLoading = false
            }
        }

        const files = repo.files || {}
        // @@TODO: calculate this in the reducer, and only when `files` changes
        const filesChanged = Object.keys(files).some((name) => {
            const file = files[name]
            return (file.status === 'M' || file.status === '?' || file.status === 'U')
        })

        const mergeConflicts = Object.keys(files).filter((name => files[name].mergeConflict))
        const pullEnabled = !repo.behindRemote || pullLoading
        const pushEnabled = !filesChanged || checkpointLoading

        return (
            <div className={classes.root}>
                <Tooltip title="Download the latest work from the group">
                    <IconButton
                        color="secondary"
                        classes={{ root: classes.button }}
                        disabled={pullEnabled}
                        onClick={this.onClickPull}
                    >
                        {!pullLoading && <SyncIcon className={classes.icon} />}
                        {pullLoading &&
                            <CircularProgress
                                size={24}
                                className={classes.buttonLoading}
                                value={percentPulled}
                                variant="determinate"
                            />
                        }
                    </IconButton>
                </Tooltip>

                <Tooltip title="Send your latest work to the group">
                    <IconButton
                        color="secondary"
                        classes={{ root: classes.button }}
                        disabled={pushEnabled}
                        onClick={this.onClickOpenPushDialog}
                    >
                        {!checkpointLoading && <BackupIcon className={classes.icon} />}
                        {checkpointLoading && <CircularProgress size={24} className={classes.buttonLoading} />}
                    </IconButton>
                </Tooltip>

                <Tooltip title="Open this folder on your computer">
                    <IconButton
                        classes={{ root: classes.button }}
                        disabled={false}
                        onClick={this.onClickOpenFolder}
                    >
                        <FolderIcon className={classes.icon} />
                    </IconButton>
                </Tooltip>


                <Dialog open={this.state.mergeConflictDialogOpen}>
                    <DialogTitle>Resolve Merge Conflicts</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Looks like you have some merge conflicts in the following files. Click on the file to resolve the conflicts before committing your changes.
                        </DialogContentText>
                        <List>
                            {
                                mergeConflicts.map(file => (
                                    <ListItem button onClick={() => this.onClickOpenMergeConflict(file)}>
                                        <ListItemText primary={file} />
                                    </ListItem>
                                ))
                            }
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.onClickCloseMergeConflictDialog} color="secondary" autoFocus>Okay</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.pushDialogOpen}>
                    <DialogTitle>Commit your changes</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Add a message so that your collaborators understand your changes.
                        </DialogContentText>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            inputRef={x => this._inputCommitMessage = x}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={this.onClickPush}
                            color="secondary"
                            variant="contained"
                        >
                            Commit
                        </Button>
                        <Button
                            onClick={this.onClickCancelPushDialog}
                            color="secondary"
                            variant="outlined"
                            autoFocus
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    onClickPull() {
        this.props.pullRepo({ uri: this.props.uri })
    }

    onClickOpenPushDialog() {
        const repo = getRepo(this.props.uri) || {}
        const files = repo.files || {}
        const mergeConflict = Object.keys(files).some((name => files[name].mergeConflict))
        if (mergeConflict) {
            this.setState({ mergeConflictDialogOpen: true })

        } else {
            this.setState({ pushDialogOpen: true })
        }
    }

    onClickCancelPushDialog() {
        this.setState({ pushDialogOpen: false })
    }

    onClickCloseMergeConflictDialog() {
        this.setState({ mergeConflictDialogOpen: false })
    }

    onClickOpenMergeConflict(file: string) {
        const uri = {
            ...this.props.uri,
            filename: file
        }
        this.setState({ mergeConflictDialogOpen: false })
        selectFile(uri, FileMode.ResolveConflict)
    }

    onClickPush() {
        if (this._inputCommitMessage === null) {
            return
        }
        const message = this._inputCommitMessage.value
        this.props.checkpointRepo({ uri: this.props.uri, message })
        this.setState({ pushDialogOpen: false })
    }

    onClickOpenFolder() {
        if (this.props.uri.type === URIType.Local) {
            const shell = (window as any).require('electron').shell
            shell.openItem(this.props.uri.repoRoot)
        }
    }
}


interface Props extends RouteComponentProps<{}> {
    uri: URI
    pullRepo: (payload: { uri: URI }) => void
    checkpointRepo: (payload: { uri: URI, message: string }) => void

    pullProgress: { fetched: number, toFetch: number } | undefined
    checkpointLoading: boolean
    classes: any
}

interface State {
    pushDialogOpen: boolean
    mergeConflictDialogOpen: boolean
}

const styles = (theme: Theme) => createStyles({
    root: {}, // overridable
    button: {
        padding: 4,
        marginRight: 16,
    },
    icon: {
        fontSize: '14pt',
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

export default withStyles(styles)(withRouter(PushPullButtons))
