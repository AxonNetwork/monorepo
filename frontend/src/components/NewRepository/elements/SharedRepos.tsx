import React from 'react'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import { ISharedRepoInfo } from 'common'

export interface SharedReposProps {
    sharedRepos: ISharedRepoInfo[]
    cloneSharedRepo: Function
}

class SharedRepos extends React.Component<SharedReposProps>
{
    render() {
        const { sharedRepos } = this.props
        return (
            <React.Fragment>
                <Typography variant="headline">
                    Shared Repos
                </Typography>
                <List>
                    {
                        sharedRepos.map(repo => (
                            <ListItem key={repo.repoID}>
                                <ListItemText primary={repo.repoID} />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() => this.props.cloneSharedRepo(repo.repoID)}>
                                        <ControlPointIcon />
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

export default SharedRepos
