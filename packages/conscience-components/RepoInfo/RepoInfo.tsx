import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import PushPullButtons from 'conscience-components/PushPullButtons'
import Tabs from 'conscience-components/Tabs'
import { H5 } from 'conscience-components/Typography/Headers'
import { pullRepo, checkpointRepo } from '../redux/repo/repoActions'
import { IGlobalState } from '../redux'
import { selectRepo } from '../navigation'
import { getRepo } from '../env-specific'
import { RepoPage, URI, URIType } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoInfo extends React.Component<Props>
{
    render() {
        const { uri, classes } = this.props
        const repo = getRepo(uri)
        if (repo === undefined) {
            return null
        }
        const version = (repo.commitList !== undefined) ? 'v' + repo.commitList.length : ''
        return (
            <div className={classes.repoInfo}>
                <div className={classes.titleContainer}>
                    <H5 className={classes.headline}>{repo.repoID}</H5>
                    <Typography className={classes.version}>{version}</Typography>

                    {this.props.showPushPullButtons &&
                        <PushPullButtons
                            uri={this.props.uri}
                            pullProgress={this.props.pullProgress}
                            checkpointLoading={this.props.checkpointLoading}
                            pullRepo={this.props.pullRepo}
                            checkpointRepo={this.props.checkpointRepo}
                            classes={{ root: classes.pushPullButtons }}
                        />
                    }
                </div>

                <div className={classes.spacer}></div>

                <Tabs
                    pages={[
                        [RepoPage.Home, 'Home'],
                        [RepoPage.Files, 'Files'],
                        [RepoPage.History, 'History'],
                        [RepoPage.Discussion, 'Discussion'],
                        [RepoPage.Team, 'Team'],
                    ]}
                    activePage={this.props.repoPage}
                    onTabSelect={this.navigateRepoPage}
                    menuLabelsHidden={this.props.menuLabelsHidden}
                />
            </div >
        )
    }

    navigateRepoPage(repoPage: RepoPage) {
        selectRepo(this.props.uri, repoPage)
    }
}

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    uri: URI
    showPushPullButtons?: boolean
    repoPage: RepoPage
}

interface StateProps {
    menuLabelsHidden: boolean
    pullProgress: { fetched: number, toFetch: number } | undefined
    checkpointLoading: boolean

    pullRepo: typeof pullRepo,
    checkpointRepo: typeof checkpointRepo,
}

const styles = (theme: Theme) => createStyles({
    repoInfo: {
        borderBottom: '1px solid #e4e4e4',
        display: 'flex',
        justifyContent: 'space-between',
        flexShrink: 0,
    },
    locationLink: {
        color: theme.palette.secondary.main,
        cursor: 'pointer',
    },
    headline: {
        marginRight: '8px',
        display: 'block',
        fontSize: '2rem',
        color: 'rgba(0, 0, 0, 0.7)',
    },
    version: {
        // display: 'inline-block',
    },
    caption: {
        fontSize: '10pt',
    },
    titleContainer: {
        paddingBottom: 20,
        display: 'flex',
        flexWrap: 'wrap',
    },
    pushPullButtons: {
        marginLeft: 30,
    },
    spacer: {
        flexGrow: 1,
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    let pullProgress = undefined
    let checkpointLoading = false
    if (ownProps.uri.type === URIType.Local) {
        pullProgress = state.ui.pullRepoProgress[ownProps.uri.repoRoot]
        checkpointLoading = state.ui.checkpointLoading
    }
    const menuLabelsHidden = state.user.userSettings.menuLabelsHidden || false
    return {
        menuLabelsHidden,
        pullProgress,
        checkpointLoading,
    }
}

const mapDispatchToProps = {
    pullRepo,
    checkpointRepo,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoInfo))