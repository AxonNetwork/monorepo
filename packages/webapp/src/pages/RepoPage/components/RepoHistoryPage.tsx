import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { History } from 'history'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Timeline from './connected/Timeline'
import CreateDiscussion from './connected/CreateDiscussion'
import CommitView from 'conscience-components/CommitView'
import { H5 } from 'conscience-components/Typography/Headers'
import { getDiff } from 'redux/repo/repoActions'
import { IGlobalState } from 'redux/store'
import { IRepo, IUser } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoHistoryPage extends React.Component<Props>
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
        const selectedCommit = this.props.match.params.commit
        if (selectedCommit === undefined) {
            return (
                <Timeline
                    repoID={repo.repoID}
                    history={this.props.history}
                />
            )
        } else {
            return (
                <div className={classes.main}>
                    <CommitView
                        repo={repo}
                        user={this.props.user}
                        commit={commits[selectedCommit]}
                        codeColorScheme={this.props.codeColorScheme}
                        getDiff={this.getDiff}
                        selectCommit={this.selectCommit}
                        selectUser={this.selectUser}
                    />
                    <div className={classes.createDiscussionContainer}>
                        <H5>Start a discussion on this commit:</H5>
                        <div className={classes.createDiscussion}>
                            <CreateDiscussion
                                repoID={repo.repoID}
                                attachedTo={selectedCommit}
                                history={this.props.history}
                            />
                        </div>
                    </div>
                </div>
            )
        }
    }

    selectCommit(payload: { selectedCommit: string | undefined }) {
        const repoID = this.props.match.params.repoID
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

    getDiff(payload: { repoID: string, repoRoot: string | undefined, commit: string }) {
        const { repoID, commit } = payload
        this.props.getDiff({ repoID, commit })
    }
}

interface MatchParams {
    commit: string | undefined
    repoID: string
}

interface Props extends RouteComponentProps<MatchParams> {
    repo: IRepo
    user: IUser
    codeColorScheme: string | undefined
    getDiff: (payload: { repoID: string, commit: string }) => void
    history: History
    classes: any
}

const styles = (theme: Theme) => createStyles({
    progressContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 256,
    },
    createDiscussionContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 32,
    },
    createDiscussion: {
        maxWidth: 700
    }
})

const mapStateToProps = (state: IGlobalState, props: Props) => {
    const repoID = props.match.params.repoID
    const repo = state.repo.repos[repoID]
    const user = state.user.users[state.user.currentUser || ''] || {}
    const codeColorScheme = (state.user.userSettings || {}).codeColorScheme
    return {
        repo,
        user,
        codeColorScheme,
    }
}

const mapDispatchToProps = {
    getDiff,
}

const RepoHistoryPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoHistoryPage))

export default RepoHistoryPageContainer
