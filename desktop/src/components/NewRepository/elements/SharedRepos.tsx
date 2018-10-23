import React from 'react'
import { values } from 'lodash'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import { ISharedRepoInfo } from 'common'

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
    cloneSharedRepo: Function
}

export default SharedRepos
