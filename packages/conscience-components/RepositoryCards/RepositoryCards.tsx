import React from 'react'
import { Theme, createStyles, withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
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
import { IRepo, IDiscussion, IOrganization, RepoPage } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class Repositories extends React.Component<Props, State>
{
    state = {
        dialogOpen: false,
    }

    render() {
        const { repos, org, discussionsByRepo, classes } = this.props
        let reposToAdd = [] as string[]
        if(this.state.dialogOpen){
            reposToAdd = Object.keys(repos)
            // repo is not already part of org
            .filter((key: string) => org.repos.indexOf(repos[key].repoID) < 0)
            .map((key: string) => repos[key].repoID)
        }
        
        return(
            <React.Fragment>
                <div className={classes.root}>
                    <div className={classes.header}>
                        <Typography variant="h6">Repositories</Typography>
                    </div>
                    <div className={classes.repoCards}>
                        {org.repos.map(id =>
                            <RepositoryCard
                                repo={repos[id]}
                                numDiscussions={(discussionsByRepo[id] || []).length}
                                selectRepoAndPage={this.props.selectRepoAndPage}
                            />,
                        )}
                        <Card className={classes.newRepoCard}>
                            <Button
                                color="secondary"
                                className={classes.newRepoButton}
                                onClick={this.onClickOpenDialog}
                            >
                                <ControlPointIcon />
                            </Button>
                        </Card>
                    </div>
                </div>
                <Dialog
                    open={this.state.dialogOpen}
                    onClose={this.onDialogClose}
                >
                    <DialogTitle>Add Repo To Organization</DialogTitle>
                    <DialogContent>
                        <List>
                            {reposToAdd.map((repoID: string) => {
                                return(
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
                                    <ControlPointIcon fontSize="small"/>
                                </ListItemIcon>
                            </ListItem>
                        </List>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        )
    }

    onClickAddRepo(repoID: string) {
        const orgID = this.props.org.orgID
        this.props.addRepoToOrg({ orgID, repoID })
        this.setState({ dialogOpen: false})
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
    org: IOrganization
    repos: {[repoID: string]: IRepo}
    discussions: {[discussionID: string]: IDiscussion}
    discussionsByRepo: { [repoID: string]: string[] }
    addRepoToOrg: (payload: { orgID: string, repoID: string }) => void
    selectRepoAndPage: (payload: { repoID?: string, repoRoot?: string | undefined, repoPage: RepoPage }) => void
    classes: any
}

interface State {
    dialogOpen: boolean
}

const styles = (theme: Theme) => createStyles({
    root: {}, // pass through styles
    header: {
        display: 'flex',
        marginBottom: theme.spacing.unit * 2,
    },
    repoCards: {
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
})

export default withStyles(styles)(Repositories)