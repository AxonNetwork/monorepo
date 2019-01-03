import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import FeaturedRepoCard from './FeaturedRepoCard'
import EditRepoCard from './EditRepoCard'
import SeeMoreCard from './SeeMoreCard'
import AddNewCard from './AddNewCard'
import { IFeaturedRepo } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import { omitBy } from 'lodash'


@autobind
class FeaturedRepos extends React.Component<Props, State>
{
	state = {
		editMode: false,
		editing: [] as string[],
		deleted: [] as string[],
		added: [] as IFeaturedRepo[],
	}

	render() {
		const { featuredRepos, canEdit, classes } = this.props
		const { editMode, editing, deleted } = this.state

		const repos = omitBy(featuredRepos, (_, repoID: string) => {
			return (deleted.indexOf(repoID) > -1)
		})

		return (
			<Grid container spacing={40} className={classes.root}>
				<Grid item xs={12} className={classes.titleRow}>
					<Typography variant='h5'>
						See What We've Been Up To
					</Typography>
						{canEdit && !editMode &&
							<Button
								className={classes.editButton}
								onClick={this.toggleEditMode}
								color='secondary'
								variant='outlined'
							>
								Edit Featured Repos
							</Button>
						}
						{canEdit && editMode &&
							<div>
								<Button
									className={classes.editButton}
									onClick={this.saveSetup}
									color='secondary'
									variant='outlined'
								>
									Save
								</Button>
								<Button
									className={classes.editButton}
									onClick={this.cancelEdit}
									color='secondary'
									variant='outlined'
								>
									Cancel
								</Button>
							</div>
						}
				</Grid>
				{Object.keys(repos).map((repoID: string) => (
					<Grid item xs={12} sm={6}>
						{editing.indexOf(repoID) < 0 &&
							<FeaturedRepoCard
								repoInfo={repos[repoID]}
								canDelete={editMode}
								onEdit={() => this.editRepoCard(repoID)}
								onDelete={() => this.deleteRepoCard(repoID)}
							/>
						}
						{editing.indexOf(repoID) > -1 &&
							<EditRepoCard
								repoInfo={repos[repoID]}
								canDelete={editMode}
								onEdit={()=> console.log('edit')}
								onDelete={()=> console.log('delete')}
							/>
						}
					</Grid>
				))}
				<Grid item xs={12} sm={6}>
					{editMode &&
						<AddNewCard onClick={()=>console.log('clicked add')} />
					}
					{!editMode &&
						<SeeMoreCard count={10} onClick={()=>console.log('clicked see')} />
					}
				</Grid>
			</Grid>
		)
	}

	toggleEditMode() {
		this.setState({ editMode: !this.state.editMode })
	}

	cancelEdit() {
		this.setState({
			editMode: false,
			deleted: [] as string[],
			added: [] as IFeaturedRepo[],
		})
	}

	editRepoCard(repoID: string) {
		this.setState({
			editing: [
				...this.state.editing,
				repoID
			]
		})
	}

	deleteRepoCard(repoID: string) {
		this.setState({
			deleted: [
				...this.state.deleted,
				repoID
			]
		})
	}

	saveSetup() {
		console.log("SAVING")
	}
}

interface State {
	editMode: boolean
	editing: string[]
	deleted: string[]
	added: IFeaturedRepo[]
}

interface Props {
	featuredRepos: {[repoID: string]: IFeaturedRepo}
	canEdit?: boolean
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