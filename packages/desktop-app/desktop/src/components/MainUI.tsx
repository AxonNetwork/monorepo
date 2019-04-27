import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import classnames from 'classnames'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Sidebar from './Sidebar/Sidebar'
import Routes from '../Routes'
import Login from './Login/LoginPage'
import AutoupdateDialog from './AutoupdateDialog'
import ChangelogDialog from './ChangelogDialog'
import { IGlobalState } from 'conscience-components/redux'
import { autobind } from 'conscience-lib/utils'


@autobind
class MainUI extends React.Component<Props, State>
{
    state = {
        sidebarOpen: true,
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

                <AutoupdateDialog />
                <ChangelogDialog />
            </div>
        )
    }
}

interface Props extends RouteComponentProps {
    loggedIn: boolean
    checkedLoggedIn: boolean
    classes: any
}

interface State {
    sidebarOpen: boolean
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
    }
}

const mapDispatchToProps = {}

const MainUIContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(MainUI))

export default MainUIContainer

