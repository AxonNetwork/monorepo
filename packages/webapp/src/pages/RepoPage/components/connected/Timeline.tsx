import React from 'react'
import { connect } from 'react-redux'
import { History } from 'history'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Timeline from 'conscience-components/Timeline'
import { getDiff } from 'redux/repo/repoActions'
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
                users={{}}
                usersByEmail={{}}
            />
        )
    }

    selectCommit(payload: { selectedCommit: string | undefined }) {
        const repoID = this.props.repo.repoID
        const commit = payload.selectedCommit
        if (commit === undefined) {
            this.props.history.push(`/repo/${repoID}/history`)
        } else {
            this.props.history.push(`/repo/${repoID}/history/${commit}`)
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

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    repoID: string
    history: History
    page?: number
    defaultRowsPerPage?: number
    hidePagination?: boolean
}

interface StateProps {
    repo: IRepo
    user: IUser
    history: History
}

interface DispatchProps {
    getDiff: (payload: { repoID: string, commit: string }) => void
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
    const repo = state.repo.repos[ownProps.repoID]
    const user = state.user.users[state.user.currentUser || ''] || {}
    return {
        repo,
        user,
    }
}

const mapDispatchToProps = {
    getDiff,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(ConnectedTimeline))
