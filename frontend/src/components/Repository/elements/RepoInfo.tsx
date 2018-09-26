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

export interface RepoInfoProps {
    repo: IRepo
    addCollaborator: Function
    pullRepo: Function
    classes:{
        locationLink: string
        headline: string
        version: string
        caption: string
    }
}

function RepoInfo(props: RepoInfoProps)
{
    const { repo, addCollaborator, pullRepo, classes } = props
    const version = (repo.timeline !== undefined) ? 'v' + Object.keys(repo.timeline).length : ''

    return (
        <React.Fragment>
            <OpenFolderButton folderPath={repo.folderPath} />
            <Typography variant="headline" className={classes.headline}>
                {repo.repoID}
            </Typography>
            <Typography className={classes.version}>
                {version}
            </Typography>
            <Sharing
                sharedUsers={repo.sharedUsers || []}
                folderPath={repo.folderPath}
                repoID={repo.repoID}
                addCollaborator={addCollaborator}
            />
            {repo.behindRemote &&
                <PullButton
                    pullRepo={pullRepo}
                    folderPath={repo.folderPath}
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
    },
    version: {
        display: 'inline-block',
    },
    caption: {
        fontSize: '10pt',
    },
})

const mapStateToProps=(state: IGlobalState) =>{
    const selected = state.repository.selectedRepo || ""
    const repo = state.repository.repos[selected]
    return {
        repo: repo
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