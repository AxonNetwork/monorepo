import React from 'react'
import { connect } from 'react-redux'
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
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Checkbox from '@material-ui/core/Checkbox'
import { fetchIsBehindRemote, pullRepo, checkpointRepo, setFilesChunking } from '../redux/repo/repoActions'
import { IGlobalState } from '../redux'
import { selectFile } from '../navigation'
import { IRepoFile, FileMode, LocalURI, URIType } from 'conscience-lib/common'
import { autobind, uriToString } from 'conscience-lib/utils'
import isEqual from 'lodash/isEqual'


@autobind
class PushPullButtons extends React.Component<Props, State>
{
    state = {
        pushDialogOpen: false,
        mergeConflictDialogOpen: false,
        chunkingDialogOpen: false,
        isFileChecked: {} as { [file: string]: boolean },
    }

    _inputCommitMessage: HTMLInputElement | null = null

    render() {
        const { files, pullProgress, checkpointLoading, classes } = this.props

        let pullLoading = pullProgress !== undefined
        // @@TODO determinate spinner looks really clunky
        // let percentPulled
        // if (pullLoading) {
        //     percentPulled = Math.floor(100 * ((pullProgress || {} as any).fetched || 0) / ((pullProgress || {} as any).toFetch || 1))
        //     // min 10 so the progress spinner shows something pulled
        //     percentPulled = Math.max(percentPulled, 10)
        //     if (percentPulled === 100) {
        //         // pull complete
        //         pullLoading = false
        //     }
        // }

        // @@TODO: calculate this in the reducer, and only when `files` changes
        const filesChanged = Object.keys(files).some(name => {
            const file = files[name]
            return (file.status === 'M' || file.status === '?' || file.status === 'U')
        })

        const mergeConflicts = this.state.mergeConflictDialogOpen ?
            Object.keys(files).filter(name => files[name].status === 'U') : undefined

        const pullDisabled = !this.props.isBehindRemote || pullLoading
        const pushDisabled = !filesChanged || checkpointLoading

        return (
            <div className={classes.root}>
                <Tooltip title="Download the latest work from the group">
                    <IconButton
                        color="secondary"
                        classes={{ root: classes.button }}
                        disabled={pullDisabled}
                        onClick={this.onClickPull}
                    >
                        {!pullLoading && <SyncIcon className={classes.icon} />}
                        {pullLoading && <CircularProgress size={24} className={classes.buttonLoading} />}
                    </IconButton>
                </Tooltip>

                <Tooltip title="Send your latest work to the group">
                    <IconButton
                        color="secondary"
                        classes={{ root: classes.button }}
                        disabled={pushDisabled}
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


                <Dialog open={this.state.mergeConflictDialogOpen} onClose={this.onClickCloseMergeConflictDialog}>
                    <DialogTitle>Resolve Merge Conflicts</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Looks like you have some merge conflicts in the following files. Click on the file to resolve the conflicts before committing your changes.
                        </DialogContentText>
                        <List>
                            {(mergeConflicts || []).map(file => (
                                <ListItem button onClick={() => this.onClickOpenMergeConflict(file)}>
                                    <ListItemText primary={file} />
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.onClickCloseMergeConflictDialog} color="secondary" autoFocus>Okay</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.chunkingDialogOpen} onClose={this.onClickCancelPushDialog}>
                    <DialogTitle>Commit your changes</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Looks like there a are some large files in repository that aren't being chunked. We recommend chunking any file over 10MB.
                        </DialogContentText>
                        <DialogContentText>
                            Enable Chunking:
                        </DialogContentText>
                        <List>
                            {Object.keys(this.state.isFileChecked).map(file => (
                                <ListItem button onClick={() => this.onClickToggleFile(file)}>
                                    <ListItemText primary={file} />
                                    <ListItemSecondaryAction>
                                        <Checkbox checked={this.state.isFileChecked[file]} />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={this.onClickConfirmChunking}
                            color="secondary"
                            variant="contained"
                        >
                            Confirm
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

                <Dialog open={this.state.pushDialogOpen} onClose={this.onClickCancelPushDialog}>
                    <DialogTitle>Commit your changes</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Add a message so that your collaborators understand your changes.
                        </DialogContentText>
                        <TextField
                            fullWidth
                            multiline
                            autoFocus
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
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    componentDidMount() {
        this.props.fetchIsBehindRemote({ uri: this.props.uri })
    }

    componentDidUpdate(prevProps: Props) {
        if (!isEqual(prevProps.uri, this.props.uri)) {
            this.props.fetchIsBehindRemote({ uri: this.props.uri })
        }
    }

    onClickPull() {
        this.props.pullRepo({ uri: this.props.uri })
    }

    onClickOpenPushDialog() {
        const files = this.props.files
        const mergeConflict = Object.keys(files).some(name => files[name].status === 'U')
        if (mergeConflict) {
            this.setState({ mergeConflictDialogOpen: true })
        } else {
            const threshold = 1024 * 1024 * 10
            const largeFileList = Object.keys(files)
                .filter(name => files[name].status === 'M' || files[name].status === '?' || files[name].status === 'U')
                .filter(name => files[name].size >= threshold)
            if (!this.props.manualChunking || largeFileList.length === 0) {
                this.setState({ pushDialogOpen: true })
            } else {
                const isFileChecked = largeFileList.reduce((acc, curr) => {
                    acc[curr] = true
                    return acc
                }, {} as { [file: string]: boolean })
                this.setState({ chunkingDialogOpen: true, isFileChecked })
            }
        }
    }

    onClickCancelPushDialog() {
        this.setState({ pushDialogOpen: false, chunkingDialogOpen: false })
    }

    onClickCloseMergeConflictDialog() {
        this.setState({ mergeConflictDialogOpen: false })
    }

    onClickOpenMergeConflict(filename: string) {
        this.setState({ mergeConflictDialogOpen: false })
        selectFile({ ...this.props.uri, filename }, FileMode.ResolveConflict)
    }

    onClickToggleFile(filename: string) {
        this.setState(prevState => ({
            ...prevState,
            isFileChecked: {
                ...prevState.isFileChecked,
                [filename]: !prevState.isFileChecked[filename]
            }
        }))
    }

    onClickConfirmChunking() {
        this.props.setFilesChunking({
            uri: this.props.uri,
            shouldChunkByFile: this.state.isFileChecked,
        })
        this.setState({ pushDialogOpen: true, chunkingDialogOpen: false, isFileChecked: {} })
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

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    uri: LocalURI
    classes?: any
}

interface StateProps {
    files: { [name: string]: IRepoFile }
    isBehindRemote: boolean
    manualChunking: boolean
    pullProgress: { fetched: number, toFetch: number } | undefined
    checkpointLoading: boolean
}

interface DispatchProps {
    fetchIsBehindRemote: typeof fetchIsBehindRemote
    pullRepo: typeof pullRepo
    checkpointRepo: typeof checkpointRepo
    setFilesChunking: typeof setFilesChunking
}

interface State {
    pushDialogOpen: boolean
    mergeConflictDialogOpen: boolean
    chunkingDialogOpen: boolean
    isFileChecked: { [file: string]: boolean }
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

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const uriStr = uriToString(ownProps.uri)

    return {
        files: state.repo.filesByURI[uriStr] || {},
        isBehindRemote: state.repo.isBehindRemoteByURI[uriStr] || false,
        manualChunking: state.user.userSettings.manualChunking || false,
        pullProgress: state.ui.pullRepoProgressByURI[uriStr],
        checkpointLoading: state.ui.checkpointLoading || false,
    }
}

const mapDispatchToProps = {
    fetchIsBehindRemote,
    pullRepo,
    checkpointRepo,
    setFilesChunking,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(PushPullButtons))
