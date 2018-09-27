import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import SettingsIcon from '@material-ui/icons/Settings'

import Login from './Login/LoginPage'
import RepoList from './RepoList/RepoList'
import NewRepository from './NewRepository/NewRepository'
import Settings from './Settings/Settings'
import Repository from './Repository/Repository'
import autobind from 'utils/autobind'
import { createRepo, checkpointRepo, pullRepo, selectFile, getDiff, addCollaborator, revertFiles } from '../redux/repository/repoActions'
import { IGlobalState } from 'redux/store'
import { addSharedRepo } from 'redux/sharedRepos/sharedReposActions'
import { logout } from 'redux/user/userActions'
import { navigateNewRepo, navigateSettings } from 'redux/navigation/navigationActions'
import { IUser } from 'common'

export interface MainUIProps {
    user: IUser
    currentPage: string
    classes: any
}

export interface MainUIState {
    sidebarOpen: boolean
}

@autobind
class MainUI extends React.Component<MainUIProps, MainUIState>
{
    state = { sidebarOpen: true }

    onToggleSidebar() {
        this.setState({ sidebarOpen: !this.state.sidebarOpen })
    }

    render() {
        const { currentPage, user, classes } = this.props
        if(user === undefined){
            return(
                <Login />
            )
        }

        const userInitials = user.name.split(' ').map(x => x.substring(0, 1)).join('')
        return (
            <div className={classes.root}>
                <Drawer
                    variant="permanent"
                    classes={{
                        paper: classnames(classes.drawerPaper, !this.state.sidebarOpen && classes.drawerPaperClose),
                    }}
                    open={this.state.sidebarOpen}
                >
                    <div className={classes.sidebarToggle}>
                        <IconButton onClick={this.onToggleSidebar}>
                            <MenuIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <div className={classes.avatarWrapper}>
                        <Avatar>{userInitials}</Avatar>
                        <Typography className={classes.avatarName} classes={{ root: classes.sidebarItemText }}>{this.props.user.name}</Typography>
                    </div>

                    <Divider />
                    <RepoList />

                    <div className={classes.sidebarSpacer}></div>

                    <Divider />
                    <List className={classes.sidebarDarkBG}>
                        <ListItem
                            button
                            key="new"
                            onClick={this.props.navigateNewRepo}
                            className={classnames(classes.sidebarItemIconWrapper, { [classes.selected]: this.props.currentPage === 'new'})}
                        >
                            <ListItemText primary="New" primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                            <ListItemIcon>
                                <ControlPointIcon />
                            </ListItemIcon>
                        </ListItem>

                        <Divider />
                        <ListItem
                            button
                            key="settings"
                            onClick={this.props.navigateSettings}
                            className={classnames(classes.sidebarItemIconWrapper, { [classes.selected]: this.props.currentPage === 'settings'})}
                        >
                            <ListItemText primary="Settings" primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                        </ListItem>
                    </List>
                </Drawer>

                <main className={classes.mainUI}>
                    <div className={classnames(classes.mainUISidebarToggle, { [classes.mainUISidebarToggleHidden]: this.state.sidebarOpen })}>
                        <IconButton onClick={this.onToggleSidebar}>
                            <MenuIcon />
                        </IconButton>
                    </div>

                    <div className={classes.mainUIContentWrapper}>
                        {currentPage === 'new' &&
                            <NewRepository
                                createRepo={this.props.createRepo}
                                sharedRepos = {this.props.sharedRepos}
                                addSharedRepo = {this.props.addSharedRepo}
                            />}
                        {currentPage === 'settings' &&
                            <Settings />
                        }
                        {currentPage === 'repo' &&
                            <Repository sidebarOpen={this.state.sidebarOpen} />
                        }
                    </div>
                </main>
            </div>
        )
    }
}

MainUI.propTypes = {
    currentPage: PropTypes.string.isRequired,
    repo: PropTypes.object,
    user: PropTypes.object.isRequired,

    createRepo: PropTypes.func.isRequired,
    checkpointRepo: PropTypes.func.isRequired,
    pullRepo: PropTypes.func.isRequired,
    selectFile: PropTypes.func.isRequired,
    getDiff: PropTypes.func.isRequired,
    addCollaborator: PropTypes.func.isRequired,
    revertFiles: PropTypes.func.isRequired,
    navigateNewRepo: PropTypes.func.isRequired,
    navigateSettings: PropTypes.func.isRequired,

    sharedRepos: PropTypes.array.isRequired,
    addSharedRepo: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,

    classes: PropTypes.object.isRequired,
}

const drawerWidth = 200

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
    },
    mainUI: {
        display: 'flex',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
    },
    sidebarToggle: {
        display: 'flex',
        justifyContent: 'flex-end',
        '& svg': {
            fill: 'rgb(212, 212, 212)',
        },
    },
    mainUISidebarToggle: {
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
        padding: '24px 32px 72px 32px',
    },
    drawerPaper: {
        display: 'flex',
        backgroundColor: '#383840',
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
    },
    drawerPaperClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        // width: theme.spacing.unit * 7,
        width: 0,
        // [theme.breakpoints.up('sm')]: {
        //     width: theme.spacing.unit * 9,
        // },
    },
    sidebarSpacer: {
        flexGrow: 1,
        flexShrink: 1,
    },
    sidebarItemText: {
        color: 'rgb(212, 212, 212)',
    },
    sidebarItemIconWrapper: {
        '& svg': {
            fill: 'rgb(212, 212, 212)',
        },
    },
    sidebarDarkBG: {
        backgroundColor: '#313133',
        boxShadow: 'inset 0px 5px 15px -3px rgba(0, 0, 0, 0.44)',
    },
    avatarWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        padding: '20px 0',
        textAlign: 'center',
    },
    avatarName: {
        marginTop: 10,
    },
})

const mapStateToProps = (state: IGlobalState) => {
    const selected = state.repository.selectedRepo || ""
    let repo
    if (selected !== undefined) {
        repo = state.repository.repos[selected]
    }
    const currentUser = state.user.currentUser || ""
    const user = state.user.users[currentUser]
    return {
        repo: repo,
        selectedFile: state.repository.selectedFile,
        user: user,
        sharedRepos: state.sharedRepos,
        currentPage: state.navigation.currentPage,
    }
}

const mapDispatchToProps = {
    createRepo,
    checkpointRepo,
    pullRepo,
    selectFile,
    getDiff,
    addCollaborator,
    revertFiles,
    addSharedRepo,
    logout,
    navigateNewRepo,
    navigateSettings,
}

const MainUIContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(MainUI))

export default MainUIContainer

