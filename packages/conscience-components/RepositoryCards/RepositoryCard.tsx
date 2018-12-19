import React from 'react'
import { Theme, createStyles, withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import CommentIcon from '@material-ui/icons/Comment'
import { IRepo, RepoPage } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import moment from 'moment'


@autobind
class RepositoryCard extends React.Component<Props>
{
    render() {
        const { repo, numDiscussions, classes } = this.props
        if (!repo) {
            return null
        }
        const numFiles = Object.keys(repo.files || {}).length
        const lastCommitHash = repo.commitList ? repo.commitList[0] : ''
        const lastCommit = (repo.commits || {})[lastCommitHash || ''] || {}
        const lastUpdated = lastCommit.time

        return(
            <Card
                className={classes.root}
                onClick={this.onClickNavigateRepoHome}
            >
                <CardContent>
                    <Typography variant="h6">{repo.repoID}</Typography>
                    {lastUpdated &&
                        <Typography className={classes.lastUpdated}>
                            {'Last updated ' + moment(lastUpdated).fromNow()}
                        </Typography>
                    }
                    {!lastUpdated &&
                        <Typography className={classes.lastUpdated}>
                            No commits yet
                        </Typography>
                    }
                    <div className={classes.statButtons}>
                        <Button
                            onClick={this.onClickNavigateRepoFiles}
                        >
                            <FolderOpenIcon fontSize="small" />
                            {numFiles}
                        </Button>
                        <Button
                            onClick={this.onClickNavigateRepoDiscussions}
                        >
                            <CommentIcon fontSize="small"/>
                            {numDiscussions}
                        </Button>
                    </div>
                </CardContent>
            </Card >
        )
    }

    onClickNavigateRepoFiles(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation()
        this.selectRepoAndPage(RepoPage.Files)
    }

    onClickNavigateRepoDiscussions(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation()
        this.selectRepoAndPage(RepoPage.Discussion)
    }

    onClickNavigateRepoHome() {
        this.selectRepoAndPage(RepoPage.Home)
    }

    selectRepoAndPage(repoPage: RepoPage) {
        const repoID = this.props.repo.repoID
        const repoRoot = this.props.repo.path
        this.props.selectRepoAndPage({ repoID, repoRoot, repoPage })
    }
}

interface Props {
    repo: IRepo
    numDiscussions: number
    selectRepoAndPage: (payload: { repoID: string, repoRoot?: string | undefined, repoPage: RepoPage }) => void
    classes: any
}

const styles = (theme: Theme) => createStyles({
    root: {
        minWidth: 250,
        maxWidth: 350,
        padding: theme.spacing.unit,
        border: '1px solid',
        borderColor: theme.palette.grey[300],
        borderRadius: 5,
        marginRight: theme.spacing.unit * 3,
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
    },
})

export default withStyles(styles)(RepositoryCard)