import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import SharedUsers from 'conscience-components/SharedUsers'
import { changeUserPermissions } from 'redux/repo/repoActions'
import { IGlobalState } from 'redux/store'
import { IRepo, IUser } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoSettingsPage extends React.Component<Props>
{
    changePermissions(payload: { repoID: string, userID: string, admin: boolean, pusher: boolean, puller: boolean }) {
        console.log(payload)
    }

    render() {
        const { classes } = this.props

        return (
            <div className={classes.page}>
                <SharedUsers
                    repo={this.props.repo}
                    users={this.props.users}
                    usersByUsername={this.props.usersByUsername}
                    currentUser={this.props.currentUser}
                    changeUserPermissions={this.props.changeUserPermissions}
                />
            </div>
        )
    }
}

interface MatchParams {
    repoID: string
}

interface Props extends RouteComponentProps<MatchParams> {
    repo: IRepo | undefined
    users: { [userID: string]: IUser }
    usersByUsername: { [username: string]: string }
    currentUser: string
    changeUserPermissions: typeof changeUserPermissions
    classes: any
}

const styles = (theme: Theme) => createStyles({
    page: {
        marginTop: 32
    },
})

const mapStateToProps = (state: IGlobalState, props: RouteComponentProps<MatchParams>) => {
    const repoID = props.match.params.repoID
    return {
        repo: state.repo.repos[repoID],
        users: state.user.users,
        usersByUsername: state.user.usersByUsername,
        currentUser: state.user.currentUser || '',
    }
}

const mapDispatchToProps = {
    changeUserPermissions,
}

const RepoSettingsPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoSettingsPage))

export default RepoSettingsPageContainer
