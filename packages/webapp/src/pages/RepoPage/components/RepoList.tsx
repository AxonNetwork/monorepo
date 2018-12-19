import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import UserAvatar from 'conscience-components/UserAvatar'
import RepositoryCards from 'conscience-components/RepositoryCards'
import { getRepoList } from 'redux/repo/repoActions'
import { IGlobalState } from 'redux/store'
import { IRepo, IUser, IOrganization, IDiscussion, RepoPage } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoList extends React.Component<Props>
{
	render() {
		const { user, orgs, classes } = this.props
		return (
			<div className={classes.page}>
				<div className={classes.profileSidebar}>
					<Link to='/settings'>
						<img src={user.picture} className={classes.userPic} />
					</Link>
					<div className={classes.userDetails}>
						<Typography variant="h5">
							<strong>{user.name}</strong>
						</Typography>
						<Typography>
							<em>{user.username}</em>
						</Typography>
					</div>
					<Divider />
					<div className={classes.orgs}>
						<Typography variant="h6">
							Organizations
						</Typography>
						{user.orgs.map(orgID=>{
							const org = orgs[orgID]
							if(org === undefined){
								return null
							}
							return(
								<IconButton onClick={()=>this.navigateOrgPage(orgID)} classes={{root: classes.orgIcon}}>
									<UserAvatar
										username={orgs[orgID].name}
										userPicture={orgs[orgID].picture}
									/>
								</IconButton>
							)
						})}
					</div>
				</div>
				<div className={classes.repoCards}>
					<RepositoryCards
						repoList={this.props.repoList}
						repos={this.props.repos}
						discussions={this.props.discussions}
						discussionsByRepo={this.props.discussionsByRepo}
						selectRepoAndPage={this.selectRepoAndPage}
					/>
				</div>
			</div>
		)
	}

	componentWillMount(){
		this.props.getRepoList({})
	}

	navigateOrgPage(orgID: string){
		this.props.history.push(`/org/${orgID}`)
	}

    selectRepoAndPage(payload: { repoID?: string, repoRoot?: string | undefined, repoPage: RepoPage }){
    	const repoID = payload.repoID
    	switch(payload.repoPage){
    		case RepoPage.Home:
	    		this.props.history.push(`/repo/${repoID}`)
    			return
    		case RepoPage.Files:
	    		this.props.history.push(`/repo/${repoID}/files`)
    			return
    		case RepoPage.Discussion:
	    		this.props.history.push(`/repo/${repoID}/discussion`)
	    		return
    	}
	}
}

interface MatchParams {}

interface Props extends RouteComponentProps<MatchParams>{
	repoList: string[]
	repos: {[repoID: string]: IRepo}
	user: IUser
	orgs: {[orgID: string]: IOrganization}
    discussions: {[discussionID: string]: IDiscussion}
    discussionsByRepo: { [repoID: string]: string[] }
	getRepoList: typeof getRepoList
	classes: any
}

const styles = (theme: Theme) => createStyles({
	page: {
		display: 'flex',
		flexDirection: 'row',
	},
	profileSidebar: {
		marginRight: 32,
		width: 350,
		flexGrow: 1,
	},
	repoCards: {
		flexGrow: 1
	},
	userPic: {
		width: '100%',
		borderRadius: 8,
	},
	userDetails: {
		marginTop: 8,
		marginBottom: 8,
	},
	orgs: {
		marginTop: 8,
	},
	orgIcon: {
		padding: 4,
	},
	list: {
		flexGrow: 1,
		border: '1px solid ' + theme.palette.grey[600],
	},
})

const mapStateToProps = (state: IGlobalState) => {
    return {
    	repoList: state.repo.repoList,
    	repos: state.repo.repos,
    	user: state.user.users[state.user.currentUser || ''],
    	orgs: state.org.orgs,
    	discussions: state.discussion.discussions,
    	discussionsByRepo: state.discussion.discussionsByRepo,
    }
}

const mapDispatchToProps = {
	getRepoList
}

const RepoListContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoList))

export default RepoListContainer
