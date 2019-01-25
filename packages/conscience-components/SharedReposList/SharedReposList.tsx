import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { values } from 'lodash'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import LinearProgress from '@material-ui/core/LinearProgress'
import IconButton from '@material-ui/core/IconButton'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import { H6 } from 'conscience-components/Typography/Headers'

import { pickBy } from 'lodash'
import { getRepoID } from '../env-specific'
import { cloneRepo } from '../redux/repo/repoActions'
import { IGlobalState } from '../redux'
import { ISharedRepoInfo } from 'conscience-lib/common'

class SharedReposList extends React.Component<Props>
{
    render() {
        const { sharedRepos, classes, cloneRepoProgress } = this.props
        return (
            <React.Fragment>
                <H6>Clone a repository shared with you</H6>
                <List>
                    {values(sharedRepos).map(repo => {
                        const repoProgress = cloneRepoProgress[repo.repoID]
                        const isDownloading = repoProgress !== undefined
                        let percentDownloaded
                        if (isDownloading) {
                            percentDownloaded = Math.floor(100 * (repoProgress || { fetched: 0 }).fetched / (repoProgress || { toFetch: 1 }).toFetch)
                        }
                        return (
                            <ListItem key={repo.repoID}>
                                <ListItemText primary={repo.repoID} classes={{ primary: classes.text }} />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() => this.props.cloneRepo({ repoID: repo.repoID })} >
                                        <ControlPointIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                                {isDownloading &&
                                    <div className={classes.progressBar}>
                                        <LinearProgress color="secondary" variant="determinate" value={percentDownloaded} />
                                    </div>
                                }
                            </ListItem>
                        )
                    })}
                </List>
            </React.Fragment>
        )
    }
}

interface Props {
    sharedRepos: { [repoID: string]: ISharedRepoInfo }
    cloneRepoProgress: {
        [repoID: string]: {
            fetched: number,
            toFetch: number
        } | undefined
    }
    cloneRepo: typeof cloneRepo

    classes?: any
}

const styles = (theme: Theme) => createStyles({
    text: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    buttonLoading: {
        color: theme.palette.secondary.main,
        margin: 12,
    },
    progressBar: {
        position: 'absolute',
        left: 24,
        right: 64,
        bottom: 4,
    }
})

const mapStateToProps = (state: IGlobalState) => {
    const sharedRepos = state.user.sharedRepos || {}
    // const username = (state.user.users[state.user.currentUser || ''] || {}).username || ''
    const localRepos = state.repo.localRepoList.map(uri => getRepoID(uri))
    const filteredSharedRepos = pickBy(
        sharedRepos,
        r => localRepos.indexOf(r.repoID) < 0,
    )
    const cloneRepoProgress = state.ui.cloneRepoProgress

    return {
        sharedRepos: filteredSharedRepos,
        cloneRepoProgress,
    }
}

const mapDispatchToProps = {
    cloneRepo,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(SharedReposList))
