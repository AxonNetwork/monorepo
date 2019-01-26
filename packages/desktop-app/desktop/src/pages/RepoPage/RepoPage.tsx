import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route, RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import LargeProgressSpinner from 'conscience-components/LargeProgressSpinner'
import RepoInfo from 'conscience-components/RepoInfo'
import RepoFilesPage from './components/RepoFilesPage'
import RepoEditorPage from './components/RepoEditorPage'
import RepoConflictPage from './components/RepoConflictPage'
import RepoHistoryPage from './components/RepoHistoryPage'
import RepoDiscussionPage from './components/RepoDiscussionPage'
import RepoTeamPage from './components/RepoTeamPage'
import RepoHomePage from './components/RepoHomePage'
import { fetchFullRepo } from 'conscience-components/redux/repo/repoActions'
import { IGlobalState } from 'conscience-components/redux'
import { selectRepo } from 'conscience-components/navigation'
import { getURIFromParams } from 'conscience-components/env-specific'
import { URI, RepoPage } from 'conscience-lib/common'
import { autobind, stringToRepoPage } from 'conscience-lib/utils'
import { isEqual } from 'lodash'


@autobind
class RepoPageContainer extends React.Component<Props>
{
    constructor(props: Props) {
        super(props)
        if (props.uri) {
            this.props.fetchFullRepo({ uri: props.uri })
        }
    }

    render() {
        const { uri, classes } = this.props
        if (uri === undefined) {
            return <LargeProgressSpinner />
        }
        const repoPage = stringToRepoPage(this.props.location.pathname)

        return (
            <main className={classes.main}>
                <RepoInfo
                    uri={uri}
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
                </div>
            </main>
        )
    }

    componentDidMount() {
        document.addEventListener('keydown', this.onKeyDown, false)
    }

    onKeyDown(evt: React.KeyboardEvent<Element>) {
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

    componentDidUpdate(prevProps: Props) {
        if (this.props.uri && !isEqual(this.props.uri, prevProps.uri)) {
            this.props.fetchFullRepo({ uri: this.props.uri })
        }
    }
}

interface MatchParams {
    repoHash?: string
    repoID?: string
}

interface Props extends RouteComponentProps<MatchParams> {
    uri?: URI
    menuLabelsHidden: boolean
    fetchFullRepo: typeof fetchFullRepo
    classes: any
}

const styles = (theme: Theme) => createStyles({
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

const mapStateToProps = (state: IGlobalState, ownProps: Props) => {
    const uri = getURIFromParams(ownProps.match.params)
    return {
        uri,
        menuLabelsHidden: state.user.userSettings.menuLabelsHidden || false,
    }
}

const mapDispatchToProps = {
    fetchFullRepo
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoPageContainer))
