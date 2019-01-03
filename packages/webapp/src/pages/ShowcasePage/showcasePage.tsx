import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import PeopleIcon from '@material-ui/icons/People'
import DescriptionIcon from '@material-ui/icons/Description'
import AssessmentIcon from '@material-ui/icons/Assessment'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import { Parallax } from 'react-parallax'
import Container from './components/Container'
import FeaturedRepos from './components/FeaturedRepos'
import DummyEvent from './components/DummyEvent'
import { getRepoList } from 'redux/repo/repoActions'
import { fetchOrgInfo } from 'redux/org/orgActions'
import { IGlobalState } from 'redux/store'
import { IOrganization, IRepo, IUser, IDiscussion } from 'conscience-lib/common'
import researchdata from './researchdata'
import timelinedata from './timelinedata'
import pluralize from 'pluralize'


class ShowcasePage extends React.Component<Props>
{
	render() {
		const { org, users, repos, classes } = this.props
		if(org === undefined) {
			return (
				<div className={classes.progressContainer}>
					<CircularProgress color="secondary" />
				</div>
			)
		}
		const memberCount =org.members.length
		const activeRepoCount = org.repos.length
		const publicRepoCount = org.repos.filter(id => (repos[id] || {}).isPublic).length

		return (
			<div>
				<Parallax
					bgImage={org.banner}
					strength={500}
					renderLayer={(percentage: any) => (
						<div className={classes.titleContainer}>
							<div
								className={classes.title}
								style={{
									bottom: (1-percentage) * 700,
								}}
							>
								<Typography variant='h2'
									style={{
										color: `rgba(0, 0, 0, ${1.5 - percentage})`,
										backgroundColor: `rgba(255, 255, 255, ${1.5 - percentage})`,
										boxShadow: `0 0 5px 5px rgba(255, 255, 255, ${1.5 - percentage})`,
									}}
								>
									{org.name}
								</Typography>
							</div>
						</div>
					)}
				/>
				<Container>
					<div className={classes.statsContainer}>
						<Typography className={classes.stats}>
							<PeopleIcon />
							{memberCount} {pluralize('Researcher', memberCount)}
						</Typography>
						<Typography className={classes.stats}>
							<DescriptionIcon />
							{publicRepoCount} Published {pluralize('Study', publicRepoCount)}
						</Typography>
						<Typography className={classes.stats}>
							<AssessmentIcon />
							{activeRepoCount} Active {pluralize('Repository', activeRepoCount)}
						</Typography>
					</div>
					<Grid container spacing={40} >
						<Grid item xs={12} sm={8}>
							<FeaturedRepos
								featuredRepos={researchdata}
								repos={repos}
								orgRepoList={org.repos}
								canEdit
							/>
						</Grid>
						<Grid item xs={false} sm={4}>
							<Typography variant='h5'>
								Live Updates
							</Typography>
							<Typography>
								<em>From researchers who are doing their work in the open</em>
							</Typography>
							<Divider />
							{timelinedata.map(event => (
								<DummyEvent event={event} />
							))}

						</Grid>
					</Grid>
					<Typography variant='h5' className={classes.teamHeader}>
						Meet Our Researchers
					</Typography>
					<div className={classes.team}>
						{org.members.map(id=>{
							const user = users[id] || {}
							return (
								<div className={classes.teamProfile}>
									<img src={user.picture} />
									<Typography>
										{user.name}
									</Typography>
								</div>
							)
						})}
					</div>
					<div className={classes.teamSeeMore}>
						<Button
							color="secondary"
						>
							See More Researchers
							<ArrowForwardIcon />
						</Button>
					</div>
				</Container>
			</div>
		)
	}

	componentDidMount() {
		const orgID = this.props.match.params.orgID
		this.props.fetchOrgInfo({ orgID })
		this.props.getRepoList({})
	}
}

interface MatchParams {
	orgID: string
}

interface Props extends RouteComponentProps<MatchParams>{
    org: IOrganization
    repos: { [repoID: string]: IRepo }
    users: { [userID: string]: IUser }
    discussions: { [discussionID: string]: IDiscussion }
    discussionsByRepo: { [repoID: string]: string[] }
    getRepoList: typeof getRepoList
    fetchOrgInfo: typeof fetchOrgInfo
	classes: any
}

const styles = (theme: Theme) => createStyles({
	progressContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		marginTop: 256,
	},
	headerImg: {
		width: '100%',
		maxHeight: 400,
		overflow: 'hidden',
		position: 'relative',
		'& img': {
			width: '100%'
		},
	},
	titleContainer: {
		position: 'relative',
		height: 500,
	},
	title: {
		position: 'absolute',
		left: 0,
		right: 0,
		display: 'flex',
		justifyContent: 'center',
		'& h2': {
			padding: 8,
			borderRadius: 5,
		}
	},
	statsContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'space-between'
	},
	stats: {
		flexGrow: 1,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: '1rem',
		marginBottom: 32,
		'& svg': {
			marginRight: 8
		}
	},
	teamHeader: {
		textAlign: 'center',
		marginTop: 16,
	},
	team: {
		marginTop: 16,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		flexWrap: 'wrap',
	},
	teamProfile: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		margin: 16,
		'& img': {
			width: 150,
			height: 150,
			borderRadius: '50%',
		},
		'& p': {
			fontSize: '1.1rem',
			marginTop: 8,
		}
	},
	teamSeeMore: {
		width: '100%',
		textAlign: 'center',
		marginTop: 16,
		'& button': {
			textTransform: 'none',
			'& svg': {
				marginLeft: 8
			}
		}
	}
})

const mapStateToProps = (state: IGlobalState, props: RouteComponentProps<MatchParams>) => {
	const orgID = props.match.params.orgID
    return {
    	org: state.org.orgs[orgID],
    	repos: state.repo.repos,
    	users: state.user.users,
    	discussions: state.discussion.discussions,
    	discussionsByRepo: state.discussion.discussionsByRepo,
    }
}

const mapDispatchToProps = {
	fetchOrgInfo,
	getRepoList,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(ShowcasePage))
