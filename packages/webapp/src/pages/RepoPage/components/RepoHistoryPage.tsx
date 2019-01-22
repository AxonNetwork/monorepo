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
import { getDiff } from 'conscience-components/redux/repo/repoActions'
import { getRepo } from 'conscience-components/env-specific'
import { IGlobalState } from 'redux/store'
import { URIType, IRepo, IUser } from 'conscience-lib/common'
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
        const { repoID, commit } = this.props.match.params
        if (commit === undefined) {
            return (
                <Timeline repoID={repo.repoID} history={this.props.history} />
            )
        } else {
            return (
                <div className={classes.main}>
                    <CommitView uri={{ type: URIType.Network, repoID, commit }} />

                    <div className={classes.createDiscussionContainer}>
                        <H5>Start a discussion on this commit:</H5>
                        <div className={classes.createDiscussion}>
                            <CreateDiscussion
                                repoID={repo.repoID}
                                attachedTo={commit}
                                history={this.props.history}
                            />
                        </div>
                    </div>
                </div>
            )
        }
    }
}

type Props = OwnProps & RouteComponentProps<MatchParams> & { classes: any }

interface MatchParams {
    commit: string | undefined
    repoID: string
}

interface OwnProps {
    repo: IRepo
    user: IUser
    getDiff: (payload: { repoID: string, commit: string }) => void
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
    const uri = { type: URIType.Network, repoID: props.match.params.repoID }
    const repo = getRepo(uri, state)
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
