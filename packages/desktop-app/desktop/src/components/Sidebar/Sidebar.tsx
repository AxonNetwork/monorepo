import keyBy from 'lodash/keyBy'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Theme, createStyles, withStyles } from '@material-ui/core'
import classnames from 'classnames'
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
import UserAvatar from 'conscience-components/UserAvatar'
import { createOrg } from 'conscience-components/redux/org/orgActions'
import { IGlobalState } from 'conscience-components/redux'
import { selectSettings } from 'conscience-components/navigation'
import { IUser, IOrganization } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


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
        return (
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
                    <UserAvatar
                        user={user}
                        noTooltip
                    />
                    <Typography className={classes.avatarName} classes={{ root: classes.sidebarItemText }}>{this.props.user.name}</Typography>
                </div>

                <Divider />

                <List classes={{ root: classes.repoListRoot }} data-simplebar>
                    <ListItem button onClick={this.onClickExpandRepositories} className={classes.sidebarItemText}>
                        <ListItemText primary="Repositories" primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                        {this.state.repoOpen ? <ExpandMore /> : <ExpandLess />}
                    </ListItem>
                    <Collapse in={this.state.repoOpen} timeout="auto" unmountOnExit>
                        <RepoList selectedRepo={this.props.selectedRepo} />
                    </Collapse>

                    <ListItem button onClick={this.onClickExpandOrganizations} className={classnames(classes.sidebarItemText, classes.sidebarItemTextOrganizations)}>
                        <ListItemText primary="Organizations" primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                        {this.state.orgOpen ? <ExpandMore /> : <ExpandLess />}
                    </ListItem>
                    <Collapse in={this.state.orgOpen} timeout="auto" unmountOnExit>
                        <OrgList
                            orgs={this.props.orgs}
                            createOrg={this.props.createOrg}
                        />
                    </Collapse>

                </List>

                <div className={classes.sidebarSpacer}></div>

                <Divider />
                <List className={classes.sidebarDarkBG}>
                    <ListItem button key="new" onClick={this.navigateNewRepo} className={classes.sidebarItemIconWrapper}>
                        <ListItemText primary="New" primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                        <ListItemIcon>
                            <ControlPointIcon />
                        </ListItemIcon>
                    </ListItem>

                    <Divider />
                    <ListItem button key="settings" onClick={selectSettings} className={classes.sidebarItemIconWrapper}>
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

    navigateNewRepo() {
        this.props.history.push(`/new-repo`)
    }
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface MatchParams {
    repoHash?: string
}

interface OwnProps extends RouteComponentProps<MatchParams> {
    open: boolean
    toggleSidebar: () => void
}

interface StateProps {
    user: IUser
    selectedRepo?: string | undefined
    orgs: { [orgID: string]: IOrganization }
}

interface DispatchProps {
    createOrg: typeof createOrg
}

interface State {
    repoOpen: boolean
    orgOpen: boolean
}

const drawerWidth = 200

const styles = (theme: Theme) => createStyles({
    sidebarToggle: {
        // display: 'flex',
        // justifyContent: 'flex-start',
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
        width: 0,
    },
    repoListRoot: {
        overflowY: 'auto',
        '& .simplebar-scrollbar:before': {
            background: '#fff'
        }
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
        // display: 'flex',
        // flexDirection: 'column',
        // alignItems: 'center',
        width: '100%',
        padding: '20px 0',
        textAlign: 'center',
    },
    avatarName: {
        marginTop: 10,
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const currentUser = state.user.currentUser || ''
    const user = state.user.users[currentUser] || {}
    const orgIDs = user.orgs || []
    const orgList = orgIDs
        .filter(orgID => state.org.orgs[orgID] !== undefined)
        .map(orgID => state.org.orgs[orgID] || {})
    const orgs = keyBy(orgList, 'orgID')
    const selectedRepo = state.repo.reposByHash[ownProps.match.params.repoHash || '']
    return {
        selectedRepo,
        user,
        orgs,
    }
}

const mapDispatchToProps = {
    createOrg,
}

export default withRouter(connect<StateProps, DispatchProps, OwnProps, IGlobalState>(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(Sidebar)))
