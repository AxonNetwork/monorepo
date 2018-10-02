import React from 'react'
import classnames from 'classnames'
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
import RepoManuscriptPage from './elements/RepoManuscriptPage'
import RepoDiscussionPage from './elements/RepoDiscussionPage'
import RepoSettingsPage from './elements/RepoSettingsPage'
import autobind from 'utils/autobind'

@autobind
class Repository extends React.Component<Props, State>
{
    state = {
        page: 0
    }

    handleChange(_:any, page: number) {
        this.setState({ page })
    }

    switchToPage(page:string){
        switch(page){
            case "files":
                this.setState({ page: 0 })
                break
        }
    }

    render() {
        const classes = this.props.classes
        return (
            <div className={classes.repoWrapper}>
                <RepoInfo />

                <div className={classes.repoMainContent}>
                    {this.state.page === 0 &&
                        <RepoFilesPage />
                    }
                    {this.state.page === 1 &&
                        <RepoManuscriptPage />
                    }
                    {this.state.page === 2 &&
                        <RepoHistoryPage />
                    }
                    {this.state.page === 3 &&
                        <RepoDiscussionPage switchToPage={this.switchToPage}/>
                    }
                    {this.state.page === 4 &&
                        <RepoSettingsPage />
                    }
                </div>

                <BottomNavigation
                    value={this.state.page}
                    onChange={this.handleChange}
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
}

interface Props {
    sidebarOpen: boolean
    classes:any
}

interface State {
    page: number
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

export default withStyles(styles)(Repository)
