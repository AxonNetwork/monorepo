import React from 'react'
import { connect } from 'react-redux'
import { Theme, createStyles, withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import CommentIcon from '@material-ui/icons/Comment'
import { navigateRepoPage, selectRepo } from 'redux/repository/repoActions'
import { RepoPage } from 'redux/repository/repoReducer'
import { IGlobalState } from 'redux/store'
import { IRepo } from 'common'
import moment from 'moment'
import autobind from 'utils/autobind'


@autobind
class Repositories extends React.Component<Props>
{
    render(){
        const { repo, numDiscussions, classes } = this.props
        if(!repo){
            return null
        }
        const numFiles = Object.keys(repo.files || {}).length
        const lastCommitHash = repo.commitList ? repo.commitList[0] : ""
        const lastCommit = (repo.commits || {})[lastCommitHash || ""] || {}
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
                            {"Last updated " + moment(lastUpdated).fromNow()}
                        </Typography>
                    }
                    {!lastUpdated &&
                        <Typography className={classes.lastUpdated}>
                            No commits yet
                        </Typography>
                    }
                    <div className={classes.statButtons}>
                        <Button
                            color="secondary"
                            onClick={this.onClickNavigateRepoFiles}
                        >
                            <FolderOpenIcon fontSize="small" />
                            {numFiles}
                        </Button>
                        <Button
                            color="secondary"
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
        this.props.navigateRepoPage({ repoPage: RepoPage.Files })
        this.selectRepo()
    }

    onClickNavigateRepoDiscussions(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation()
        this.props.navigateRepoPage({ repoPage: RepoPage.Discussion })
        this.selectRepo()
    }

    onClickNavigateRepoHome() {
        this.props.navigateRepoPage({ repoPage: RepoPage.Home })
        this.selectRepo()
    }

    selectRepo() {
        this.props.selectRepo({
            repoID: this.props.repo.repoID,
            path: this.props.repo.path,
        })
    }
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    repoID: string
}

interface StateProps {
    repo: IRepo
    numDiscussions: number
}

interface DispatchProps {
    selectRepo: typeof selectRepo
    navigateRepoPage: typeof navigateRepoPage
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
        cursor: 'pointer',
        '&:hover':{
            backgroundColor: theme.palette.grey[100]
        }
    },
    lastUpdated: {
        fontStyle: 'italic'
    },
    statButtons: {
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '32px -20px -24px'
    }
})

const mapStateToProps = (state: IGlobalState, props: OwnProps) => {
    const repos = state.repository.repos
    const repoPath = Object.keys(repos).find((path: string) => (
        repos[path].repoID === props.repoID
    ))
    const repo = repos[repoPath || ""]
    const numDiscussions = (state.discussion.discussionsByRepo[props.repoID] || []).length
    return {
        repo,
        numDiscussions,
    }
}

const mapDispatchToProps = {
    selectRepo,
    navigateRepoPage,
}

export default connect< StateProps, DispatchProps, OwnProps, IGlobalState >(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(Repositories))