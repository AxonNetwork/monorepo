import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

// import OpenFolderButton from './RepoInfo/OpenFolderButton'
import { IRepo } from 'common'

import { IGlobalState } from 'redux/store'
import { navigateRepoPage } from 'redux/repository/repoActions'
import { RepoPage } from 'redux/repository/repoReducer'
import PushPullButtons from './RepoInfo/PushPullButtons'
import Tabs from '../../Tabs/Tabs'
import autobind from 'utils/autobind'


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
                {/*<OpenFolderButton folderPath={repo.path} />*/}
                <div className={classes.titleContainer}>
                    <Typography variant="headline" className={classes.headline}>{repo.repoID}</Typography>
                    <Typography className={classes.version}>{version}</Typography>

                    <PushPullButtons
                        repo={repo}
                        pullLoading={this.props.pullLoading}
                        checkpointLoading={this.props.checkpointLoading}
                        classes={{ root: classes.pushPullButtons }}
                    />
                </div>

                <div className={classes.spacer}></div>

                <Tabs
                    pages={[
                        [RepoPage.Home, 'Home'],
                        [RepoPage.Files, 'Files'],
                        // [RepoPage.Manuscript, 'Manuscript'],
                        [RepoPage.History, 'History'],
                        [RepoPage.Discussion, 'Discussion'],
                        [RepoPage.Settings, 'Settings'],

                    ]}
                    activePage={this.props.repoPage}
                    onTabSelect={(repoPage: RepoPage) => { this.props.navigateRepoPage({ repoPage }) }}
                    menuLabelsHidden={this.props.menuLabelsHidden}
                />
            </div >
        )
    }
}

interface Props {
    repo: IRepo | undefined
    repoPage: RepoPage
    menuLabelsHidden: boolean
    pullLoading: boolean
    checkpointLoading: boolean

    navigateRepoPage: typeof navigateRepoPage

    classes: any
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

const mapStateToProps = (state: IGlobalState) => {
    const selected = state.repository.selectedRepo || ''
    const repo = state.repository.repos[selected]
    const repoPage = state.repository.repoPage
    const menuLabelsHidden = state.user.menuLabelsHidden
    const pullLoading = state.ui.pullLoading
    const checkpointLoading = state.ui.checkpointLoading
    return {
        repo,
        repoPage,
        menuLabelsHidden,
        pullLoading,
        checkpointLoading,
    }
}

const mapDispatchToProps = {
    navigateRepoPage,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoInfo))