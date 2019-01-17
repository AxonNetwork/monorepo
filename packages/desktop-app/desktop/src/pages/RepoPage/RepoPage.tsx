import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route, RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import RepoInfo from './components/RepoInfo'
import RepoFilesPage from './components/RepoFilesPage'
import RepoHistoryPage from './components/RepoHistoryPage'
import RepoDiscussionPage from './components/RepoDiscussionPage'
import RepoTeamPage from './components/RepoTeamPage'
import RepoHomePage from './components/RepoHomePage'
import { fetchFullRepo } from 'redux/repo/repoActions'
import { IGlobalState } from 'redux/store'
import { IRepo, RepoPage } from 'conscience-lib/common'
import { autobind, repoPageToString, stringToRepoPage } from 'conscience-lib/utils'


@autobind
class RepoPageRoutes extends React.Component<Props>
{

    render() {
        const { repo, classes } = this.props
        if (repo === undefined) {
            return (
                <div className={classes.progressContainer}>
                    <CircularProgress color="secondary" />
                </div>
            )
        }
        const repoPage = stringToRepoPage(this.props.location.pathname)

        return (
            <main className={classes.main}>
                <RepoInfo
                    repo={repo}
                    repoPage={repoPage}
                    navigateRepoPage={this.navigateRepoPage}
                />
                <div className={classes.repoPage}>
                    <div className={classes.repoPageInner}>
                        <Switch>
                            <Route path='/repo/:repoHash/files/:filename+' component={RepoFilesPage} />
                            <Route path='/repo/:repoHash/files' component={RepoFilesPage} />
                            <Route path='/repo/:repoHash/history/:commit' component={RepoHistoryPage} />
                            <Route path='/repo/:repoHash/history' component={RepoHistoryPage} />
                            <Route path='/repo/:repoHash/discussion/:discussionID' component={RepoDiscussionPage} />
                            <Route path='/repo/:repoHash/discussion' component={RepoDiscussionPage} />
                            <Route path='/repo/:repoHash/team' component={RepoTeamPage} />
                            <Route path='/repo/:repoHash' component={RepoHomePage} />
                            <Route render={() => null} />
                        </Switch>
                    </div>
                </div>
            </main>
        )
    }

    componentDidUpdate(prevProps: Props) {
        if ((prevProps.repo || {}).path !== (this.props.repo || {}).path) {
            const { repoID, path } = this.props.repo || { repoID: undefined, path: undefined }
            if (repoID && path) {
                this.props.fetchFullRepo({ repoID, path })
            }
        }
    }

    navigateRepoPage(repoPage: RepoPage) {
        const repoHash = this.props.match.params.repoHash
        const page = repoPageToString(repoPage)
        if (page === 'home') {
            this.props.history.push(`/repo/${repoHash}`)
            return
        }
        this.props.history.push(`/repo/${repoHash}/${page}`)
    }
}

interface MatchParams {
    repoHash: string
}

interface Props extends RouteComponentProps<MatchParams> {
    repo: IRepo
    menuLabelsHidden: boolean
    fetchFullRepo: typeof fetchFullRepo
    classes: any
}

const styles = (theme: Theme) => createStyles({
    progressContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 256,
    },
    main: {
        width: '100%',
    },
    repoPage: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
    }
    repoPageInner: {
        marginTop: 32,
        marginRight: 60,
        marginBottom: 96,
    }
})

const mapStateToProps = (state: IGlobalState, props: Props) => {
    const repoHash = props.match.params.repoHash
    const repoRoot = state.repo.reposByHash[repoHash]
    const repo = state.repo.repos[repoRoot]
    return {
        repo,
        menuLabelsHidden: state.user.userSettings.menuLabelsHidden || false,
    }
}

const mapDispatchToProps = {
    fetchFullRepo
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoPageRoutes))
