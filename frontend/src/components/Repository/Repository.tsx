import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import DescriptionIcon from '@material-ui/icons/Description'
import HistoryIcon from '@material-ui/icons/History'
import CommentIcon from '@material-ui/icons/Comment'
import SettingsIcon from '@material-ui/icons/Settings'

import RepoInfo from './elements/RepoInfo'
import RepoFilesPage from './elements/RepoFilesPage'
import RepoHistoryPage from './elements/RepoHistoryPage'
import RepoEditorPage from './elements/RepoEditorPage'
import RepoDiscussionPage from './elements/RepoDiscussionPage'
import RepoSettingsPage from './elements/RepoSettingsPage'
import autobind from 'utils/autobind'
import { RepoPage } from 'redux/repository/repoReducer'
import { navigateRepoPage } from 'redux/repository/repoActions'
import { IGlobalState } from 'redux/store'


@autobind
class Repository extends React.Component<Props>
{
    render() {
        const classes = this.props.classes
        return (
            <div className={classes.repoWrapper}>
                <RepoInfo />

                <div className={classes.repoMainContent}>
                    {this.props.repoPage === RepoPage.Files &&
                        <RepoFilesPage />
                    }
                    {this.props.repoPage === RepoPage.Manuscript &&
                        <RepoEditorPage />
                    }
                    {this.props.repoPage === RepoPage.History &&
                        <RepoHistoryPage />
                    }
                    {this.props.repoPage === RepoPage.Discussion &&
                        <RepoDiscussionPage />
                    }
                    {this.props.repoPage === RepoPage.Settings &&
                        <RepoSettingsPage />
                    }
                </div>

                <BottomNavigation
                    value={this.props.repoPage as number}
                    onChange={this.onNavigateRepoPage}
                    showLabels
                    className={classnames(classes.bottomNav, { [classes.bottomNavSidebarOpen]: this.props.sidebarOpen })}
                >
                    <BottomNavigationAction label="Files" icon={<FolderOpenIcon />} />
                    <BottomNavigationAction label="Editor" icon={<DescriptionIcon />} />
                    <BottomNavigationAction label="History" icon={<HistoryIcon />} />
                    <BottomNavigationAction label="Discussion" icon={<CommentIcon />} />
                    <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
                </BottomNavigation>
            </div>
        )
    }

    onNavigateRepoPage(_: any, i: number) {
        this.props.navigateRepoPage({ repoPage: i as RepoPage })
    }
}

interface Props {
    sidebarOpen: boolean
    repoPage: RepoPage
    navigateRepoPage: typeof navigateRepoPage
    classes: any
}

const styles = (theme: Theme) => createStyles({
    repoWrapper: {
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        flexGrow: 1,
    },
    repoMainContent: {
        marginTop: 30,
        overflowY: 'hidden',
        display: 'flex',
        flexGrow: 1,

        '& > *': {
            flexGrow: 1,
        },
    },
    bottomNav: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: '1px solid',
        borderColor: '#bfbfbf',
        backgroundColor: '#f3f3f3',
        zIndex: 100,
        transition: theme.transitions.create('left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    bottomNavSidebarOpen: {
        left: 200,
        transition: theme.transitions.create('left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
})

const mapStateToProps = (state: IGlobalState) => {
    return {
        repoPage: state.repository.repoPage,
    }
}

const mapDispatchToProps = {
    navigateRepoPage,
}

const RepositoryContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(Repository))

export default withStyles(styles)(RepositoryContainer)
