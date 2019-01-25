import React from 'react'
import { connect } from 'react-redux'
import { Theme, createStyles, withStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import CommentIcon from '@material-ui/icons/Comment'
import { H6 } from 'conscience-components/Typography/Headers'
import { selectRepo } from 'conscience-components/navigation'
import { IGlobalState } from 'conscience-components/redux'
import { getRepoID } from 'conscience-components/env-specific'
import { URI, RepoPage } from 'conscience-lib/common'
import { autobind, uriToString } from 'conscience-lib/utils'
import moment from 'moment'


@autobind
class RepositoryCard extends React.Component<Props>
{
    render() {
        const { repoID, lastUpdated, numFiles, numDiscussions, classes } = this.props

        return (
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
            </Card >
        )
    }

    onClickNavigateRepoFiles(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation()
        selectRepo(this.props.uri, RepoPage.Files)
    }

    onClickNavigateRepoDiscussions(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation()
        selectRepo(this.props.uri, RepoPage.Discussion)
    }

    onClickNavigateRepoHome() {
        selectRepo(this.props.uri, RepoPage.Home)
    }
}

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    uri: URI
}

interface StateProps {
    repoID: string
    numFiles: number
    lastUpdated: Date
    numDiscussions: number
}

const styles = (theme: Theme) => createStyles({
    root: {
        flexGrow: 1,
        minWidth: 300,
        maxWidth: 350,
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
    return {
        repoID,
        numFiles,
        lastUpdated,
        numDiscussions,
    }
}

export default connect(mapStateToProps, null)(withStyles(styles)(RepositoryCard))