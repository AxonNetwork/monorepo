import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import HistoryIcon from '@material-ui/icons/History'
import CommentIcon from '@material-ui/icons/Comment'

import path from 'path'

import RepoInfo from './elements/RepoInfo'
import RepoFilesPage from './elements/RepoFilesPage'
import RepoTimelinePage from './elements/RepoTimelinePage'
import RepoDiscussionPage from './elements/RepoDiscussionPage'

class Repository extends Component
{
    state = { page: 0 }

    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e, page) {
        this.setState({ page })
    }

    render() {
        const classes = this.props.classes
        const timeline = this.props.repo.timeline || []
        return(
            <React.Fragment>
                <RepoInfo
                    repo={this.props.repo}
                    addCollaborator={this.props.addCollaborator}
                    addHypothesis={this.props.addHypothesis}
                    pullRepo={this.props.pullRepo}
                />
                {this.state.page === 0 &&
                    <RepoFilesPage
                        repo={this.props.repo}
                        checkpointRepo={this.props.checkpointRepo}
                        selectedFile={this.props.selectedFile}
                        selectFile={this.props.selectFile}
                        unselectFile={this.props.unselectFile}
                        getDiff={this.props.getDiff}
                        revertFiles={this.props.revertFiles}
                    />
                }
                {this.state.page === 1 &&
                    <RepoTimelinePage
                        folderPath={this.props.repo.folderPath}
                        timeline={timeline}
                        getDiff={this.props.getDiff}
                        revertFiles={this.props.revertFiles}
                    />
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

Repository.propTypes = {
    repo: PropTypes.object.isRequired,
    checkpointRepo: PropTypes.func.isRequired,
    pullRepo: PropTypes.func.isRequired,
    selectedFile: PropTypes.object,
    selectFile: PropTypes.func.isRequired,
    unselectFile: PropTypes.func.isRequired,
    getDiff: PropTypes.func.isRequired,
    revertFiles: PropTypes.func.isRequired,
    addCollaborator: PropTypes.func.isRequired,
    sidebarOpen: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired
}

const styles = theme => ({
    bottomNav: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: '1px solid',
        // backgroundColor: theme.palette.background.default,
        // borderColor: theme.palette.grey[300],
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
