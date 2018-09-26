import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { createStyles, withStyles, Theme } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Badge from '@material-ui/core/Badge'
import Divider from '@material-ui/core/Divider'

import { fetchRepos, selectRepo } from '../../redux/repository/repoActions'

export interface RepoListProps {
    repos: Object
    selectedRepo: string
    currentPage: string
    fetchRepos: Function
    selectRepo: Function
    classes: {
        sidebarWrapper: string
        repoList: string
        selected: string
        badge: string
        sidebarItemText: string
    }
}

class RepoList extends React.Component<RepoListProps>
{
    componentDidMount() {
        this.props.fetchRepos()
    }

    render() {
        const { repos, selectedRepo, currentPage, classes } = this.props

        return (
            <div className={classes.sidebarWrapper}>
                <List className={classes.repoList}>
                    {
                        Object.keys(repos).sort().map((folderPath: string) => {
                            let repo = repos[folderPath]
                            let isChanged = false
                            const files = repo.files
                            if (files !== undefined) {
                                isChanged = Object.keys(files).some(
                                    (name) => files[name].status === '*modified' || files[name].status === '*added',
                                )
                            }
                            let isSelected = currentPage === 'repo' && repo.folderPath === selectedRepo
                            return (
                                <React.Fragment key={repo.folderPath}>
                                    <ListItem
                                        button
                                        className={classnames({ [classes.selected]: isSelected })}
                                        onClick={() => this.props.selectRepo(repo)}
                                    >
                                    { isChanged &&
                                         <Badge classes={{badge: classes.badge}} badgeContent="" color="secondary">
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

const styles = (theme: Theme) => createStyles({
    sidebarWrapper: {
        backgroundColor: '#383840',
        width: 200,
    },
    repoList: {
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

const mapStateToProps = (state) => {
    return {
        repos: state.repository.repos,
        selectedRepo: state.repository.selectedRepo,
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