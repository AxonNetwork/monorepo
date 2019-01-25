import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route, RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import RepoInfo from 'conscience-components/RepoInfo'
import RepoFilesPage from './components/RepoFilesPage'
import RepoEditorPage from './components/RepoEditorPage'
import RepoConflictPage from './components/RepoConflictPage'
import RepoHistoryPage from './components/RepoHistoryPage'
import RepoDiscussionPage from './components/RepoDiscussionPage'
import RepoTeamPage from './components/RepoTeamPage'
import RepoHomePage from './components/RepoHomePage'
import { fetchFullRepo } from 'redux/repo/repoActions'
import { IGlobalState } from 'conscience-components/redux'
import { IRepo, URI, URIType } from 'conscience-lib/common'
import { autobind, stringToRepoPage } from 'conscience-lib/utils'


@autobind
class RepoPage extends React.Component<Props>
{
    constructor(props: Props) {
        super(props)
        this.fetchFullRepo()
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
            <main className={classes.main}>
                <RepoInfo
                    uri={{ type: URIType.Local, repoRoot: repo.path } as URI}
                    showPushPullButtons
                    repoPage={repoPage}
                />
                <div id="hihihi" className={classes.repoPage}> {/* @@TODO: either pass ref via props, or rename div ID to something sane */}
                    <div className={classes.repoPageInner}>
                        <Switch>
                            <Route path='/local-repo/:repoHash/files/:commit/:filename+' component={RepoFilesPage} />
                            <Route path='/local-repo/:repoHash/files/:commit' component={RepoFilesPage} />
                            <Route path='/local-repo/:repoHash/edit/:filename+' component={RepoEditorPage} />
                            <Route path='/local-repo/:repoHash/conflict/:filename+' component={RepoConflictPage} />
                            <Route path='/local-repo/:repoHash/history/:commit' component={RepoHistoryPage} />
                            <Route path='/local-repo/:repoHash/history' component={RepoHistoryPage} />
                            <Route path='/local-repo/:repoHash/discussion/:discussionID' component={RepoDiscussionPage} />
                            <Route path='/local-repo/:repoHash/discussion' component={RepoDiscussionPage} />
                            <Route path='/local-repo/:repoHash/team' component={RepoTeamPage} />
                            <Route path='/local-repo/:repoHash' component={RepoHomePage} />
                            <Route render={() => null} />
                        </Switch>
                    </div>
                </div>
            </main>
        )
    }

    componentDidUpdate(prevProps: Props) {
        if ((prevProps.repo || {}).path !== (this.props.repo || {}).path) {
            this.fetchFullRepo()
        }
    }

    fetchFullRepo() {
        const { repoID = undefined, path = undefined } = this.props.repo || {}
        if (repoID && path) {
            this.props.fetchFullRepo({ repoID, path })
        }
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
    },
    repoPageInner: {
        // marginTop: 32,
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
)(withStyles(styles)(RepoPage))
