import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import OpenFolderButton from './RepoInfo/OpenFolderButton'
import Sharing from './RepoInfo/Sharing'
import PullButton from './RepoInfo/PullButton'
import Hypothesis from './Hypothesis'

const shell = window.require('electron').shell

class RepoInfo extends Component
{
    constructor(props) {
        super(props)
        this.onClickOpenFolder = this.onClickOpenFolder.bind(this)
    }

    onClickOpenFolder() {
        shell.openItem(this.props.repo.folderPath)
    }

    render() {
        const classes = this.props.classes
        const version = (this.props.repo.timeline !== undefined) ? 'v' + Object.keys(this.props.repo.timeline).length : ''

        return (
            <React.Fragment>
                <OpenFolderButton folderPath={this.props.repo.folderPath} />
                <Typography variant="headline" className={classes.headline}>
                    {this.props.repo.repoID}
                </Typography>
                <Typography className={classes.version}>
                    {version}
                </Typography>
                <Sharing
                    sharedUsers={this.props.repo.sharedUsers}
                    folderPath={this.props.repo.folderPath}
                    repoID={this.props.repo.repoID}
                    addCollaborator={this.props.addCollaborator}
                />
                {this.props.repo.behindRemote &&
                    <PullButton
                        pullRepo={this.props.pullRepo}
                        folderPath={this.props.repo.folderPath}
                        repoID={this.props.repo.repoID}
                    />
                }
                {/* <Hypothesis
                    hypothesis={this.props.repo.hypothesis}
                    folderPath = {this.props.repo.folderPath}
                    addHypothesis={this.props.addHypothesis}
                /> */}
                <br/>
            </React.Fragment>
        )
    }
}

RepoInfo.propTypes = {
    repo: PropTypes.object.isRequired,
    addCollaborator: PropTypes.func.isRequired,
    pullRepo: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
}

const styles = theme => ({
    locationLink: {
        color: theme.palette.secondary.main,
        cursor: 'pointer',
    },
    headline: {
        marginRight: '8px',
        display: 'inline-block',
    },
    version: {
        display: 'inline-block',
    },
    caption: {
        fontSize: '10pt',
    },
})

export default withStyles(styles)(RepoInfo)