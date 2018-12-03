import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import Sidebar from './Sidebar/Sidebar'
import Login from './Login/LoginPage'
import NewRepository from './NewRepository/NewRepository'
import Welcome from './NewRepository/Welcome'
import Settings from './Settings/Settings'
import OrganizationPage from './Organization/OrganizationPage'
import Repository from './Repository/Repository'
import autobind from 'utils/autobind'
import { IGlobalState } from 'redux/store'

@autobind
class MainUI extends React.Component<Props, State>
{
    state = { sidebarOpen: true }

    onToggleSidebar() {
        this.setState({ sidebarOpen: !this.state.sidebarOpen })
    }

    render() {
        const { currentPage, loggedIn, checkedLocalUser, classes } = this.props
        if (!checkedLocalUser) {
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
                        <IconButton onClick={this.onToggleSidebar}>
                            <MenuIcon />
                        </IconButton>
                    </div>

                    <div className={classes.mainUIContentWrapper}>
                        {currentPage === 'welcome' &&
                            <Welcome />
                        }
                        {currentPage === 'new' &&
                            <NewRepository />
                        }
                        {currentPage === 'settings' &&
                            <Settings />
                        }
                        {currentPage === 'repo' &&
                            <Repository sidebarOpen={this.state.sidebarOpen} />
                        }
                        {currentPage === 'org' &&
                            <OrganizationPage />
                        }
                    </div>
                </main>
            </div>
        )
    }
}

interface Props {
    loggedIn: boolean
    checkedLocalUser: boolean
    currentPage: string
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
        flexGrow: 1,
        paddingTop: theme.spacing.unit * 3,
        display: 'flex',
    },

})

const mapStateToProps = (state: IGlobalState) => {
    const currentUser = state.user.currentUser || ''
    const loggedIn = state.user.users[currentUser] !== undefined
    const checkedLocalUser = state.user.checkedLocalUser
    return {
        loggedIn: loggedIn,
        checkedLocalUser: checkedLocalUser,
        currentPage: state.navigation.currentPage,
    }
}

const mapDispatchToProps = {}

const MainUIContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(MainUI))

export default MainUIContainer

