import React from 'react'
import { connect } from 'react-redux'
import { values } from 'lodash'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import CancelIcon from '@material-ui/icons/Cancel'

import { pickBy } from 'lodash'
import { cloneSharedRepo, unshareRepoFromSelf } from 'redux/user/userActions'
import { ISharedRepoInfo } from 'common'
import { IGlobalState } from 'redux/store'

class SharedRepos extends React.Component<Props>
{
    render() {
        const { sharedRepos } = this.props
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
                                    <IconButton onClick={() => this.props.cloneSharedRepo({ repoID: repo.repoID })}>
                                        <ControlPointIcon />
                                    </IconButton>

                                   <IconButton onClick={() => this.props.unshareRepoFromSelf({ repoID: repo.repoID })}>
                                        <CancelIcon />
                                    </IconButton>
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
    cloneSharedRepo: typeof cloneSharedRepo
    unshareRepoFromSelf: typeof unshareRepoFromSelf
}

const mapStateToProps = (state: IGlobalState) => {
    const sharedRepos = state.user.sharedRepos || {}
    const repos = state.repository.repos
    const repoList = Object.keys(repos).map(r => repos[r].repoID)
    const filteredSharedRepos = pickBy(
        sharedRepos,
        r => repoList.indexOf(r.repoID) < 0,
    )

    const userID = state.user.currentUser
    return {
        sharedRepos: filteredSharedRepos,
        userID,
    }
}

const mapDispatchToProps = {
    cloneSharedRepo,
    unshareRepoFromSelf,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SharedRepos)
