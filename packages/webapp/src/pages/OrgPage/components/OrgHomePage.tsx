import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import LargeAddButton from 'conscience-components/LargeAddButton'
import RepositoryCards from 'conscience-components/RepositoryCards'
import Members from './connected/Members'
import { getRepoList } from 'redux/repo/repoActions'
import { fetchOrgInfo, addRepoToOrg } from 'redux/org/orgActions'
import { IGlobalState } from 'redux/store'
import { IOrganization, IRepo, IDiscussion, RepoPage } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class OrgHomePage extends React.Component<Props>
{
	render() {
		const { org, classes } = this.props
		if(org === undefined) {
			return (
				<div className={classes.progressContainer}>
					<CircularProgress color="secondary" />
				</div>
			)
		}

		return (
			<div className={classes.page}>
				<div className={classes.main}>
					<LargeAddButton text="Click to add a welcome message for your team" onClick={this.onClickEditWelcome} />
					<RepositoryCards
						org={this.props.org}
						repos={this.props.repos}
						discussions={this.props.discussions}
						discussionsByRepo={this.props.discussionsByRepo}
						addRepoToOrg={this.props.addRepoToOrg}
						selectRepoAndPage={this.selectRepoAndPage}
					/>
				</div>
				<div className={classes.sidebar}>
					<Members
						userList={org.members}
						adminList={ [org.creator] }
						addMember={this.addMember}
						removeMember={this.removeMember}
					/>
				</div>
			</div>
		)
	}

	componentDidMount() {
		const orgID = this.props.match.params.orgID
		this.props.fetchOrgInfo({ orgID })
		this.props.getRepoList({})
	}

	onClickEditWelcome() {
		console.log('edit welcome')
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

	addMember(payload: { email: string }) {
		console.log('addMember')
	}

	removeMember(payload: { userID: string }) {
		console.log('removeMember')
	}
}

interface MatchParams {
	orgID: string
}

interface Props extends RouteComponentProps<MatchParams>{
    org: IOrganization
    repos: {[repoID: string]: IRepo}
    discussions: {[discussionID: string]: IDiscussion}
    discussionsByRepo: { [repoID: string]: string[] }
    getRepoList: typeof getRepoList
    fetchOrgInfo: typeof fetchOrgInfo
    addRepoToOrg: typeof addRepoToOrg
    classes: any
}

const styles = (theme: Theme) => createStyles({
	progressContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		marginTop: 256,
	},
	page: {
		display: 'flex',
		flexDirection: 'row',
	},
	main: {
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
	},
	sidebar: {
		minWidth: 350,
		marginLeft: 32,
	}
})

const mapStateToProps = (state: IGlobalState, props: RouteComponentProps<MatchParams>) => {
	const orgID = props.match.params.orgID
    return {
    	org: state.org.orgs[orgID],
    	repos: state.repo.repos,
    	discussions: state.discussion.discussions,
    	discussionsByRepo: state.discussion.discussionsByRepo,
    }
}

const mapDispatchToProps = {
	fetchOrgInfo,
	getRepoList,
	addRepoToOrg,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(OrgHomePage))
