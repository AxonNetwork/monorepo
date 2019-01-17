import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import SharedUsers from 'conscience-components/SharedUsers'
import { updateUserPermissions } from 'conscience-components/redux/repo/repoActions'
import { IGlobalState } from 'redux/store'
import { IRepo, IUser } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoTeamPage extends React.Component<Props>
{
    render() {
        const { classes } = this.props

        return (
            <div className={classes.page}>
                <SharedUsers
                    repo={this.props.repo}
                    users={this.props.users}
                    usersByUsername={this.props.usersByUsername}
                    currentUser={this.props.currentUser}
                    updatingUserPermissions={this.props.updatingUserPermissions}
                    updateUserPermissions={this.props.updateUserPermissions}
                    selectUser={this.selectUser}
                />
            </div>
        )
    }

    selectUser(payload: { username: string }) {
        const username = payload.username
        if (username === undefined) {
            return
        }
        this.props.history.push(`/user/${username}`)
    }
}

interface MatchParams {
    repoHash: string
}

interface Props extends RouteComponentProps<MatchParams> {
    repo: IRepo | undefined
    users: { [userID: string]: IUser }
    usersByUsername: { [username: string]: string }
    currentUser: string
    updatingUserPermissions: string | undefined
    updateUserPermissions: typeof updateUserPermissions
    classes: any
}

const styles = (theme: Theme) => createStyles({
    page: {
        marginTop: 32
    },
})

const mapStateToProps = (state: IGlobalState, props: RouteComponentProps<MatchParams>) => {
    const repoRoot = state.repo.reposByHash[props.match.params.repoHash]
    return {
        repo: state.repo.repos[repoRoot],
        users: state.user.users,
        usersByUsername: state.user.usersByUsername,
        currentUser: state.user.currentUser || '',
        updatingUserPermissions: state.ui.updatingUserPermissions,
    }
}

const mapDispatchToProps = {
    updateUserPermissions,
}

const RepoTeamPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoTeamPage))

export default RepoTeamPageContainer
