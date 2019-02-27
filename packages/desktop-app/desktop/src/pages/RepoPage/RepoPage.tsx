import isEqual from 'lodash/isEqual'
import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route, RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import ErrorSnackbar from 'conscience-components/ErrorSnackbar'
import LargeProgressSpinner from 'conscience-components/LargeProgressSpinner'
import Scrollbar from 'conscience-components/Scrollbar'
import RepoInfo from 'conscience-components/RepoInfo'
import RepoFilesPage from './components/RepoFilesPage'
import RepoEditorPage from './components/RepoEditorPage'
import RepoConflictPage from './components/RepoConflictPage'
import RepoHistoryPage from './components/RepoHistoryPage'
import RepoDiscussionPage from './components/RepoDiscussionPage'
import RepoTeamPage from './components/RepoTeamPage'
import RepoHomePage from './components/RepoHomePage'
import { fetchRepoMetadata } from 'conscience-components/redux/repo/repoActions'
import { clearPullRepoError, clearCheckpointRepoError } from 'conscience-components/redux/ui/uiActions'
import { IGlobalState } from 'conscience-components/redux'
import { selectRepo } from 'conscience-components/navigation'
import { getURIFromParams } from 'conscience-components/env-specific'
import { IRepoMetadata, URI, RepoPage } from 'conscience-lib/common'
import { autobind, stringToRepoPage, uriToString } from 'conscience-lib/utils'


@autobind
class RepoPageContainer extends React.Component<Props>
{

    render() {
        const { uri, metadata, classes } = this.props
        if (uri === undefined || metadata === undefined) {
            return <LargeProgressSpinner />
        }
        const repoPage = stringToRepoPage(this.props.location.pathname)

        return (
            <main className={classes.main}>
                <RepoInfo
                    uri={uri}
                    showButtons
                    repoPage={repoPage}
                />
                <div id="hihihi" className={classes.repoPage}> {/* @@TODO: either pass ref via props, or rename div ID to something sane */}
                    <Scrollbar>
                        <div className={classes.repoPageInner}>
                            <Switch>
                                <Route path='/local-repo/:repoHash/files/:commit/:filename+' component={RepoFilesPage} />
                                <Route path='/local-repo/:repoHash/files/:commit' component={RepoFilesPage} />
                                <Route path='/local-repo/:repoHash/edit/:filename+' component={RepoEditorPage} />
                                <Route path='/local-repo/:repoHash/new-file/:filename+' component={RepoEditorPage} />
                                <Route path='/local-repo/:repoHash/conflict/:filename+' component={RepoConflictPage} />
                                <Route path='/local-repo/:repoHash/history/:commit' component={RepoHistoryPage} />
                                <Route path='/local-repo/:repoHash/history' component={RepoHistoryPage} />
                                <Route path='/local-repo/:repoHash/discussion/:discussionID' component={RepoDiscussionPage} />
                                <Route path='/local-repo/:repoHash/discussion' component={RepoDiscussionPage} />
                                <Route path='/local-repo/:repoHash/team' component={RepoTeamPage} />
                                <Route path='/local-repo/:repoHash/home' component={RepoHomePage} />
                                <Route path='/local-repo/:repoHash' component={RepoHomePage} />

                                <Route path='/repo/:repoID/files/:commit/:filename+' component={RepoFilesPage} />
                                <Route path='/repo/:repoID/files/:commit' component={RepoFilesPage} />
                                <Route path='/repo/:repoID/edit/:filename+' component={RepoEditorPage} />
                                <Route path='/repo/:repoID/conflict/:filename+' component={RepoConflictPage} />
                                <Route path='/repo/:repoID/history/:commit' component={RepoHistoryPage} />
                                <Route path='/repo/:repoID/history' component={RepoHistoryPage} />
                                <Route path='/repo/:repoID/discussion/:discussionID' component={RepoDiscussionPage} />
                                <Route path='/repo/:repoID/discussion' component={RepoDiscussionPage} />
                                <Route path='/repo/:repoID/team' component={RepoTeamPage} />
                                <Route path='/repo/:repoID/home' component={RepoHomePage} />
                                <Route path='/repo/:repoID' component={RepoHomePage} />

                                <Route render={() => null} />
                            </Switch>
                        </div>
                    </Scrollbar>
                </div>
                <ErrorSnackbar
                    open={!!this.props.pullError}
                    onClose={this.closePullError}
                    message={'Oops! Something went wrong downloading the latest changes.'}
                />
                <ErrorSnackbar
                    open={!!this.props.checkpointError}
                    onClose={this.closeCheckpointError}
                    message={'Oops! Something went wrong sharing your latest changes.'}
                />
            </main>
        )
    }

    componentDidMount() {
        if (this.props.uri) {
            this.props.fetchRepoMetadata({ repoList: [this.props.uri] })
        }
        document.addEventListener('keydown', this.onKeyDown, false)
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.uri && !isEqual(this.props.uri, prevProps.uri)) {
            this.props.fetchRepoMetadata({ repoList: [this.props.uri] })
        }
    }

    onKeyDown(evt: KeyboardEvent) {
        if ((evt.metaKey || evt.ctrlKey) && !evt.altKey && !evt.shiftKey) {
            if (evt.key === '1') {
                selectRepo(this.props.uri!, RepoPage.Home)
                evt.stopPropagation()
            } else if (evt.key === '2') {
                selectRepo(this.props.uri!, RepoPage.Files)
                evt.stopPropagation()
            } else if (evt.key === '3') {
                selectRepo(this.props.uri!, RepoPage.History)
                evt.stopPropagation()
            } else if (evt.key === '4') {
                selectRepo(this.props.uri!, RepoPage.Discussion)
                evt.stopPropagation()
            } else if (evt.key === '5') {
                selectRepo(this.props.uri!, RepoPage.Team)
                evt.stopPropagation()
            }
        }
    }

    closePullError() {
        if (this.props.uri) {
            this.props.clearPullRepoError({ uri: this.props.uri })
        }
    }

    closeCheckpointError() {
        if (this.props.uri) {
            this.props.clearCheckpointRepoError({})
        }
    }
}

interface MatchParams {
    repoHash?: string
    repoID?: string
}

interface Props extends RouteComponentProps<MatchParams> {
    uri?: URI
    metadata: IRepoMetadata | null | undefined
    menuLabelsHidden: boolean
    pullError: Error | undefined
    checkpointError: Error | undefined
    fetchRepoMetadata: typeof fetchRepoMetadata
    clearPullRepoError: typeof clearPullRepoError
    clearCheckpointRepoError: typeof clearCheckpointRepoError
    classes: any
}

const styles = (theme: Theme) => createStyles({
    main: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    repoPage: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    repoPageInner: {
        marginRight: 60,
        marginBottom: 64,
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: Props) => {
    const uri = getURIFromParams(ownProps.match.params, state)
    const uriStr = uriToString(uri)
    return {
        uri,
        metadata: state.repo.metadataByURI[uriStr],
        menuLabelsHidden: state.user.userSettings.menuLabelsHidden || false,
        pullError: state.ui.pullRepoErrorByURI[uriStr],
        checkpointError: state.ui.checkpointError,
    }
}

const mapDispatchToProps = {
    fetchRepoMetadata,
    clearPullRepoError,
    clearCheckpointRepoError
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoPageContainer))
