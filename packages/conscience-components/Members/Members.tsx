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
import TextField from '@material-ui/core/TextField'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import DeleteIcon from '@material-ui/icons/Delete'
import UserAvatar from '../UserAvatar'
import { IUser } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class Members extends React.Component<Props, State>
{
    state = {
        dialogOpen: false,
    }

    _inputMember: HTMLInputElement | null = null

    render() {
        const { userList, users, currentUser, classes } = this.props
        const adminList = this.props.adminList || []
        const isAdmin = adminList.indexOf(currentUser) > -1
        return(
            <Card>
                <CardContent className={classes.root}>
                    <Typography variant="h6">Members</Typography>
                    <div>
                        {(userList || []).map(userID => {
                            const user = users[userID] || {}
                            return (
                                <div className={classes.user}>
                                    <div className={classes.userAvatar}>
                                        <UserAvatar username={user.name} userPicture={user.picture} />
                                    </div>
                                    <div className={classes.userInfo}>
                                        <Typography><strong>{user.name}</strong></Typography>
                                        <Typography>{user.username}</Typography>
                                        {adminList.indexOf(userID) > -1 &&
                                            <Typography><em>Creator/Admin</em></Typography>
                                        }
                                    </div>
                                    {isAdmin &&
                                        <IconButton
                                            onClick={() => this.onClickRemoveMember(userID)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    }
                                </div>
                            )
                        })}
                    </div>
                    <Button
                        color="secondary"
                        className={classes.button}
                        onClick={this.onClickOpenDialog}
                    >
                        <ControlPointIcon className={classes.controlPointIcon}/>
                        Add Member
                    </Button>

                    <Dialog open={this.state.dialogOpen} onClose={this.onClickCancelDialog}>
                        <DialogTitle>Add Member</DialogTitle>
                        <DialogContent className={classes.dialog}>
                            <TextField
                                label="email"
                                fullWidth
                                inputRef={x => this._inputMember = x}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.onClickAddMember} color="secondary">Add</Button>
                            <Button onClick={this.onClickCancelDialog} color="secondary" autoFocus>Cancel</Button>
                        </DialogActions>
                    </Dialog>
                </CardContent>
            </Card>
        )
    }

    onClickAddMember() {
        if (this._inputMember === null) {
            return

        }
        const email = this._inputMember.value
        this.props.addMember({ email })
        this.setState({ dialogOpen: false })
    }

    onClickRemoveMember(userID: string) {
        this.props.removeMember({ userID })
    }

    onClickOpenDialog() {
        this.setState({ dialogOpen: true })
    }

    onClickCancelDialog() {
        this.setState({ dialogOpen: false })
    }
}

interface Props {
    userList: string[]
    adminList?: string[]
    users: {[userID: string]: IUser}
    currentUser: string
    addMember: (payload: { email: string }) => void
    removeMember: (payload: { userID: string }) => void
    classes: any
}

interface State {
    dialogOpen: boolean
}

const styles = (theme: Theme) => createStyles({
    root: {
        padding: '24px 34px',
    }, // pass through styles
    user: {
        display: 'flex',
        marginTop: theme.spacing.unit * 2,
    },
    userAvatar : {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: theme.spacing.unit,
    },
    userInfo: {
        flexGrow: 1,
    },
    button: {
        width: '100%',
        textAlign: 'center',
        textTransform: 'none',
        marginTop: theme.spacing.unit * 2,
    },
    controlPointIcon: {
        marginRight: theme.spacing.unit,
    },
    dialog: {
        minWidth: 350,
    },
})

export default withStyles(styles)(Members)