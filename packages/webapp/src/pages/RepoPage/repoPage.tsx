import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route, RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import RepoInfo from 'conscience-components/RepoInfo'
import RepoHomePage from './components/RepoHomePage'
import RepoFilesPage from './components/RepoFilesPage'
import RepoHistoryPage from './components/RepoHistoryPage'
import RepoDiscussionPage from './components/RepoDiscussionPage'
import RepoTeamPage from './components/RepoTeamPage'
import { fetchRepoMetadata } from 'conscience-components/redux/repo/repoActions'
import { IGlobalState } from 'conscience-components/redux'
import { URI, URIType } from 'conscience-lib/common'
import { stringToRepoPage } from 'conscience-lib/utils'
import isEqual from 'lodash/isEqual'


class RepoPageRoutes extends React.Component<Props>
{
    render() {
        const { uri, classes } = this.props

        const repoPage = stringToRepoPage(this.props.location.pathname)

        return (
            <div className={classes.container}>
                <main className={classes.main}>
                    <div className={classes.repository}>
                        <RepoInfo
                            uri={uri}
                            repoPage={repoPage}
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

    componentDidMount() {
        this.props.fetchRepoMetadata({ repoList: [this.props.uri] })
    }

    componendDidUpdate(prevProps: Props) {
        if (!isEqual(prevProps.uri, this.props.uri)) {
            this.props.fetchRepoMetadata({ repoList: [this.props.uri] })
        }
    }
}

interface MatchParams {
    repoID: string
}

interface Props extends RouteComponentProps<MatchParams> {
    uri: URI
    menuLabelsHidden: boolean
    fetchRepoMetadata: typeof fetchRepoMetadata
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
    const uri = { type: URIType.Network, repoID } as URI
    return {
        uri,
        menuLabelsHidden: state.user.userSettings.menuLabelsHidden || false,
    }
}

const mapDispatchToProps = {
    fetchRepoMetadata
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoPageRoutes))
