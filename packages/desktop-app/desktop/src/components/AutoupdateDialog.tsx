import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'

import LargeProgressSpinner from 'conscience-components/LargeProgressSpinner'
import { IGlobalState } from 'conscience-components/redux'
import { autobind } from 'conscience-lib/utils'
import { AutoUpdateState } from 'redux/user/userReducer'
import ElectronRelay from 'lib/ElectronRelay'

@autobind
class AutoupdateDialog extends React.Component<Props, State>
{
    state = {
        dismissed: false,
    }

    render() {
        const { classes } = this.props
        return (
            <React.Fragment>
                <Dialog
                    open={this.props.autoupdateState !== AutoUpdateState.NoUpdate && !this.state.dismissed}
                    onClose={this.dismiss}
                    aria-labelledby="autoupdate-dialog-title"
                    PaperProps={{
                        classes: { root: classes.autoupdateDialogRoot }
                    }}
                >
                    <DialogTitle id="autoupdate-dialog-title">Checking for updates</DialogTitle>

                    <DialogContent>
                        <div className={classes.autoupdateDialogBody}>
                            {this.props.autoupdateState === AutoUpdateState.Checking &&
                                <React.Fragment>
                                    <LargeProgressSpinner classes={{ root: classes.autoupdateSpinner }} />
                                    <div className={classes.autoupdateStatus}>Connecting...</div>
                                </React.Fragment>
                            }
                            {this.props.autoupdateState === AutoUpdateState.Downloading &&
                                <React.Fragment>
                                    <LargeProgressSpinner classes={{ root: classes.autoupdateSpinner }} />
                                    <div className={classes.autoupdateStatus}>Downloading...</div>
                                </React.Fragment>
                            }
                            {this.props.autoupdateState === AutoUpdateState.Downloaded &&
                                <React.Fragment>
                                    <CheckCircleOutlineIcon />
                                    <div className={classes.autoupdateStatus}>Update downloaded.</div>
                                </React.Fragment>
                            }
                        </div>
                    </DialogContent>

                    <DialogActions>
                        {this.props.autoupdateState === AutoUpdateState.Downloaded &&
                            <Button color="secondary" variant="contained" onClick={ElectronRelay.quitAndInstallUpdate}>Close app and install update</Button>
                        }
                        <Button color="secondary" variant="contained" onClick={this.dismiss}>Dismiss</Button>
                    </DialogActions>
                </Dialog>

                {this.props.autoupdateState === AutoUpdateState.Downloaded &&
                    <div className={classes.autoupdateNotification}>
                        <Button
                            type="submit"
                            color="secondary"
                            onClick={this.reopen}
                        >
                            Update available
                        </Button>
                    </div>
                }
            </React.Fragment>
        )
    }

    reopen = () => {
        this.setState({ dismissed: false })
    }

    dismiss = () => {
        this.setState({ dismissed: true })
    }
}

interface Props {
    autoupdateState: AutoUpdateState
    classes: any
}

interface State {
    dismissed: boolean
}

const styles = (theme: Theme) => createStyles({
    autoupdateDialogRoot: {
        width: 400,
    },
    autoupdateDialogBody: {
        padding: 24,
        textAlign: 'center',
    },
    autoupdateSpinner: {
        marginTop: 0,
        marginBottom: 0,
        padding: 40,
    },
    autoupdateStatus: {
        padding: '0 0 30px 0',
    },
    autoupdateNotification: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
})

const mapStateToProps = (state: IGlobalState) => {
    return {
        autoupdateState: state.user.autoUpdateState,
    }
}

export default connect(mapStateToProps)(withStyles(styles)(AutoupdateDialog))


