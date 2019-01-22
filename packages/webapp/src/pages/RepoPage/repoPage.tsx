import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route, RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import RepoInfo from './components/RepoInfo'
import RepoHomePage from './components/RepoHomePage'
import RepoFilesPage from './components/RepoFilesPage'
import RepoHistoryPage from './components/RepoHistoryPage'
import RepoDiscussionPage from './components/RepoDiscussionPage'
import RepoTeamPage from './components/RepoTeamPage'
import { getRepo } from 'redux/repo/repoActions'
import { IGlobalState } from 'conscience-components/redux'
import { IRepo, RepoPage } from 'conscience-lib/common'
import { autobind, repoPageToString, stringToRepoPage } from 'conscience-lib/utils'


@autobind
class RepoPageRoutes extends React.Component<Props>
{
    componentWillMount() {
        const repoID = this.props.match.params.repoID
        if (this.props.repo === undefined) {
            this.props.getRepo({ repoID })
        }
    }

    navigateRepoPage(repoPage: RepoPage) {
        const repoID = this.props.match.params.repoID
        const page = repoPageToString(repoPage)
        if (page === 'home') {
            this.props.history.push(`/repo/${repoID}`)
            return
        }
        this.props.history.push(`/repo/${repoID}/${page}`)
    }

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
            <div className={classes.container}>
                <main className={classes.main}>
                    <div className={classes.repository}>
                        <RepoInfo
                            repo={repo}
                            repoPage={repoPage}
                            menuLabelsHidden={this.props.menuLabelsHidden}
                            navigateRepoPage={this.navigateRepoPage}
                        />
                        <div>
                            <Switch>
                                <Route path='/repo/:repoID/files/:commit/:filename+' component={RepoFilesPage} />
                                <Route path='/repo/:repoID/files/:commit' component={RepoFilesPage} />
                                <Route path='/repo/:repoID/history/:commit' component={RepoHistoryPage} />
                                <Route path='/repo/:repoID/history' component={RepoHistoryPage} />
                                <Route path='/repo/:repoID/discussion/:discussionID' component={RepoDiscussionPage} />
                                <Route path='/repo/:repoID/discussion' component={RepoDiscussionPage} />
                                <Route path='/repo/:repoID/team' component={RepoTeamPage} />
                                <Route path='/repo/:repoID' component={RepoHomePage} />
                            </Switch>
                        </div>
                    </div>
                </main>
            </div>
        )
    }
}

interface MatchParams {
    repoID: string
}

interface Props extends RouteComponentProps<MatchParams> {
    repo: IRepo
    menuLabelsHidden: boolean
    getRepo: typeof getRepo
    classes: any
}

const styles = (theme: Theme) => createStyles({
    progressContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 256,
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
    },
    main: {
        width: 1024,
        marginTop: 32,
    },
    subpage: {
        marginTop: 32,
    }
})

const mapStateToProps = (state: IGlobalState, props: Props) => {
    const repoID = props.match.params.repoID
    const repo = state.repo.repos[repoID]
    return {
        repo,
        menuLabelsHidden: state.user.userSettings.menuLabelsHidden || false,
    }
}

const mapDispatchToProps = {
    getRepo
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoPageRoutes))
