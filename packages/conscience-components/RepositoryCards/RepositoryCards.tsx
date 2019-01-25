import React from 'react'
import { connect } from 'react-redux'
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
import { IGlobalState } from 'conscience-components/redux'
import { getRepoID } from 'conscience-components/env-specific'
import { URI, IRepo, IRepoFile, IDiscussion } from 'conscience-lib/common'
import { autobind, uriToString } from 'conscience-lib/utils'


@autobind
class RepositoryCards extends React.Component<Props, State>
{
    state = {
        dialogOpen: false,
    }

    render() {
        const { classes } = this.props
        const loading = this.props.repoList === undefined ||
            this.props.repoList.some(uri => this.props.filesByURI[uriToString(uri)] === undefined)

        if (loading) {
            const loaderLength = this.props.repoList !== undefined ? this.props.repoList.length : 4
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

        // const repoList = (this.props.repoList || []).filter(repoID => repos[repoID] !== undefined)

        let reposToAdd = [] as string[]
        // if (this.state.dialogOpen) {
        //     reposToAdd = Object.keys(repos)
        //         // repo is not already part of org
        //         .filter(key => (repoList || []).indexOf(repos[key].repoID) < 0)
        //         .map(key => repos[key].repoID)
        // }

        return (
            <React.Fragment>
                <div className={classes.root}>
                    {(this.props.repoList || []).map(uri =>
                        <RepositoryCard key={getRepoID(uri)} uri={uri} />
                    )}

                    {/* Add repo button */}
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

                {/* Add repo modal */}
                {this.props.addRepo !== undefined &&
                    <Dialog
                        open={this.state.dialogOpen}
                        onClose={this.onDialogClose}
                    >
                        <DialogTitle>Add Repo To Organization</DialogTitle>
                        <DialogContent>
                            <List>
                                {reposToAdd.map(repoID => (
                                    <ListItem button onClick={() => this.onClickAddRepo(repoID)}>
                                        <ListItemText primary={repoID} />
                                    </ListItem>
                                ))}
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
        // @@TODO: navigate to /new-repo/:orgID
        throw new Error('@@TODO: navigate to /new-repo/:orgID')
    }

    onClickOpenDialog() {
        this.setState({ dialogOpen: true })
    }

    onDialogClose() {
        this.setState({ dialogOpen: false })
    }
}

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    repoList: URI[] | undefined
    addRepo?: (payload: { repoID: string }) => void
}

interface StateProps {
    repos: { [repoID: string]: IRepo }
    filesByURI: { [uri: string]: { [name: string]: IRepoFile } }
    discussions: { [discussionID: string]: IDiscussion }
    discussionsByRepo: { [repoID: string]: string[] }
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

const mapStateToProps = (state: IGlobalState) => {
    return {
        filesByURI: state.repo.filesByURI,
        discussions: state.discussion.discussions,
        discussionsByRepo: state.discussion.discussionsByRepo,
    }
}

export default connect(mapStateToProps, null)(withStyles(styles)(RepositoryCards))