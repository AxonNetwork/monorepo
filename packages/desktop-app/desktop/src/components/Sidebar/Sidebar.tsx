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
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import SettingsIcon from '@material-ui/icons/Settings'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import RepoList from './RepoList'
import OrgList from './OrgList'
import UserAvatar from 'conscience-components/UserAvatar'
import Scrollbar from 'conscience-components/Scrollbar'
import { createOrg } from 'conscience-components/redux/org/orgActions'
import { IGlobalState } from 'conscience-components/redux'
import { selectSettings } from 'conscience-components/navigation'
import { IUser, IOrganization } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class Sidebar extends React.Component<Props, State>
{
    state = {
        repoListOpen: true,
        orgListOpen: true,
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
                className={classes.root}
                open={open}
            >
                <div className={classes.buttonHeader}>
                    <IconButton onClick={this.props.toggleSidebar}>
                        <MenuIcon />
                    </IconButton>

                    <div style={{ flexGrow: 1 }}></div>

                    <UserAvatar
                        user={user}
                        noTooltip
                    />
                </div>

                <Divider />

                <Scrollbar variant='light' style={{ height: '100vh' }}>
                    <List classes={{ root: classes.repoListRoot }}>
                        <ListItem button onClick={this.onClickExpandRepositories} className={classes.sidebarItemText}>
                            <ListItemText primary="Repositories" primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                            {this.state.repoListOpen ? <ExpandMore /> : <ExpandLess />}
                        </ListItem>
                        <Collapse in={this.state.repoListOpen} timeout="auto" unmountOnExit>
                            <RepoList selectedRepo={this.props.selectedRepo} />
                        </Collapse>

                        <ListItem button onClick={this.onClickExpandOrganizations} className={classnames(classes.sidebarItemText, classes.sidebarItemTextOrganizations)}>
                            <ListItemText primary="Organizations" primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                            {this.state.orgListOpen ? <ExpandMore /> : <ExpandLess />}
                        </ListItem>
                        <Collapse in={this.state.orgListOpen} timeout="auto" unmountOnExit>
                            <OrgList
                                orgs={this.props.orgs}
                                createOrg={this.props.createOrg}
                            />
                        </Collapse>

                        <ListItem button onClick={selectSettings} className={classnames(classes.sidebarItemText, classes.sidebarItemTextOrganizations)}>
                            <ListItemText primary="Settings" primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                            <SettingsIcon />
                        </ListItem>
                    </List>
                </Scrollbar>
            </Drawer>
        )
    }

    onClickExpandRepositories() {
        this.setState({ repoListOpen: !this.state.repoListOpen })
    }

    onClickExpandOrganizations() {
        this.setState({ orgListOpen: !this.state.orgListOpen })
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
    repoListOpen: boolean
    orgListOpen: boolean
    orgDialogOpen: boolean
}

const styles = (theme: Theme) => createStyles({
    root: {
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
        width: 200,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflow: 'hidden',
        borderRight: 'none',
    },
    drawerPaperClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: 0,
    },
    buttonHeader: {
        display: 'flex',
        paddingRight: 14,
        paddingBottom: 10,
    },
    repoListRoot: {
        overflowY: 'auto',
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
