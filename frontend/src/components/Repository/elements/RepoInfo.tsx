import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import OpenFolderButton from './RepoInfo/OpenFolderButton'
import Sharing from './RepoInfo/Sharing'
import PullButton from './RepoInfo/PullButton'
import { IRepo } from '../../../common'

import { IGlobalState } from '../../../redux/store'
import { pullRepo, addCollaborator } from '../../../redux/repository/repoActions'

function RepoInfo(props: {
    repo: IRepo|undefined
    addCollaborator: Function
    pullRepo: Function
    classes: any
})
{
    const { repo, addCollaborator, pullRepo, classes } = props
    if (repo === undefined){
        return null
    }
    const version = (repo.timeline !== undefined) ? 'v' + Object.keys(repo.timeline).length : ''
    return (
        <React.Fragment>
            <OpenFolderButton folderPath={repo.path} />
            <Typography variant="headline" className={classes.headline}>
                {repo.repoID}
            </Typography>
            <Typography className={classes.version}>
                {version}
            </Typography>
            <Sharing
                sharedUsers={repo.sharedUsers || []}
                folderPath={repo.path}
                repoID={repo.repoID}
                addCollaborator={addCollaborator}
            />
            {/* @@TODO: behindRemote doesn't exist */
                (repo as any).behindRemote &&
                <PullButton
                    pullRepo={pullRepo}
                    folderPath={repo.path}
                    repoID={repo.repoID}
                />
            }
        </React.Fragment>
    )
}

const styles = (theme: Theme) => createStyles({
    locationLink: {
        color: theme.palette.secondary.main,
        cursor: 'pointer',
    },
    headline: {
        marginRight: '8px',
        display: 'inline-block',
        fontSize: '2rem',
        color: 'rgba(0, 0, 0, 0.7)',
    },
    version: {
        display: 'inline-block',
    },
    caption: {
        fontSize: '10pt',
    },
})

const mapStateToProps=(state: IGlobalState) => {
    const selected = state.repository.selectedRepo || ''
    const repo = state.repository.repos[selected]
    return {
        repo,
    }
}

const mapDispatchToProps = {
    pullRepo,
    addCollaborator,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(RepoInfo))