import React from 'react'
import { connect } from 'react-redux'
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
import UserAvatar from 'components/UserAvatar'
import { IRepo, IUser } from 'common'
import { addCollaborator, removeCollaborator } from 'redux/repository/repoActions'
import { IGlobalState } from 'redux/store'
import autobind from 'utils/autobind'


@autobind
class SharedUsers extends React.Component<Props, State>
{
    state = {
        dialogOpen: false,
    }

    _inputUser: HTMLInputElement | null = null

    render() {
        const { repo, users, classes } = this.props
        return (
            <Card className={classes.root}>
                <CardContent>
                    <Typography variant="h6">Shared Users</Typography>
                    <div>
                        {(repo.sharedUsers || []).map(userID => {
                            const user = users[userID] || {}
                            return (
                                <div className={classes.user}>
                                    <div className={classes.userAvatar}>
                                        <UserAvatar username={user.name} userPicture={user.picture} />
                                    </div>
                                    <div className={classes.userInfo}>
                                        <Typography><strong>{user.name}</strong></Typography>
                                        <Typography>{user.username}</Typography>
                                    </div>
                                    <IconButton
                                        onClick={() => this.onClickRemoveMember(userID)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
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
                        Add User
                    </Button>

                    <Dialog open={this.state.dialogOpen}>
                        <DialogTitle>Add User</DialogTitle>
                        <DialogContent className={classes.dialog}>
                            <TextField
                                label="email"
                                fullWidth
                                inputRef={x => this._inputUser = x}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.onClickAddUser} color="secondary">Add</Button>
                            <Button onClick={this.onClickCancelDialog} color="secondary" autoFocus>Cancel</Button>
                        </DialogActions>
                    </Dialog>
                </CardContent>
            </Card>
        )
    }

    onClickAddUser() {
        if (this._inputUser === null) {
            return
        }

        const repoID = this.props.repo.repoID
        const repoRoot = this.props.repo.path
        const email = this._inputUser.value
        this.props.addCollaborator({ repoID, repoRoot, email })
        this.setState({ dialogOpen: false })
    }

    onClickRemoveMember(userID: string) {
        const repoID = this.props.repo.repoID
        const repoRoot = this.props.repo.path
        this.props.removeCollaborator({ repoID, repoRoot, userID })
    }

    onClickOpenDialog() {
        this.setState({ dialogOpen: true })
    }

    onClickCancelDialog() {
        this.setState({ dialogOpen: false })
    }
}

interface Props {
    repo: IRepo
    users: {[userID: string]: IUser}
    addCollaborator: typeof addCollaborator
    removeCollaborator: typeof removeCollaborator
    classes: any
}

interface State {
    dialogOpen: boolean
}

const styles = (theme: Theme) => createStyles({
    root: {
        minWidth: 350,
    },
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

const mapStateToProps = (state: IGlobalState) => {
    const selectedRepo = state.repository.selectedRepo || ''
    const repo = state.repository.repos[selectedRepo]
    const users = state.user.users
    return {
        repo,
        users,
    }
}

const mapDispatchToProps = {
    addCollaborator,
    removeCollaborator,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(SharedUsers))