import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import OpenFolderButton from './RepoInfo/OpenFolderButton'
import PullButton from './RepoInfo/PullButton'
import { IRepo } from '../../../common'

import { IGlobalState } from '../../../redux/store'
import { pullRepo } from '../../../redux/repository/repoActions'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import DescriptionIcon from '@material-ui/icons/Description'
import HistoryIcon from '@material-ui/icons/History'
import CommentIcon from '@material-ui/icons/Comment'
import SettingsIcon from '@material-ui/icons/Settings'


function RepoInfo(props: {
    repo: IRepo | undefined
    pullRepo: Function
    classes: any,
})
{
    const { repo, pullRepo, classes } = props
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
                <div className={classnames(classes.tab, classes.activeTab)}><FolderOpenIcon nativeColor="rgba(0, 0, 0, 0.7)" /></div>
                <div className={classnames(classes.tab)}><DescriptionIcon nativeColor="rgba(0, 0, 0, 0.54)" /></div>
                <div className={classnames(classes.tab)}><HistoryIcon nativeColor="rgba(0, 0, 0, 0.54)" /></div>
                <div className={classnames(classes.tab)}><CommentIcon nativeColor="rgba(0, 0, 0, 0.54)" /></div>
                <div className={classnames(classes.tab)}><SettingsIcon nativeColor="rgba(0, 0, 0, 0.54)" /></div>
            </div>
        </div>
    )
}

const styles = (theme: Theme) => createStyles({
    repoInfo: {
        borderBottom: '1px solid #e4e4e4',
        display: 'flex',
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
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexGrow: 1,
        maxWidth: 360,
        marginLeft: 100,
        marginRight: 60,
    },
    tab: {
        padding: '10px 16px 0',
        width: '3.5rem',
        height: '2.6rem',
        backgroundColor: '#fafafa',
        cursor: 'pointer',
    },
    activeTab: {
        border: '1px solid #e4e4e4',
        borderBottom: 'none',
        position: 'relative',
        top: 1,
    },
    spacer: {
        flexGrow: 1,
    },
})

const mapStateToProps = (state: IGlobalState) => {
    const selected = state.repository.selectedRepo || ''
    const repo = state.repository.repos[selected]
    return {
        repo,
    }
}

const mapDispatchToProps = {
    pullRepo,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoInfo))