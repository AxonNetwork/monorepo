import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import FeaturedRepoCard from './FeaturedRepoCard'
import EditRepoCard from './EditRepoCard'
import AddNewCard from './AddNewCard'
import SelectRepoDialog from './SelectRepoDialog'
import { IRepo, IFeaturedRepo } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import { omitBy } from 'lodash'


@autobind
class FeaturedRepos extends React.Component<Props, State>
{
    state = {
        editMode: false,
        featuredRepos: {} as { [repoID: string]: IFeaturedRepo },
        editing: [] as string[],
        dialogOpen: false,
    }

    render() {
        const { canEdit, classes } = this.props
        const { editMode, featuredRepos, editing } = this.state

        const reposToAdd = this.props.orgRepoList.filter(repoID => featuredRepos[repoID] === undefined)

        return (
            <Grid container spacing={40} className={classes.root}>
                <Grid item xs={12} className={classes.titleRow}>
                    <Typography variant="h5">Featured Research</Typography>
                    {canEdit && !editMode &&
                        <Button
                            className={classes.editButton}
                            onClick={this.enterEditMode}
                            color="secondary"
                            variant="outlined"
                        >
                            Edit Featured Repos
                        </Button>
                    }
                    {canEdit && editMode &&
                        <div>
                            <Button
                                className={classes.editButton}
                                onClick={this.saveSetup}
                                color="secondary"
                                variant="outlined"
                            >
                                Save
                            </Button>
                            <Button
                                className={classes.editButton}
                                onClick={this.cancelEdit}
                                color="secondary"
                                variant="outlined"
                            >
                                Cancel
                            </Button>
                        </div>
                    }
                </Grid>
                {Object.keys(featuredRepos).length < 1 &&
                    <Typography>
                        No featured studies at the moment
                    </Typography>
                }
                {Object.keys(featuredRepos).map((repoID: string) => (
                    <Grid item xs={12} sm={6}>
                        {editing.indexOf(repoID) < 0 &&
                            <FeaturedRepoCard
                                repoInfo={featuredRepos[repoID]}
                                canEdit={editMode}
                                onEdit={() => this.editRepoCard(repoID)}
                                onDelete={() => this.deleteRepoCard(repoID)}
                                selectRepo={this.props.selectRepo}
                            />
                        }
                        {editing.indexOf(repoID) > -1 &&
                            <EditRepoCard
                                repoInfo={featuredRepos[repoID]}
                                repo={this.props.repos[repoID]}
                                onSave={this.saveRepoCard}
                                onCancel={() => this.cancelEditRepoCard(repoID)}
                            />
                        }
                    </Grid>
                ))}
                {editMode && Object.keys(featuredRepos).length < 4 &&
                    <Grid item xs={12} sm={6}>
                        <AddNewCard onClick={this.openAddRepoDialog} />
                    </Grid>
                }
                <SelectRepoDialog
                    open={this.state.dialogOpen}
                    repoList={reposToAdd}
                    onSelect={this.addRepoCard}
                />
            </Grid>
        )
    }

    componentDidMount() {
        const featuredRepos = this.props.featuredRepos
        this.setState({ featuredRepos })
    }

    enterEditMode() {
        this.setState({ editMode: true })
    }

    cancelEdit() {
        this.setState({
            editMode: false,
            featuredRepos: this.props.featuredRepos,
        })
    }

    editRepoCard(repoID: string) {
        this.setState({
            editing: [
                ...this.state.editing,
                repoID,
            ],
        })
    }

    cancelEditRepoCard(repoID: string) {
        const updated = this.state.editing.filter(id => id !== repoID)
        this.setState({ editing: updated })
    }

    openAddRepoDialog() {
        this.setState({ dialogOpen: true })
    }

    addRepoCard(repoID: string) {
        this.setState({ dialogOpen: false })
        if (!repoID || repoID.length === 0) {
            return
        }
        this.setState({
            featuredRepos: {
                ...this.state.featuredRepos,
                [repoID]: {
                    repoID: repoID,
                    title: repoID,
                    description: 'Add a description',
                },
            },
            editing: [
                ...this.state.editing,
                repoID,
            ],
        })
    }

    saveRepoCard(info: IFeaturedRepo) {
        const featuredRepos = {
            ...this.state.featuredRepos,
            [info.repoID]: info,
        }
        this.setState({ featuredRepos })
        this.cancelEditRepoCard(info.repoID)
    }

    deleteRepoCard(repoID: string) {
        const featuredRepos = omitBy(this.state.featuredRepos, (_, key) => {
            return key === repoID
        })
        this.setState({ featuredRepos })
    }

    saveSetup() {
        this.setState({ editMode: false })
        this.props.onSave(this.state.featuredRepos)
    }
}

interface State {
    editMode: boolean
    featuredRepos: { [repoID: string]: IFeaturedRepo }
    editing: string[]
    dialogOpen: boolean
}

interface Props {
    featuredRepos: { [repoID: string]: IFeaturedRepo }
    repos: { [repoID: string]: IRepo }
    orgRepoList: string[]
    canEdit?: boolean
    onSave: (featuredRepos: { [repoID: string]: IFeaturedRepo }) => void
    selectRepo: (payload: { repoID: string }) => void
    classes: any
}

const styles = (theme: Theme) => createStyles({
    root: {
        marginTop: 8,
    },
    titleRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    editButton: {
        marginLeft: 16,
        textTransform: 'none',
    },
})

export default withStyles(styles)(FeaturedRepos)