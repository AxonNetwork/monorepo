import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import ControlPointIcon from '@material-ui/icons/ControlPoint'

class SharedRepos extends Component {

    addRepo = (repoID) => {
        this.props.addSharedRepo(repoID)
    }

    render() {
        const {classes, sharedRepos } = this.props
        return (
            <React.Fragment>
                <Typography className={classes.headline} variant="headline">
                    Shared Repos
                </Typography>
                <List>
                    {
                        sharedRepos.map(repo => (
                            <ListItem key={repo.repoID}>
                                <ListItemText primary={repo.repoID} />
                                <ListItemSecondaryAction onClick={() => this.addRepo(repo.repoID)}>
                                    <IconButton>
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

SharedRepos.propTypes = {
    sharedRepos: PropTypes.array.isRequired,
    addSharedRepo: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
}

const styles = theme => ({

})

export default withStyles(styles)(SharedRepos)
