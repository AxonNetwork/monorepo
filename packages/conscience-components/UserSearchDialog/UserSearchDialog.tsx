import React from 'react'
import { connect } from 'react-redux'
import { Theme, withStyles, createStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import UserSearchResult from '../UserSearchResult'
import { searchUsers } from 'conscience-components/redux/search/searchActions'
import { IGlobalState } from 'conscience-components/redux'
import { IUser, ISearchUserResult } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class UserSearchDialog extends React.Component<Props>
{
    _inputUser: HTMLInputElement | null = null

    render() {
        const { classes } = this.props

        return (
            <Dialog open={this.props.open} onClose={this.props.onCancel} maxWidth="md">
                <DialogTitle className={classes.searchDialogTitle}>Add User</DialogTitle>
                <form onSubmit={this.searchUser}>
                    <DialogContent className={classes.dialog}>
                        <TextField
                            label="Search for a user by name, username, or email address"
                            fullWidth
                            inputRef={x => this._inputUser = x}
                            autoFocus
                        />
                        {this.props.userResult && this.props.userResult.length > 0 &&
                            <List>
                                {this.props.userResult.map(({ userID }) => (
                                    <UserSearchResult
                                        user={this.props.users[userID]}
                                        onClick={this.props.onSelectUser}
                                    />
                                ))}
                            </List>
                        }
                        {this.props.userResult && this.props.userResult.length === 0 &&
                            <div className={classes.noResultsText}>
                                No users were found that match your search.
                            </div>
                        }
                    </DialogContent>

                    <DialogActions>
                        <Button
                            type="submit"
                            color="secondary"
                            variant="contained"
                        >
                            Search
                        </Button>
                        <Button
                            onClick={this.props.onCancel}
                            color="secondary"
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        )
    }

    searchUser = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (this._inputUser === null) {
            return
        }
        const query = this._inputUser.value.trim()
        if (query.length <= 0) {
            return
        }
        this.props.searchUsers({ query })
    }
}


type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    open: boolean
    onSelectUser: (userID: string) => void
    onCancel: () => void
}

interface StateProps {
    users: { [userID: string]: IUser }
    userResult?: ISearchUserResult[]
}

interface DispatchProps {
    searchUsers: typeof searchUsers
}

const styles = (theme: Theme) => createStyles({
    dialog: {
        minWidth: 480,
    },
    searchDialogTitle: {
        paddingBottom: 0,
    },
    noResultsText: {
        marginTop: 20,
        color: '#6d6d6d',
    },
})


const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    return {
        users: state.user.users,
        userResult: (state.search.results || {}).users,
    }
}

const mapDispatchToProps = {
    searchUsers,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(UserSearchDialog))
