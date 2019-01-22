import React from 'react'
import { Theme, withStyles, createStyles } from '@material-ui/core'
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
import CircularProgress from '@material-ui/core/CircularProgress'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import SettingsIcon from '@material-ui/icons/Settings'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import UserAvatar from '../UserAvatar'
import { IRepoPermissions, IUser } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import { H6 } from '../Typography/Headers'
import { union } from 'lodash'


@autobind
class SharedUsers extends React.Component<Props, State>
{
    state = {
        dialogOpen: false,
        selectedUser: undefined,
        readChecked: false,
        writeChecked: false,
        adminChecked: false,
    }

    _inputUser: HTMLInputElement | null = null

    render() {
        const { permissions, currentUser, users, usersByUsername, updatingUserPermissions, classes } = this.props
        const { selectedUser } = this.state

        if (permissions === undefined) { return null }

        const { admins = [], pushers = [], pullers = [] } = permissions
        const sharedUsernames = union(admins, pushers, pullers)
        const sharedUsers = sharedUsernames.map(username => usersByUsername[username])
            .map(id => users[id])
            .filter(user => !!user)

        const adminIDs = admins.map(username => usersByUsername[username])
        const isAdmin = adminIDs.indexOf(currentUser) > -1

        const updatingNew = updatingUserPermissions !== undefined && sharedUsernames.indexOf(updatingUserPermissions) < 0

        return (
            <Card className={classes.root}>
                <CardContent>
                    <div className={classes.header}>
                        <H6>Access Controls</H6>
                        <Button
                            color="secondary"
                            className={classes.button}
                            onClick={() => this.openDialog()}
                            disabled={updatingNew}
                        >
                            {updatingNew && <CircularProgress size={24} className={classes.buttonLoading} />}
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
                                                <IconButton onClick={() => this.openDialog(user.username)}>
                                                    {updatingUserPermissions === user.username &&
                                                        <CircularProgress size={24} className={classes.buttonLoading} />
                                                    }
                                                    {updatingUserPermissions !== user.username &&
                                                        <SettingsIcon />
                                                    }
                                                </IconButton>
                                            }
                                        </TableCell>
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Dialog open={this.state.dialogOpen} onClose={this.closeDialog}>
                        {selectedUser === undefined &&
                            <DialogTitle>Add User</DialogTitle>
                        }
                        {selectedUser !== undefined &&
                            <DialogTitle>Change Permissions</DialogTitle>
                        }
                        <DialogContent className={classes.dialog}>
                            {selectedUser === undefined &&
                                <TextField
                                    label="Username"
                                    fullWidth
                                    inputRef={x => this._inputUser = x}
                                />
                            }
                            {selectedUser !== undefined &&
                                <Typography>
                                    <strong>User:</strong>
                                    {selectedUser}
                                </Typography>
                            }
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
                                onClick={this.changePermissions}
                                color="secondary"
                                variant='contained'
                            >
                                Set Permissions
                            </Button>
                            <Button
                                onClick={this.closeDialog}
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

    openDialog(username?: string) {
        const { admins = [], pushers = [], pullers = [] } = this.props.permissions
        this.setState({
            dialogOpen: true,
            selectedUser: username,
            adminChecked: admins.indexOf(username || '') > -1,
            writeChecked: pushers.indexOf(username || '') > -1,
            readChecked: pullers.indexOf(username || '') > -1,
        })
    }

    closeDialog() {
        this.setState({
            dialogOpen: false,
            selectedUser: undefined,
            adminChecked: false,
            writeChecked: false,
            readChecked: false,
        })
    }

    changePermissions() {
        const { selectedUser, readChecked, writeChecked, adminChecked } = this.state
        let username = selectedUser as string | undefined
        if (username === undefined) {
            if (this._inputUser === null) {
                return
            }
            username = this._inputUser.value
            if (username.length < 1) {
                return
            }
        }
        const repoID = this.props.repoID
        this.props.updateUserPermissions({
            repoID,
            username,
            admin: adminChecked,
            pusher: writeChecked,
            puller: readChecked
        })
        this.closeDialog()
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

interface Props {
    repoID: string
    permissions: IRepoPermissions
    users: { [userID: string]: IUser }
    usersByUsername: { [username: string]: string }
    currentUser: string
    updatingUserPermissions: string | undefined
    updateUserPermissions: (payload: { repoID: string, username: string, admin: boolean, pusher: boolean, puller: boolean }) => void
    classes: any
}

interface State {
    dialogOpen: boolean
    selectedUser: string | undefined
    readChecked: boolean
    writeChecked: boolean
    adminChecked: boolean
}

const styles = (theme: Theme) => createStyles({
    root: {
        minWidth: 350,
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
    button: {
        textTransform: 'none',
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
})

export default withStyles(styles)(SharedUsers)