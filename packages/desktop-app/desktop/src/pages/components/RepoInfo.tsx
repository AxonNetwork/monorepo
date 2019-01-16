import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import PushPullButtons from 'conscience-components/PushPullButtons'
import Tabs from 'conscience-components/Tabs'
import { pullRepo, checkpointRepo, selectFile } from 'redux/repository/repoActions'
import { IGlobalState } from 'redux/store'
import { IRepo, RepoPage } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoInfo extends React.Component<Props>
{
    render() {
        const { repo, classes } = this.props
        if (repo === undefined) {
            return null
        }
        const version = (repo.commitList !== undefined) ? 'v' + repo.commitList.length : ''
        return (
            <div className={classes.repoInfo}>
                <div className={classes.titleContainer}>
                    <Typography variant="headline" className={classes.headline}>{repo.repoID}</Typography>
                    <Typography className={classes.version}>{version}</Typography>

                    <PushPullButtons
                        repo={repo}
                        pullProgress={this.props.pullProgress}
                        checkpointLoading={this.props.checkpointLoading}
                        pullRepo={this.props.pullRepo}
                        checkpointRepo={this.props.checkpointRepo}
                        selectFile={this.props.selectFile}
                        classes={{ root: classes.pushPullButtons }}
                    />
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
                    onTabSelect={this.props.navigateRepoPage}
                    menuLabelsHidden={this.props.menuLabelsHidden}
                />
            </div >
        )
    }
}

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    repo: IRepo
    repoPage: RepoPage
    navigateRepoPage: (repoPage: RepoPage) => void
}

interface StateProps {
    menuLabelsHidden: boolean
    pullProgress: { fetched: number, toFetch: number } | undefined
    checkpointLoading: boolean

    pullRepo: typeof pullRepo,
    checkpointRepo: typeof checkpointRepo,
    selectFile: typeof selectFile,
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
    const repoRoot = ownProps.repo.path
    const menuLabelsHidden = state.user.userSettings.menuLabelsHidden
    const pullProgress = state.ui.pullRepoProgress[repoRoot || ""]
    const checkpointLoading = state.ui.checkpointLoading
    return {
        menuLabelsHidden,
        pullProgress,
        checkpointLoading,
    }
}

const mapDispatchToProps = {
    pullRepo,
    checkpointRepo,
    selectFile,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoInfo))