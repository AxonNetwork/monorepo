import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Timeline from 'conscience-components/Timeline'
import CreateDiscussion from 'conscience-components/CreateDiscussion'
import CommitView from 'conscience-components/CommitView'
import { H5 } from 'conscience-components/Typography/Headers'
import { getDiff } from 'conscience-components/redux/repo/repoActions'
import { IGlobalState } from 'redux/store'
import { IRepo, IUser, URI, URIType } from 'conscience-lib/common'
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
        const { commit } = this.props.match.params
        if (commit === undefined) {
            return <Timeline uri={this.props.uri} />
        } else {
            return (
                <div className={classes.main}>
                    <CommitView
                        uri={{
                            ...this.props.uri,
                            commit: commit
                        }}
                    />
                    <div className={classes.createDiscussionContainer}>
                        <H5>Start a discussion on this commit:</H5>
                        <div className={classes.createDiscussion}>
                            <CreateDiscussion uri={this.props.uri} attachedTo={commit} />
                        </div>
                    </div>
                </div>
            )
        }
    }
}

interface MatchParams {
    commit: string | undefined
    repoHash: string
}

interface Props extends RouteComponentProps<MatchParams> {
    uri: URI
    repo: IRepo
    user: IUser
    getDiff: typeof getDiff
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

const mapStateToProps = (state: IGlobalState, ownProps: Props) => {
    const repoRoot = state.repo.reposByHash[ownProps.match.params.repoHash]
    const uri = { type: URIType.Local, repoRoot } as URI
    const repo = state.repo.repos[repoRoot]
    const user = state.user.users[state.user.currentUser || ''] || {}
    return {
        uri,
        repo,
        user,
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
