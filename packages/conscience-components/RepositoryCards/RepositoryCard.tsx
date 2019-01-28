import React from 'react'
import { connect } from 'react-redux'
import { Theme, createStyles, withStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import LinearProgress from '@material-ui/core/LinearProgress'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import CommentIcon from '@material-ui/icons/Comment'
import { H6 } from 'conscience-components/Typography/Headers'
import { selectRepo, getRepoURL } from 'conscience-components/navigation'
import { cloneRepo } from 'conscience-components/redux/repo/repoActions'
import { IGlobalState } from 'conscience-components/redux'
import { getRepoID } from 'conscience-components/env-specific'
import { URI, URIType, LocalURI, RepoPage } from 'conscience-lib/common'
import { autobind, uriToString } from 'conscience-lib/utils'
import moment from 'moment'


@autobind
class RepositoryCard extends React.Component<Props, State>
{
    state = {
        dialogOpen: false
    }

    render() {
        const { repoID, lastUpdated, numFiles, numDiscussions, cloneProgress, classes } = this.props
        const isDownloading = cloneProgress !== undefined
        let percentDownloaded
        if (isDownloading) {
            percentDownloaded = Math.floor(100 * (cloneProgress || { fetched: 0 }).fetched / (cloneProgress || { toFetch: 1 }).toFetch)
        }

        return (
            <div>
                <Card className={classes.root} onClick={this.onClickNavigateRepoHome}>
                    <CardContent>
                        <H6>{repoID}</H6>
                        {lastUpdated &&
                            <div className={classes.lastUpdated}>
                                {'Last updated ' + moment(lastUpdated).fromNow()}
                            </div>
                        }
                        {!lastUpdated &&
                            <div className={classes.lastUpdated}>
                                No commits yet
                            </div>
                        }
                        <div className={classes.statButtons}>
                            <Button onClick={this.onClickNavigateRepoFiles}>
                                <FolderOpenIcon fontSize="small" />
                                {numFiles}
                            </Button>
                            <Button onClick={this.onClickNavigateRepoDiscussions}>
                                <CommentIcon fontSize="small" />
                                {numDiscussions}
                            </Button>
                        </div>
                    </CardContent>
                    {isDownloading &&
                        <LinearProgress
                            color="secondary"
                            variant="determinate"
                            value={percentDownloaded}
                            className={classes.progressBar}
                        />
                    }
                </Card >
                <Dialog open={this.state.dialogOpen} onClose={this.toggleDialog}>
                    <DialogTitle>No Local Repo</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Looks like you don't have this repository downloaded to your computer.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={this.openInWeb}
                            color="secondary"
                            variant="contained"
                            autoFocus
                        >
                            Open in Web
                        </Button>
                        <Button
                            onClick={this.cloneRepo}
                            color="secondary"
                            variant="outlined"
                        >
                            Download
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    openInWeb() {
        const shell = (window as any).require('electron').shell
        const repoURL = process.env.WEBAPP_URL + getRepoURL(this.props.uri, RepoPage.Home)
        shell.openExternal(repoURL)
    }

    cloneRepo() {
        if (this.props.uri.type === URIType.Network) {
            this.props.cloneRepo({ uri: this.props.uri })
        }
    }

    toggleDialog() {
        this.setState({ dialogOpen: !this.state.dialogOpen })
    }

    navigateOrRedirectTo(page: RepoPage) {
        if (!this.props.redirectToLocal) {
            selectRepo(this.props.uri, page)
        } else {
            const local = this.props.localRepoList.find(uri => getRepoID(uri) === getRepoID(this.props.uri))
            if (local !== undefined) {
                selectRepo(local, page)
            } else {
                this.toggleDialog()
            }
        }
    }

    onClickNavigateRepoFiles(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation()
        this.navigateOrRedirectTo(RepoPage.Files)
    }

    onClickNavigateRepoDiscussions(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation()
        this.navigateOrRedirectTo(RepoPage.Discussion)
    }

    onClickNavigateRepoHome() {
        this.navigateOrRedirectTo(RepoPage.Home)
    }
}

interface State {
    dialogOpen: boolean
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    uri: URI
    redirectToLocal?: boolean
}

interface StateProps {
    repoID: string
    numFiles: number
    lastUpdated: Date
    numDiscussions: number
    localRepoList: LocalURI[]
    cloneProgress: { fetched: number, toFetch: number } | undefined
}

interface DispatchProps {
    cloneRepo: typeof cloneRepo
}

const styles = (theme: Theme) => createStyles({
    root: {
        position: 'relative',
        flexGrow: 1,
        width: 300,
        maxWidth: 300,
        padding: theme.spacing.unit,
        border: '1px solid',
        borderColor: theme.palette.grey[300],
        borderRadius: 5,
        marginLeft: theme.spacing.unit * 1.5,
        marginRight: theme.spacing.unit * 1.5,
        marginBottom: theme.spacing.unit * 3,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.grey[100],
        },
    },
    lastUpdated: {
        fontStyle: 'italic',
    },
    statButtons: {
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '32px -20px -24px',
        "& svg": {
            marginRight: 4
        }
    },
    progressBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    }
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const uri = ownProps.uri
    const uriStr = uriToString(uri)
    const repoID = getRepoID(uri)
    const numFiles = Object.keys(state.repo.filesByURI[uriStr] || {}).length
    const commitList = state.repo.commitListsByURI[uriStr]
    const lastCommitHash = commitList !== undefined ? commitList[0] : ''
    const lastCommit = state.repo.commits[lastCommitHash || ''] || {}
    const lastUpdated = lastCommit.time
    const numDiscussions = (state.discussion.discussionsByRepo[repoID] || {}).length
    const cloneProgress = state.ui.cloneRepoProgressByID[repoID]
    return {
        repoID,
        numFiles,
        lastUpdated,
        numDiscussions,
        localRepoList: state.repo.localRepoList,
        cloneProgress,
    }
}

const mapDispatchToProps = {
    cloneRepo
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RepositoryCard))