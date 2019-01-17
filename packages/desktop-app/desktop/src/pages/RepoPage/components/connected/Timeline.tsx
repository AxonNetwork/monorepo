import React from 'react'
import { connect } from 'react-redux'
import { History } from 'history'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Timeline from 'conscience-components/Timeline'
import { IGlobalState } from 'redux/store'
import { IRepo, IUser } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class ConnectedTimeline extends React.Component<Props>
{
    render() {
        const { repo, classes } = this.props
        const commits = repo.commits
        if (commits === undefined) {
            return (
                <div className={classes.progressContainer}>
                    <CircularProgress color="secondary" />
                </div>
            )
        }
        const commitList = Object.keys(commits)
        return (
            <Timeline
                repoID={repo.repoID}
                page={this.props.page}
                defaultRowsPerPage={this.props.defaultRowsPerPage}
                hidePagination={this.props.hidePagination}
                commits={repo.commits}
                commitList={commitList}
                selectCommit={this.selectCommit}
                selectUser={this.selectUser}
                users={this.props.users}
                usersByEmail={this.props.usersByEmail}
            />
        )
    }

    selectCommit(payload: { selectedCommit: string | undefined }) {
        const repoHash = this.props.repoHash
        const commit = payload.selectedCommit
        if (commit === undefined) {
            this.props.history.push(`/repo/${repoHash}/history`)
        } else {
            this.props.history.push(`/repo/${repoHash}/history/${commit}`)
        }
    }

    selectUser(payload: { username: string | undefined }) {
        const username = payload.username
        if (username === undefined) {
            return
        }
        this.props.history.push(`/user/${username}`)
    }
}

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    repoHash: string
    history: History
    page?: number
    defaultRowsPerPage?: number
    hidePagination?: boolean
}

interface StateProps {
    repo: IRepo
    user: IUser
    users: { [userID: string]: IUser }
    usersByEmail: { [email: string]: string }
    history: History
}

const styles = (theme: Theme) => createStyles({
    progressContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 256,
    }
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const repoRoot = state.repo.reposByHash[ownProps.repoHash]
    const repo = state.repo.repos[repoRoot]
    const user = state.user.users[state.user.currentUser || ''] || {}
    return {
        repo,
        user,
        users: state.user.users,
        usersByEmail: state.user.usersByEmail,
    }
}

const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(ConnectedTimeline))
