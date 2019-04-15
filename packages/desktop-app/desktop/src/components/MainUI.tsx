import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import classnames from 'classnames'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'

import LargeProgressSpinner from 'conscience-components/LargeProgressSpinner'
import Sidebar from './Sidebar/Sidebar'
import Routes from '../Routes'
import Login from './Login/LoginPage'
import { IGlobalState } from 'conscience-components/redux'
import { autobind } from 'conscience-lib/utils'
import { AutoUpdateState } from 'redux/user/userReducer'
import ElectronRelay from 'lib/ElectronRelay'

@autobind
class MainUI extends React.Component<Props, State>
{
    state = {
        sidebarOpen: true,
        allowAutoupdateDialog: false,
    }

    onToggleSidebar() {
        this.setState({ sidebarOpen: !this.state.sidebarOpen })
    }

    render() {
        const { loggedIn, checkedLoggedIn, classes } = this.props
        if (!checkedLoggedIn) {
            return null
        }
        if (!loggedIn) {
            return (
                <div className={classes.root}>
                    <div className={classes.drag} />
                    <Login />
                </div >
            )
        }

        return (
            <div className={classes.root}>
                <div className={classes.drag} />
                <Sidebar
                    open={this.state.sidebarOpen}
                    toggleSidebar={this.onToggleSidebar}
                />
                <main className={classes.mainUI}>
                    <div className={classnames(classes.mainUISidebarToggle, { [classes.mainUISidebarToggleHidden]: this.state.sidebarOpen })}>
                        <IconButton onClick={this.onToggleSidebar} disabled={this.state.sidebarOpen}>
                            <MenuIcon />
                        </IconButton>
                    </div>

                    <div className={classes.mainUIContentWrapper}>
                        <Routes />
                    </div>
                </main>

                <Dialog
                    open={this.props.autoupdateState !== AutoUpdateState.NoUpdate && !this.state.allowAutoupdateDialog}
                    onClose={this.closeAutoupdateDialog}
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
                        <Button color="secondary" variant="contained" onClick={this.closeAutoupdateDialog}>Dismiss</Button>
                    </DialogActions>
                </Dialog>

                {this.props.autoupdateState === AutoUpdateState.Downloaded &&
                    <div className={classes.autoupdateNotification}>
                        <Button
                            type="submit"
                            color="secondary"
                            onClick={this.openAutoupdateDialog}
                        >
                            Update available
                        </Button>
                    </div>
                }
            </div>
        )
    }

    openAutoupdateDialog = () => {
        this.setState({ allowAutoupdateDialog: false })
    }

    closeAutoupdateDialog = () => {
        this.setState({ allowAutoupdateDialog: true })
    }
}

interface Props extends RouteComponentProps {
    loggedIn: boolean
    checkedLoggedIn: boolean
    autoupdateState: AutoUpdateState
    classes: any
}

interface State {
    sidebarOpen: boolean
    allowAutoupdateDialog: boolean
}

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
    },
    drag: {
        '-webkit-app-region': 'drag',
        height: 88,
        width: '100%',
        position: 'absolute',
    },
    mainUI: {
        display: 'flex',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
    },
    mainUISidebarToggle: {
        marginTop: theme.spacing.unit * 3,
        width: 48,
        flexGrow: 0,
        flexShrink: 0,
        opacity: 1,
        transition: theme.transitions.create('opacity', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    mainUISidebarToggleHidden: {
        opacity: 0,
        transition: theme.transitions.create('opacity', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    mainUIContentWrapper: {
        width: 'calc(100% - 48px)',
        flexGrow: 1,
        paddingTop: theme.spacing.unit * 3,
        display: 'flex',
    },
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
    const currentUser = state.user.currentUser || ''
    const loggedIn = state.user.users[currentUser] !== undefined
    const checkedLoggedIn = state.user.checkedLoggedIn
    return {
        loggedIn: loggedIn,
        checkedLoggedIn: checkedLoggedIn,
        autoupdateState: state.user.autoUpdateState,
    }
}

const mapDispatchToProps = {}

const MainUIContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(MainUI))

export default MainUIContainer

