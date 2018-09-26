import React from 'react'
import classnames from 'classnames'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import HistoryIcon from '@material-ui/icons/History'
import CommentIcon from '@material-ui/icons/Comment'

import RepoInfo from './elements/RepoInfo'
import RepoFilesPage from './elements/RepoFilesPage'
import RepoTimelinePage from './elements/RepoTimelinePage'
import RepoDiscussionPage from './elements/RepoDiscussionPage'
import autobind from 'utils/autobind'

export interface RepositoryProps {
    sidebarOpen: boolean
    classes:any
}

export interface RepositoryState {
    page: number
}

@autobind
class Repository extends React.Component<RepositoryProps, RepositoryState>
{
    state = {
        page: 0
    }

    handleChange(_:any, page: number) {
        this.setState({ page })
    }

    render() {
        const classes = this.props.classes
        return(
            <React.Fragment>
                <RepoInfo />
                {this.state.page === 0 &&
                    <RepoFilesPage />
                }
                {this.state.page === 1 &&
                    <RepoTimelinePage />
                }
                {this.state.page === 2 &&
                    <RepoDiscussionPage />
                }
                <BottomNavigation
                    value={this.state.page}
                    onChange={this.handleChange}
                    showLabels
                    className={classnames(classes.bottomNav, { [classes.bottomNavSidebarOpen]: this.props.sidebarOpen })}
                >
                    <BottomNavigationAction label="Files" icon={<FolderOpenIcon />} />
                    <BottomNavigationAction label="History" icon={<HistoryIcon />} />
                    <BottomNavigationAction label="Discussion" icon={<CommentIcon />} />
                </BottomNavigation>
            </React.Fragment>
        )
    }
}

const styles = (theme: Theme) => createStyles({
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

export default withStyles(styles)(Repository)
