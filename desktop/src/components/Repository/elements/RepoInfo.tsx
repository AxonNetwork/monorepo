import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

// import OpenFolderButton from './RepoInfo/OpenFolderButton'
import PullButton from './RepoInfo/PullButton'
import { IRepo } from 'common'

import { IGlobalState } from 'redux/store'
import { pullRepo, navigateRepoPage } from 'redux/repository/repoActions'
import { RepoPage } from 'redux/repository/repoReducer'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import DescriptionIcon from '@material-ui/icons/Description'
import HistoryIcon from '@material-ui/icons/History'
import CommentIcon from '@material-ui/icons/Comment'
import SettingsIcon from '@material-ui/icons/Settings'
import Button from '@material-ui/core/Button'
import autobind from 'utils/autobind'


@autobind
class RepoInfo extends React.Component<Props>
{
    render() {
        const { repo, pullRepo, classes } = this.props
        if (repo === undefined) {
            return null
        }
        const version = (repo.commitList !== undefined) ? 'v' + repo.commitList.length : ''
        return (
            <div className={classes.repoInfo}>
                {/*<OpenFolderButton folderPath={repo.path} />*/}
                <div className={classes.titleContainer}>
                    <Typography variant="headline" className={classes.headline}>
                        {repo.repoID}
                    </Typography>
                    <Typography className={classes.version}>
                        {version}
                    </Typography>
                    {
                        repo.behindRemote &&
                        <PullButton
                            pullRepo={pullRepo}
                            folderPath={repo.path}
                            repoID={repo.repoID}
                        />
                    }
                </div>

                <div className={classes.spacer}></div>

                <div className={classes.tabContainer}>
                    <Tab repoPage={RepoPage.Files} activeRepoPage={this.props.repoPage} navigateRepoPage={this.props.navigateRepoPage} classes={classes}>
                        <FolderOpenIcon />{this.props.menuLabelsHidden ? '' : 'Files'}
                    </Tab>
                    <Tab repoPage={RepoPage.Manuscript} activeRepoPage={this.props.repoPage} navigateRepoPage={this.props.navigateRepoPage} classes={classes}>
                        <DescriptionIcon />{this.props.menuLabelsHidden ? '' : 'Editor'}
                    </Tab>
                    <Tab repoPage={RepoPage.History} activeRepoPage={this.props.repoPage} navigateRepoPage={this.props.navigateRepoPage} classes={classes}>
                        <HistoryIcon />{this.props.menuLabelsHidden ? '' : 'History'}
                    </Tab>
                    <Tab repoPage={RepoPage.Discussion} activeRepoPage={this.props.repoPage} navigateRepoPage={this.props.navigateRepoPage} classes={classes}>
                        <CommentIcon />{this.props.menuLabelsHidden ? '' : 'Discussion'}
                    </Tab>
                    <Tab repoPage={RepoPage.Settings} activeRepoPage={this.props.repoPage} navigateRepoPage={this.props.navigateRepoPage} classes={classes}>
                        <SettingsIcon />{this.props.menuLabelsHidden ? '' : 'Settings'}
                    </Tab>
                </div>
            </div>
        )
    }
}

interface Props {
    repo: IRepo | undefined
    repoPage: RepoPage
    menuLabelsHidden: boolean | undefined
    classes: any
    pullRepo: typeof pullRepo
    navigateRepoPage: typeof navigateRepoPage
}

function Tab(props: {
    navigateRepoPage: typeof navigateRepoPage
    repoPage: RepoPage
    activeRepoPage: RepoPage
    children: any
    classes: any,
}) {
    return (
        <div className={classnames(props.classes.tab, { [props.classes.activeTab]: props.repoPage === props.activeRepoPage })}>
            <Button onClick={() => props.navigateRepoPage({ repoPage: props.repoPage })} >
                {props.children}
            </Button>
        </div>
    )
}

const styles = (theme: Theme) => createStyles({
    repoInfo: {
        borderBottom: '1px solid #e4e4e4',
        display: 'flex',
        flexShrink: 0,
    },
    locationLink: {
        color: theme.palette.secondary.main,
        cursor: 'pointer',
    },
    headline: {
        marginRight: '8px',
        display: 'inline-block',
        fontSize: '2rem',
        color: 'rgba(0, 0, 0, 0.7)',
    },
    version: {
        display: 'inline-block',
    },
    caption: {
        fontSize: '10pt',
    },
    titleContainer: {
        paddingBottom: 20,
    },
    tabContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexGrow: 1,
        maxWidth: 510,
        marginLeft: 100,
        marginRight: 60,
    },
    tab: {
        // padding: '10px 16px 0',
        // width: '3.5rem',
        height: '2.6rem',
        backgroundColor: '#f3f3f3',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontFamily: 'Helvetica',
        color: 'rgba(0, 0, 0, 0.33)',
        border: '1px solid #e4e4e4',
        borderRadius: 3,
        position: 'relative',
        top: 1,

        '& svg': {
            width: '0.8em',
            height: '0.8em',
            marginRight: 3,
            verticalAlign: 'bottom',
        },

        '& button': {
            color: 'inherit',
            textTransform: 'none',
            minWidth: 'unset',
            padding: '0 16px',
            borderRadius: 0,
            height: '100%',
            fontWeight: 400,
        },
        '& button:hover': {
            backgroundColor: 'inherit',
        },
    },
    activeTab: {
        borderBottom: 'none',
        position: 'relative',
        color: 'rgba(0, 0, 0, 0.7)',
        backgroundColor: '#fafafa',

        '& svg': {
            fill: 'rgba(0, 0, 0, 0.7)',
        },
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
    return {
        repo,
        repoPage,
        menuLabelsHidden,
    }
}

const mapDispatchToProps = {
    pullRepo,
    navigateRepoPage,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoInfo))