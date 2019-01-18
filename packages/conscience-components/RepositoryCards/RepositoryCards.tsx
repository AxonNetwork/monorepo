import React from 'react'
import { Theme, createStyles, withStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import RepositoryCard from './RepositoryCard'
import RepoCardLoader from '../ContentLoaders/RepoCardLoader'
import { IRepo, IDiscussion, RepoPage } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class Repositories extends React.Component<Props, State>
{
    state = {
        dialogOpen: false,
    }

    render() {
        const { repos, repoList, discussionsByRepo, classes } = this.props
        const loading = repoList === undefined || repoList.some(id => (repos[id] || {}).files === undefined)

        if (loading) {
            const loaderLength = repoList !== undefined ? repoList.length : 4
            return (
                <div className={classes.root}>
                    {Array(loaderLength).fill(0).map(i => (
                        <Card className={classes.repoCard}>
                            <RepoCardLoader />
                        </Card>
                    ))}
                </div>
            )
        }

        let reposToAdd = [] as string[]
        if (this.state.dialogOpen) {
            reposToAdd = Object.keys(repos)
                // repo is not already part of org
                .filter((key: string) => (repoList || []).indexOf(repos[key].repoID) < 0)
                .map((key: string) => repos[key].repoID)
        }

        return (
            <React.Fragment>
                <div className={classes.root}>
                    {(repoList || []).map(id =>
                        <RepositoryCard
                            repo={repos[id]}
                            numDiscussions={(discussionsByRepo[id] || []).length}
                            selectRepoAndPage={this.props.selectRepoAndPage}
                            key={id}
                        />,
                    )}
                    {this.props.addRepo !== undefined &&
                        <Card className={classes.newRepoCard}>
                            <Button
                                color="secondary"
                                className={classes.newRepoButton}
                                onClick={this.onClickOpenDialog}
                            >
                                <ControlPointIcon />
                            </Button>
                        </Card>
                    }
                </div>
                {this.props.addRepo !== undefined &&
                    <Dialog
                        open={this.state.dialogOpen}
                        onClose={this.onDialogClose}
                    >
                        <DialogTitle>Add Repo To Organization</DialogTitle>
                        <DialogContent>
                            <List>
                                {reposToAdd.map((repoID: string) => {
                                    return (
                                        <ListItem
                                            button
                                            onClick={() => this.onClickAddRepo(repoID)}
                                        >
                                            <ListItemText primary={repoID} />
                                        </ListItem>
                                    )
                                })}
                                <ListItem
                                    button
                                    onClick={this.onClickNewRepo}
                                >
                                    <ListItemText primary="New Repository" />
                                    <ListItemIcon className={classes.listIcon}>
                                        <ControlPointIcon fontSize="small" />
                                    </ListItemIcon>
                                </ListItem>
                            </List>
                        </DialogContent>
                    </Dialog>
                }
            </React.Fragment>
        )
    }

    onClickAddRepo(repoID: string) {
        if (this.props.addRepo) {
            this.props.addRepo({ repoID })
        }
        this.setState({ dialogOpen: false })
    }

    onClickNewRepo() {
        this.props.selectRepoAndPage({ repoPage: RepoPage.New })
    }

    onClickOpenDialog() {
        this.setState({ dialogOpen: true })
    }

    onDialogClose() {
        this.setState({ dialogOpen: false })
    }
}

interface Props {
    repoList: string[] | undefined
    repos: { [repoID: string]: IRepo }
    discussions: { [discussionID: string]: IDiscussion }
    discussionsByRepo: { [repoID: string]: string[] }
    selectRepoAndPage: (payload: { repoID?: string, repoRoot?: string | undefined, repoPage: RepoPage }) => void
    addRepo?: (payload: { repoID: string }) => void
    classes: any
}

interface State {
    dialogOpen: boolean
}

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    newRepoCard: {
        padding: 0,
        width: 100,
        marginBottom: 24,
    },
    newRepoButton: {
        height: '100%',
        width: '100%',
        border: '1px solid',
        borderColor: theme.palette.grey[300],
    },
    repoCard: {
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
    }
})

export default withStyles(styles)(Repositories)