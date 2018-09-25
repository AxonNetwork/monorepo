import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Badge from '@material-ui/core/Badge'
import Divider from '@material-ui/core/Divider'

import { fetchRepos, selectRepo } from '../../redux/repository/repoActions'

class RepoList extends Component
{
    componentDidMount() {
        this.props.fetchRepos()
    }

    render() {
        const repos = this.props.repos
        const classes = this.props.classes

        return (
            <div className={classes.sidebarWrapper}>

                <List className={classes.repoList}>
                    {
                        Object.keys(repos).sort().map((folderPath) => {
                            let repo = repos[folderPath]
                            let isChanged = false
                            const files = repo.files
                            if (files !== undefined) {
                                isChanged = Object.keys(files).some(
                                    (name) => files[name].status === '*modified' || files[name].status === '*added',
                                )
                            }
                            let isSelected = this.props.currentPage === 'repo' && repo.folderPath === this.props.selectedRepo
                            return (
                                <React.Fragment key={repo.folderPath}>
                                    <ListItem
                                        button
                                        className={classnames(classes.sidebarItem, { [classes.selected]: isSelected }) }
                                        onClick={() => this.props.selectRepo(repo)}
                                    >
                                    { isChanged &&
                                         <Badge classes={{badge: this.props.classes.badge}} badgeContent="" color="secondary">
                                            <ListItemText primary={repo.repoID} primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                                        </Badge>
                                    }
                                    { !isChanged &&
                                        <ListItemText primary={repo.repoID} primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                                    }
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            )
                        })
                    }

                </List>
            </div>
        )
    }
}

RepoList.propTypes = {
    repos: PropTypes.object.isRequired,
    selectedRepo: PropTypes.string,
    user: PropTypes.object.isRequired,
    fetchRepos: PropTypes.func.isRequired,
    selectRepo: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
}

const styles = theme => ({
    sidebarWrapper: {
        backgroundColor: '#383840',
        width: 200,
    },
    repoList: {
        // position: 'fixed',
        // top: 0,
        // bottom: 0,
        // left: 0,
        height: '100%',
        padding: 0,
        borderRight: '1px solid',
        borderRightColor: theme.palette.grey[300],
    },
    selected: {
        backgroundColor: theme.palette.action.hover,
    },
    badge: {
        top: '8px',
        width: ' 8px',
        left: '-16px',
        height: ' 8px',
    },
    sidebarItemText: {
        color: 'rgb(212, 212, 212)',
    },
})

const mapStateToProps = (state, ownProps) => {
    return {
        repos: state.repository.repos,
        selectedRepo: state.repository.selectedRepo,
        user: state.user,
        currentPage: state.navigation.currentPage,
    }
}

const mapDispatchToProps = {
    fetchRepos,
    selectRepo,
}

const RepoListContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoList))

export default RepoListContainer

