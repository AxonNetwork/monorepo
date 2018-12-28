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
import LinearProgress from '@material-ui/core/LinearProgress'

import { pickBy } from 'lodash'
import { cloneRepo } from 'redux/repository/repoActions'
import { unshareRepoFromSelf } from 'redux/user/userActions'
import { ISharedRepoInfo } from 'common'
import { IGlobalState } from 'redux/store'

class SharedRepos extends React.Component<Props>
{
    render() {
        const { sharedRepos, classes, cloneRepoProgress } = this.props
        return (
            <React.Fragment>
                <Typography variant="headline">
                    Repos Shared with You
                </Typography>
                <List>
                    {
                        values(sharedRepos).map(repo => {
                            const repoProgress = cloneRepoProgress[repo.repoID] || { fetched: 0, toFetch: 1}
                            const isDownloading = repoProgress !== undefined
                            let percentDownloaded
                            if(isDownloading){
                                percentDownloaded = Math.floor(100*(repoProgress.fetched)/(repoProgress.toFetch))
                            }
                            return(
                                <React.Fragment>
                                    <ListItem key={repo.repoID}>
                                        <ListItemText primary={repo.repoID} />
                                        <ListItemSecondaryAction>
                                            <IconButton onClick={() => this.props.cloneRepo({ repoID: repo.repoID })}>
                                                <ControlPointIcon />
                                            </IconButton>

                                           {/*<IconButton onClick={() => this.props.unshareRepoFromSelf({ repoID: repo.repoID })}>
                                                <CancelIcon />
                                            </IconButton>*/}
                                        </ListItemSecondaryAction>
                                        {isDownloading &&
                                            <div className={classes.progressBar}>
                                                <LinearProgress color="secondary" variant="determinate" value={percentDownloaded} />
                                            </div>
                                        }
                                    </ListItem>
                                </React.Fragment>
                            )
                        })
                    }
                </List>
            </React.Fragment>
        )
    }
}

interface Props {
    sharedRepos: {[repoID: string]: ISharedRepoInfo}
    cloneRepoProgress: {
        [repoID: string]:{
            fetched: number,
            toFetch: number
        } | undefined
    }
    cloneRepo: typeof cloneRepo
    unshareRepoFromSelf: typeof unshareRepoFromSelf

    classes?: any
}

const styles = (theme: Theme) => createStyles({
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
    const repos = state.repository.repos
    const repoList = Object.keys(repos).map(r => repos[r].repoID)
    const filteredSharedRepos = pickBy(
        sharedRepos,
        r => repoList.indexOf(r.repoID) < 0,
    )
    const cloneRepoProgress = state.ui.cloneRepoProgress

    const userID = state.user.currentUser
    return {
        sharedRepos: filteredSharedRepos,
        userID,
        cloneRepoProgress,
    }
}

const mapDispatchToProps = {
    cloneRepo,
    unshareRepoFromSelf,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(SharedRepos))
