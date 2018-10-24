import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CircularProgress from '@material-ui/core/CircularProgress'
import BackupIcon from '@material-ui/icons/Backup'
import SyncIcon from '@material-ui/icons/Sync'
import Tooltip from '@material-ui/core/Tooltip'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { IRepo } from 'common'
import { pullRepo, checkpointRepo } from 'redux/repository/repoActions'
import autobind from 'utils/autobind'


@autobind
class PushPullButtons extends React.Component<Props, State>
{
    state = { pushDialogOpen: false }

    _inputCommitMessage: HTMLInputElement | null = null

    render() {
        const { repo, pullLoading, checkpointLoading, classes } = this.props

        const files = repo.files || {}
        // @@TODO: calculate this in the reducer, and only when `files` changes
        const filesChanged = Object.keys(files).some((name) => {
            const file = files[name]
            return (file.status === 'M' || file.status === '?')
        })

        return (
            <div className={classes.root}>
                <Tooltip title="Download the latest work from the group">
                    <IconButton
                        color="secondary"
                        classes={{ root: [classes.button, classes.buttonPull].join(' ') }}
                        disabled={!repo.behindRemote || pullLoading}
                        onClick={this.onClickPull}
                    >
                        {!pullLoading && <SyncIcon className={classes.icon} />}
                        {pullLoading  && <CircularProgress size={24} className={classes.buttonLoading} />}
                    </IconButton>
                </Tooltip>

                <Tooltip title="Send your latest work to the group">
                    <IconButton
                        color="secondary"
                        classes={{ root: classes.button }}
                        disabled={!filesChanged || checkpointLoading}
                        onClick={this.onClickOpenPushDialog}
                    >
                        {!checkpointLoading && <BackupIcon className={classes.icon} />}
                        {checkpointLoading  && <CircularProgress size={24} className={classes.buttonLoading} />}
                    </IconButton>
                </Tooltip>

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
                        <Button onClick={this.onClickPush} color="secondary">Commit</Button>
                        <Button onClick={this.onClickCancelPushDialog} color="secondary" autoFocus>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    onClickPull() {
        this.props.pullRepo({ folderPath: this.props.repo.path, repoID: this.props.repo.repoID})
    }

    onClickOpenPushDialog() {
        this.setState({ pushDialogOpen: true })
    }

    onClickCancelPushDialog() {
        this.setState({ pushDialogOpen: false })
    }

    onClickPush() {
        if (this._inputCommitMessage === null) {
            return
        }
        const message = this._inputCommitMessage.value
        this.props.checkpointRepo({ folderPath: this.props.repo.path, repoID: this.props.repo.repoID, message })
        this.setState({ pushDialogOpen: false })
    }
}


interface Props {
    pullRepo: typeof pullRepo
    checkpointRepo: typeof checkpointRepo

    repo: IRepo

    pullLoading: boolean
    checkpointLoading: boolean
    classes: any
}

interface State {
    pushDialogOpen: boolean
}

const styles = (theme: Theme) => createStyles({
    root: {}, // overridable
    button: {
        padding: 4,
    },
    buttonPull: {
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

// const mapStateToProps = (state: IGlobalState) => {
//     return {
//     }
// }

const mapDispatchToProps = {
    pullRepo,
    checkpointRepo,
}

export default connect(
    null,
    mapDispatchToProps,
)(withStyles(styles)(PushPullButtons))
