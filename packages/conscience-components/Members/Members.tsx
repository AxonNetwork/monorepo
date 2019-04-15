import React from 'react'
import { connect } from 'react-redux'
import { Theme, withStyles, createStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import ClearIcon from '@material-ui/icons/Clear'
import UserAvatar from '../UserAvatar'
import UserSearchDialog from 'conscience-components/UserSearchDialog'
import { addMemberToOrg, removeMemberFromOrg } from 'conscience-components/redux/org/orgActions'
import { clearSearch, searchUsers } from 'conscience-components/redux/search/searchActions'
import { IGlobalState } from 'conscience-components/redux'
import { IUser, IOrganization, ISearchUserResult } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class Members extends React.Component<Props, State>
{
    state = {
        dialogOpen: false,
    }

    _inputUser: HTMLInputElement | null = null

    render() {
        const { org, users, currentUser, classes } = this.props
        if (org === undefined) { return null }

        const userList = org.members
        const adminList = org.creator ? [org.creator] : []
        const isAdmin = adminList.indexOf(currentUser) > -1

        return (
            <Card>
                <CardContent className={classes.root}>
                    <Typography variant="h6">Members</Typography>
                    <div>
                        {(userList || []).map(userID => {
                            const user = users[userID] || {}
                            return (
                                <div className={classes.user}>
                                    <div className={classes.userAvatar}>
                                        <UserAvatar user={user} />
                                    </div>
                                    <div className={classes.userInfo}>
                                        <Typography><strong>{user.name}</strong></Typography>
                                        <Typography>{user.username}</Typography>
                                        {adminList.indexOf(userID) > -1 &&
                                            <Typography><em>Admin</em></Typography>
                                        }
                                    </div>
                                    {isAdmin &&
                                        <IconButton
                                            onClick={() => this.onClickRemoveMember(userID)}
                                        >
                                            <ClearIcon fontSize="small" />
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
                        <ControlPointIcon className={classes.controlPointIcon} />
                        Add Member
                    </Button>

                    <UserSearchDialog
                        open={this.state.dialogOpen}
                        onSelectUser={this.onClickAddMember}
                        onCancel={this.onClickCancelDialog}
                    />
                </CardContent>
            </Card>
        )
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

    onClickAddMember(userID: string) {
        const orgID = this.props.orgID
        this.props.addMemberToOrg({ orgID, userID })
        this.setState({ dialogOpen: false })
    }

    onClickRemoveMember(userID: string) {
        const orgID = this.props.orgID
        this.props.removeMemberFromOrg({ orgID, userID })
    }

    onClickOpenDialog() {
        this.props.clearSearch({})
        this.setState({ dialogOpen: true })
    }

    onClickCancelDialog() {
        this.setState({ dialogOpen: false })
    }
}


type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    orgID: string
}

interface StateProps {
    org: IOrganization | undefined
    users: { [userID: string]: IUser }
    userResult?: ISearchUserResult[]
    currentUser: string
}

interface DispatchProps {
    addMemberToOrg: typeof addMemberToOrg
    removeMemberFromOrg: typeof removeMemberFromOrg
    clearSearch: typeof clearSearch
    searchUsers: typeof searchUsers
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
    searchDialogTitle: {
        paddingBottom: 0,
    }
})


const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    return {
        org: state.org.orgs[ownProps.orgID],
        users: state.user.users,
        userResult: (state.search.results || {}).users,
        currentUser: state.user.currentUser || '',
    }
}

const mapDispatchToProps = {
    addMemberToOrg,
    removeMemberFromOrg,
    clearSearch,
    searchUsers,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(Members))
