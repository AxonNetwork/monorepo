import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { values } from 'lodash'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
// import CancelIcon from '@material-ui/icons/Cancel'
import CircularProgress from '@material-ui/core/CircularProgress'

import { pickBy } from 'lodash'
import { cloneSharedRepo, unshareRepoFromSelf } from 'redux/user/userActions'
import { ISharedRepoInfo } from 'common'
import { IGlobalState } from 'redux/store'

class SharedRepos extends React.Component<Props>
{
    render() {
        const { sharedRepos, classes } = this.props
        return (
            <React.Fragment>
                <Typography variant="headline">
                    Repos Shared with You
                </Typography>
                <List>
                    {
                        values(sharedRepos).map(repo => (
                            <ListItem key={repo.repoID}>
                                <ListItemText primary={repo.repoID} />
                                <ListItemSecondaryAction>
                                    {this.props.cloneSharedRepoLoading === repo.repoID &&
                                        <CircularProgress size={24} className={classes.buttonLoading} />
                                    }

                                    {this.props.cloneSharedRepoLoading !== repo.repoID &&
                                        <IconButton onClick={() => this.props.cloneSharedRepo({ repoID: repo.repoID })}>
                                            <ControlPointIcon />
                                        </IconButton>
                                    }

                                   {/*<IconButton onClick={() => this.props.unshareRepoFromSelf({ repoID: repo.repoID })}>
                                        <CancelIcon />
                                    </IconButton>*/}
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))
                    }
                </List>
            </React.Fragment>
        )
    }
}

interface Props {
    sharedRepos: {[repoID: string]: ISharedRepoInfo}
    cloneSharedRepoLoading: string | undefined
    cloneSharedRepo: typeof cloneSharedRepo
    unshareRepoFromSelf: typeof unshareRepoFromSelf

    classes?: any
}

const styles = (theme: Theme) => createStyles({
    buttonLoading: {
        color: theme.palette.secondary.main,
        margin: 12,
    },
})

const mapStateToProps = (state: IGlobalState) => {
    const sharedRepos = state.user.sharedRepos || {}
    const repos = state.repository.repos
    const repoList = Object.keys(repos).map(r => repos[r].repoID)
    const filteredSharedRepos = pickBy(
        sharedRepos,
        r => repoList.indexOf(r.repoID) < 0,
    )
    const cloneSharedRepoLoading = state.ui.cloneSharedRepoLoading

    const userID = state.user.currentUser
    return {
        sharedRepos: filteredSharedRepos,
        userID,
        cloneSharedRepoLoading,
    }
}

const mapDispatchToProps = {
    cloneSharedRepo,
    unshareRepoFromSelf,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(SharedRepos))
