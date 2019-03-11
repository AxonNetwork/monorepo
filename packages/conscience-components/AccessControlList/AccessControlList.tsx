import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Switch from '@material-ui/core/Switch'
import CircularProgress from '@material-ui/core/CircularProgress'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import SettingsIcon from '@material-ui/icons/Settings'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import UserAvatar from '../UserAvatar'
import UserSearchResult from '../UserSearchResult'
import { H6 } from '../Typography/Headers'
import { fetchRepoUsersPermissions, updateUserPermissions, setRepoPublic } from '../redux/repo/repoActions'
import { clearSearch, searchUsers } from '../redux/search/searchActions'
import { IGlobalState } from '../redux'
import { getRepoID } from '../env-specific'
import { IRepoPermissions, ISearchUserResult, IUser, URI } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import union from 'lodash/union'
import isEqual from 'lodash/isEqual'


@autobind
class SharedUsers extends React.Component<Props, State>
{
    _inputUser: HTMLInputElement | null = null

    state = {
        userDialogOpen: false,
        publicDialogOpen: false,
        selectedUser: undefined,
        readChecked: false,
        writeChecked: false,
        adminChecked: false,
        searchDialogOpen: false,
    }

    render() {
        const { permissions, currentUser, users, usersByUsername, updatingUserPermissions, classes } = this.props
        const { selectedUser } = this.state
        if (permissions === undefined) { return null }

        const { admins = [], pushers = [], pullers = [] } = permissions
        const sharedUsernames = union(admins, pushers, pullers)
        // @@TODO: Hardcoded filter, replace after adding replicator/delegator permissions
        const sharedUsers = sharedUsernames
            .filter(username => username !== 'conscience')
            .map(username => usersByUsername[username])
            .map(id => users[id])
            .filter(user => !!user)

        const adminIDs = admins.map(username => usersByUsername[username])
        const isAdmin = adminIDs.indexOf(currentUser) > -1

        return (
            <Card className={classes.root}>
                <CardContent>
                    <div className={classes.header}>
                        <H6>Access Controls</H6>
                        {isAdmin &&
                            <div className={classes.publicSwitch}>
                                <Typography>Private</Typography>
                                <Switch
                                    color="secondary"
                                    checked={this.props.isPublic}
                                    onChange={this.togglePublic}
                                />
                                <Typography>Public</Typography>
                            </div>
                        }
                        <Button
                            color="secondary"
                            onClick={() => this.openSearchDialog()}
                        >
                            <ControlPointIcon className={classes.controlPointIcon} />
                            Add User
                        </Button>
                    </div>

                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell className={classes.centered}>Read</TableCell>
                                <TableCell className={classes.centered}>Write</TableCell>
                                <TableCell className={classes.centered}>Admin</TableCell>
                                {isAdmin &&
                                    <TableCell className={classes.centered}>Change Permission</TableCell>
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sharedUsers.map(user => (
                                <TableRow>
                                    <TableCell>
                                        <div className={classes.user}>
                                            <div className={classes.userAvatar}>
                                                <UserAvatar user={user} />
                                            </div>
                                            <div className={classes.userInfo}>
                                                <Typography><strong>{user.name}</strong></Typography>
                                                <Typography>{user.username}</Typography>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className={classes.centered}>
                                        {pullers.indexOf(user.username) > -1 ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                                    </TableCell>
                                    <TableCell className={classes.centered}>
                                        {pushers.indexOf(user.username) > -1 ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                                    </TableCell>
                                    <TableCell className={classes.centered}>
                                        {admins.indexOf(user.username) > -1 ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                                    </TableCell>
                                    {isAdmin &&
                                        <TableCell className={classes.centered}>
                                            {currentUser !== user.userID &&
                                                <IconButton onClick={() => this.openUserDialog(user.userID)}>
                                                    <SettingsIcon />
                                                </IconButton>
                                            }
                                        </TableCell>
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Dialog open={this.state.publicDialogOpen} onClose={this.closePublicDialog}>
                        <DialogTitle>Make {getRepoID(this.props.uri)} public?</DialogTitle>
                        <DialogContent>
                            <Typography>
                                Once you do, anyone will be able to download the repository contents.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={this.confirmMakePublic}
                                color="secondary"
                                variant='contained'
                            >
                                Make Public
                            </Button>
                            <Button
                                onClick={this.closePublicDialog}
                                color="secondary"
                                variant='outlined'
                                autoFocus
                            >
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={this.state.searchDialogOpen} onClose={this.closeSearchDialog}>
                        <DialogTitle className={classes.searchDialogTitle}>Add User</DialogTitle>
                        <form onSubmit={this.searchUser}>
                            <DialogContent className={classes.dialog}>
                                <Typography variant='subtitle1'>
                                    Search:
                                </Typography>
                                <TextField
                                    label="Name or username"
                                    fullWidth
                                    inputRef={x => this._inputUser = x}
                                    autoFocus
                                />
                                {this.props.userResult &&
                                    <List>
                                        {this.props.userResult.map(({ userID }) => (
                                            <UserSearchResult
                                                user={this.props.users[userID]}
                                                onClick={this.openUserDialog}
                                            />
                                        ))}
                                    </List>
                                }
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    type="submit"
                                    color="secondary"
                                    variant='contained'
                                >
                                    Search
                                </Button>
                                <Button
                                    onClick={this.closeSearchDialog}
                                    color="secondary"
                                    variant='outlined'
                                >
                                    Cancel
                                </Button>
                            </DialogActions>
                        </form>
                    </Dialog>

                    <Dialog open={this.state.userDialogOpen} onClose={this.closeUserDialog}>
                        <DialogTitle>Change Permissions</DialogTitle>
                        <DialogContent className={classes.dialog}>
                            <Typography>
                                <strong>User:</strong>
                                {selectedUser}
                            </Typography>
                            <List>
                                <ListItem className={classes.listItem}>
                                    <ListItemText primary='Read' />
                                    <Checkbox color='secondary' checked={this.state.readChecked} onClick={this.toggleRead} />
                                </ListItem>
                                <ListItem className={classes.listItem}>
                                    <ListItemText primary='Write' />
                                    <Checkbox color='secondary' checked={this.state.writeChecked} onClick={this.toggleWrite} />
                                </ListItem>
                                <ListItem className={classes.listItem}>
                                    <ListItemText primary='Admin' />
                                    <Checkbox color='secondary' checked={this.state.adminChecked} onClick={this.toggleAdmin} />
                                </ListItem>
                            </List>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                color="secondary"
                                variant="contained"
                                onClick={this.changePermissions}
                                disabled={updatingUserPermissions !== undefined}
                            >
                                {updatingUserPermissions !== undefined &&
                                    <CircularProgress size={24} className={classes.buttonLoading} />
                                }
                                Set Permissions
                            </Button>
                            <Button
                                onClick={this.closeUserDialog}
                                color="secondary"
                                variant='outlined'
                                autoFocus
                            >
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>

                </CardContent>
            </Card>
        )
    }

    componentDidMount() {
        this.props.fetchRepoUsersPermissions({ uri: this.props.uri })
    }

    componentDidUpdate(prevProps: Props) {
        if (!isEqual(prevProps.uri, this.props.uri)) {
            this.props.fetchRepoUsersPermissions({ uri: this.props.uri })
        }
        if (prevProps.updatingUserPermissions !== undefined && this.props.updatingUserPermissions === undefined) {
            this.closeUserDialog()
        }
    }

    togglePublic() {
        if (!this.props.isPublic) {
            this.setState({ publicDialogOpen: true })
        } else {
            const repoID = getRepoID(this.props.uri)
            this.props.setRepoPublic({ repoID, isPublic: false })
        }
    }

    confirmMakePublic() {
        const repoID = getRepoID(this.props.uri)
        this.props.setRepoPublic({ repoID, isPublic: true })
        this.setState({ publicDialogOpen: false })
    }

    closePublicDialog() {
        this.setState({ publicDialogOpen: false })
    }

    openSearchDialog() {
        this.props.clearSearch({})
        this.setState({ searchDialogOpen: true })
    }

    closeSearchDialog() {
        this.setState({ searchDialogOpen: false })
    }

    searchUser(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (this._inputUser === null) {
            return
        }
        const username = this._inputUser.value
        if (username.length < 1) {
            return
        }
        this.props.searchUsers({ query: username })
    }

    openUserDialog(userID: string) {
        if (!userID || !this.props.users[userID]) {
            return
        }
        const username = this.props.users[userID].username
        const { admins = [], pushers = [], pullers = [] } = (this.props.permissions) || {}
        this.setState({
            userDialogOpen: true,
            searchDialogOpen: false,
            selectedUser: username,
            adminChecked: admins.indexOf(username || '') > -1,
            writeChecked: pushers.indexOf(username || '') > -1,
            readChecked: pullers.indexOf(username || '') > -1,
        })
    }

    closeUserDialog() {
        this.setState({
            userDialogOpen: false,
            selectedUser: undefined,
            adminChecked: false,
            writeChecked: false,
            readChecked: false,
        })
    }

    changePermissions() {
        const { selectedUser, readChecked, writeChecked, adminChecked } = this.state
        if (selectedUser === undefined) {
            return
        }
        const uri = this.props.uri
        this.props.updateUserPermissions({
            uri,
            username: selectedUser,
            admin: adminChecked,
            pusher: writeChecked,
            puller: readChecked
        })
    }

    toggleRead() {
        this.setState({ readChecked: !this.state.readChecked })
    }

    toggleWrite() {
        this.setState({ writeChecked: !this.state.writeChecked })
    }

    toggleAdmin() {
        this.setState({ adminChecked: !this.state.adminChecked })
    }
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    uri: URI
}

interface StateProps {
    permissions: IRepoPermissions | undefined
    users: { [userID: string]: IUser }
    usersByUsername: { [username: string]: string }
    userResult?: ISearchUserResult[]
    currentUser: string
    updatingUserPermissions: string | undefined
    isPublic: boolean
}

interface DispatchProps {
    fetchRepoUsersPermissions: typeof fetchRepoUsersPermissions
    updateUserPermissions: typeof updateUserPermissions
    setRepoPublic: typeof setRepoPublic
    searchUsers: typeof searchUsers
    clearSearch: typeof clearSearch
}

interface State {
    userDialogOpen: boolean
    searchDialogOpen: boolean
    publicDialogOpen: boolean
    selectedUser: string | undefined
    readChecked: boolean
    writeChecked: boolean
    adminChecked: boolean
}

const styles = (theme: Theme) => createStyles({
    root: {
        minWidth: 350,
    },
    publicSwitch: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 64
    },
    header: {
        display: 'flex',
        '& h6': {
            flexGrow: 1,
        },
    },
    centered: {
        textAlign: 'center'
    },
    listItem: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    user: {
        display: 'flex',
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    userAvatar: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: theme.spacing.unit,
    },
    userInfo: {
        flexGrow: 1,
    },
    buttonLoading: {
        color: theme.palette.secondary.main,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    controlPointIcon: {
        marginRight: theme.spacing.unit,
    },
    dialog: {
        minWidth: 350,
    },
    searchDialogTitle: {
        paddingBottom: 0
    }
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const repoID = getRepoID(ownProps.uri)
    return {
        permissions: state.repo.permissionsByID[repoID],
        users: state.user.users,
        usersByUsername: state.user.usersByUsername,
        userResult: (state.search.results || {}).users,
        currentUser: state.user.currentUser || '',
        updatingUserPermissions: state.ui.updatingUserPermissions,
        isPublic: state.repo.isPublicByID[repoID] || false,
    }

}

const mapDispatchToProps = {
    fetchRepoUsersPermissions,
    updateUserPermissions,
    setRepoPublic,
    searchUsers,
    clearSearch,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(SharedUsers))
