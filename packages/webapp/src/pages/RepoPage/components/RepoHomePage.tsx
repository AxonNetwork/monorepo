import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import FileViewer from './connected/FileViewer'
import Timeline from './connected/Timeline'
import DiscussionList from './connected/DiscussionList'
import UserAvatar from 'conscience-components/UserAvatar'
import { IGlobalState } from 'redux/store'
import { IRepo, IUser } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoHomePage extends React.Component<Props>
{

	render() {
		const { repo, sharedUsers, classes } = this.props

		const readmeExists = (repo.files || {})['README.md']

		return (
			<main className={classes.main}>
				<div className={classes.readmeContainer}>
				{readmeExists &&
					<FileViewer repoID={repo.repoID} filename={'README.md'}/>
				}
				{!readmeExists &&
					<div>
						readme does not exist
					</div>
				}
				</div>
				<div className={classes.sidebarComponents}>
					<Card className={classes.card}>
						<CardContent>
							<Typography variant="h6">
								Team
							</Typography>
							<div className={classes.sharedUsersRow}>
							{sharedUsers.map((user: IUser | undefined) => {
								if(user !== undefined){
									return <UserAvatar username={user.name} userPicture={user.picture} />
								}else {
									return null
								}
							})}
							</div>
						</CardContent>
					</Card>
					<Card className={classes.card}>
						<CardContent>
							<Typography variant="h6">
								Recent Discussions
							</Typography>
							<DiscussionList
								repoID={repo.repoID}
								history={this.props.history}
								maxLength={2}
							/>
						</CardContent>
					</Card>
					<Card className={classes.card}>
						<CardContent>
							<Typography variant="h6">
								Recent Commits
							</Typography>
							<Timeline
								repoID={repo.repoID}
								history={this.props.history}
								defaultRowsPerPage={2}
								hidePagination
							/>
						</CardContent>
					</Card>
				</div>
			</main>
		)
	}
}

interface MatchParams {
	repoID: string
}

interface Props extends RouteComponentProps<MatchParams>{
	repo: IRepo
	sharedUsers: IUser[]
	classes: any
}

const styles = (theme: Theme) => createStyles({
	main: {
		display: 'flex'
	},
	readmeContainer: {
		flexGrow: 3,
		marginRight: 16,
	},
	sidebarComponents: {
		flexGrow: 1,
		marginLeft: 16,
	},
	card: {
		marginBottom: 16
	},
	sharedUsersRow: {
		display: 'flex',
		flexDirection: 'row',
		'& div': {
			marginRight: 4
		}
	},
})

const mapStateToProps = (state: IGlobalState, ownProps: RouteComponentProps<MatchParams>) => {
	const repoID = ownProps.match.params.repoID
	const repo = state.repo.repos[repoID]
	const sharedUsers = (repo.sharedUsers || []).map(id => state.user.users[id])
    return {
    	repo,
    	sharedUsers,
    }
}

const mapDispatchToProps = {}

const RepoHomePageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoHomePage))

export default RepoHomePageContainer
