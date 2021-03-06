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
import Typography from '@material-ui/core/Typography'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import RepositoryCard from './RepositoryCard'
import RepoCardLoader from '../ContentLoaders/RepoCardLoader'
import { fetchRepoMetadata } from 'conscience-components/redux/repo/repoActions'
import { IGlobalState } from 'conscience-components/redux'
import { getRepoID } from 'conscience-components/env-specific'
import { IRepoMetadata, URI } from 'conscience-lib/common'
import { autobind, uriToString } from 'conscience-lib/utils'
import isEqual from 'lodash/isEqual'


@autobind
class RepositoryCards extends React.Component<Props, State>
{
    state = {
        dialogOpen: false,
    }

    render() {
        const { repoList, metadataByURI, classes } = this.props

        let loading = repoList === undefined
        let failed = [] as URI[]
        let succeeded = [] as URI[]
        if (!loading) {
            failed = (repoList || []).filter(uri => metadataByURI[uriToString(uri)] === null)
            succeeded = (repoList || []).filter(uri => !!metadataByURI[uriToString(uri)])
            loading = failed.length + succeeded.length < (repoList || []).length
        }

        if (loading) {
            return (
                <div className={classes.root}>
                    {Array(4).fill(0).map(i => (
                        <Card className={classes.repoCard}>
                            <RepoCardLoader />
                        </Card>
                    ))}
                </div>
            )
        }

        if (succeeded.length === 0) {
            return (
                <Typography className={classes.noneAvailable}>
                    No available repositories
                </Typography>
            )
        }

        return (
            <React.Fragment>
                <div className={classes.root}>
                    {succeeded.map(uri =>
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
                                {(this.props.reposToAdd || []).map(repoID => (
                                    <ListItem button onClick={() => this.onClickAddRepo(repoID)}>
                                        <ListItemText primary={repoID} />
                                    </ListItem>
                                ))}
                                <ListItem
                                    button
                                    onClick={() => this.onClickAddRepo(undefined)}
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

    componentDidMount() {
        this.fetchRepoListMetadata()
    }

    componentDidUpdate(prevProps: Props) {
        if (!isEqual(this.props.repoList, prevProps.repoList)) {
            this.fetchRepoListMetadata()
        }
    }

    fetchRepoListMetadata() {
        const repoList = this.props.repoList
        if (repoList === undefined) {
            return
        }
        this.props.fetchRepoMetadata({ repoList })
    }

    onClickAddRepo(repoID: string | undefined) {
        if (this.props.addRepo) {
            this.props.addRepo(repoID)
        }
        this.setState({ dialogOpen: false })
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
    reposToAdd?: string[]
    addRepo?: (repoID: string | undefined) => void
}

interface StateProps {
    metadataByURI: { [repoID: string]: IRepoMetadata | null }
}

interface DispatchProps {
    fetchRepoMetadata: typeof fetchRepoMetadata
}

interface State {
    dialogOpen: boolean
}

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    noneAvailable: {
        fontStyle: 'italic',
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
        metadataByURI: state.repo.metadataByURI,
    }
}

const mapDispatchToProps = {
    fetchRepoMetadata
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RepositoryCards))