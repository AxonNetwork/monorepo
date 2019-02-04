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
import { fetchFullRepo } from 'conscience-components/redux/repo/repoActions'
import { IGlobalState } from 'conscience-components/redux'
import { getRepoID } from 'conscience-components/env-specific'
import { URI, IRepoFile, IDiscussion } from 'conscience-lib/common'
import { autobind, uriToString } from 'conscience-lib/utils'
import isEqual from 'lodash/isEqual'


@autobind
class RepositoryCards extends React.Component<Props, State>
{
    state = {
        dialogOpen: false,
    }

    constructor(props: Props) {
        super(props)
        this.fetchAllRepos()
    }

    render() {
        const { repoList, classes } = this.props
        const notFailed = (repoList || []).filter(uri => !this.props.failedToFetchByURI[uriToString(uri)])
        const loading = repoList === undefined || notFailed.some(uri => this.props.filesByURI[uriToString(uri)] === undefined)

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

        return (
            <React.Fragment>
                <div className={classes.root}>
                    {notFailed.map(uri =>
                        <RepositoryCard
                            key={getRepoID(uri)}
                            uri={uri}
                        />
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
                                {(this.props.reposToAdd || []).map(uri => (
                                    <ListItem button onClick={() => this.onClickAddRepo(getRepoID(uri))}>
                                        <ListItemText primary={getRepoID(uri)} />
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

    componentDidUpdate(prevProps: Props) {
        if (!isEqual(this.props.repoList, prevProps.repoList)) {
            this.fetchAllRepos()
        }
    }

    fetchAllRepos() {
        const repoList = this.props.repoList
        if (repoList === undefined) {
            return
        }
        repoList.forEach(uri => this.props.fetchFullRepo({ uri }))
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

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    repoList: URI[] | undefined
    reposToAdd?: URI[]
    addRepo?: (payload: { repoID: string }) => void
}

interface StateProps {
    filesByURI: { [uri: string]: { [name: string]: IRepoFile } }
    failedToFetchByURI: { [repoID: string]: boolean }
    discussions: { [discussionID: string]: IDiscussion }
    discussionsByRepo: { [repoID: string]: string[] }
}

interface DispatchProps {
    fetchFullRepo: typeof fetchFullRepo
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

        marginLeft: theme.spacing.unit * 1.5,
        marginRight: theme.spacing.unit * 1.5,
        marginBottom: theme.spacing.unit * 3,
    },
    newRepoButton: {
        height: '100%',
        width: '100%',
        border: '1px solid',
        borderColor: theme.palette.grey[300],
    },
    repoCard: {
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
    }
})

const mapStateToProps = (state: IGlobalState) => {
    return {
        filesByURI: state.repo.filesByURI,
        failedToFetchByURI: state.repo.failedToFetchByURI,
        discussions: state.discussion.discussions,
        discussionsByRepo: state.discussion.discussionsByRepo,
    }
}

const mapDispatchToProps = {
    fetchFullRepo
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RepositoryCards))