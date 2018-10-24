import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { Theme, createStyles, withStyles } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Collapse from '@material-ui/core/Collapse'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import SettingsIcon from '@material-ui/icons/Settings'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import RepoList from './RepoList'
import OrgList from './OrgList'
import { IRepo, IUser, IOrganization } from 'common'
import { IGlobalState } from 'redux/store'
import { selectRepo } from 'redux/repository/repoActions'
import { selectOrg, createOrg } from 'redux/org/orgActions'
import { navigateNewRepo, navigateSettings } from 'redux/navigation/navigationActions'
import autobind from 'utils/autobind'
import UserAvatar from 'components/UserAvatar'
import { keyBy } from 'lodash'


@autobind
class Sidebar extends React.Component<Props, State>
{
    state = {
        repoOpen: true,
        orgOpen: true,
        orgDialogOpen: false,
    }

    render() {
        const { user, open, classes } = this.props
        return(
            <Drawer
                variant="permanent"
                classes={{
                    paper: classnames(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.sidebarToggle}>
                    <IconButton onClick={this.props.toggleSidebar}>
                        <MenuIcon />
                    </IconButton>
                </div>
                <Divider />
                <div className={classes.avatarWrapper}>
                    <UserAvatar username={user.name} userPicture={user.picture} />
                    <Typography className={classes.avatarName} classes={{ root: classes.sidebarItemText }}>{this.props.user.name}</Typography>
                </div>

                <Divider />

                <List>
                    <ListItem button onClick={this.onClickExpandRepositories} className={classes.sidebarItemText}>
                        <ListItemText primary="Repositories" primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                        {this.state.repoOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={this.state.repoOpen} timeout="auto" unmountOnExit>
                        <RepoList
                            repos={this.props.repos}
                            selectedRepo={this.props.selectedRepo}
                            currentPage={this.props.currentPage}
                            selectRepo={this.props.selectRepo}
                        />
                    </Collapse>

                    <ListItem button onClick={this.onClickExpandOrganizations} className={classnames(classes.sidebarItemText, classes.sidebarItemTextOrganizations)}>
                        <ListItemText primary="Organizations" primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                        {this.state.orgOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={this.state.orgOpen} timeout="auto" unmountOnExit>
                        <OrgList
                            orgs={this.props.orgs}
                            selectOrg={this.props.selectOrg}
                            createOrg={this.props.createOrg}
                        />
                    </Collapse>

                </List>

                <div className={classes.sidebarSpacer}></div>

                <Divider />
                <List className={classes.sidebarDarkBG}>
                    <ListItem
                        button
                        key="new"
                        onClick={this.props.navigateNewRepo as (event: any) => void}
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
                        onClick={this.props.navigateSettings as (event: any) => void}
                        className={classnames(classes.sidebarItemIconWrapper, { [classes.selected]: this.props.currentPage === 'settings'})}
                    >
                        <ListItemText primary="Settings" primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                    </ListItem>
                </List>
            </Drawer>
        )
    }

    onClickExpandRepositories() {
        this.setState({ repoOpen: !this.state.repoOpen })
    }

    onClickExpandOrganizations() {
        this.setState({ orgOpen: !this.state.orgOpen })
    }
}

interface Props {
    user: IUser
    repos: {[folderPath: string]: IRepo}
    selectedRepo?: string | null
    currentPage: string
    orgs: {[orgID: string]: IOrganization}
    toggleSidebar: () => void

    selectRepo: typeof selectRepo
    selectOrg: typeof selectOrg
    createOrg: typeof createOrg
    navigateNewRepo: typeof navigateNewRepo
    navigateSettings: typeof navigateSettings
    open: boolean

    classes: any
}

interface State {
    repoOpen: boolean
    orgOpen: boolean
}

const drawerWidth = 200

const styles = (theme: Theme) => createStyles({
    sidebarToggle: {
        display: 'flex',
        justifyContent: 'flex-start',
        '& svg': {
            fill: 'rgb(212, 212, 212)',
        },
    },
    drawerPaper: {
        paddingTop: theme.spacing.unit * 3,
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
        borderRight: 'none',
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
    sidebarItemTextOrganizations: {
        marginTop: 20,
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
    const currentUser = state.user.currentUser || ''
    const user = state.user.users[currentUser] || {}
    const orgIDs = user.orgs || []
    const orgList = orgIDs
        .filter((id: string) => state.org.orgs[id] !== undefined)
        .map((id: string) => state.org.orgs[id] || {})
    const orgs = keyBy(orgList, 'orgID')
    return {
        repos: state.repository.repos,
        selectedRepo: state.repository.selectedRepo,
        currentPage: state.navigation.currentPage,
        user,
        orgs,
    }
}

const mapDispatchToProps = {
    selectRepo,
    selectOrg,
    createOrg,
    navigateNewRepo,
    navigateSettings,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(Sidebar))