import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { History } from 'history'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Timeline from 'conscience-components/Timeline'
import CommitView from 'conscience-components/CommitView'
import { getDiff } from 'redux/repo/repoActions'
import { IGlobalState } from 'redux/store'
import { IRepo, IUser } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoHistoryPage extends React.Component<Props>
{
	render() {
		const { repo, classes } = this.props
		const commits = repo.commits
		if(commits === undefined) {
			return (
				<div className={classes.progressContainer}>
					<CircularProgress color="secondary" />
				</div>
			)
		}
		const commitList = Object.keys(commits)
		const selectedCommit = this.props.match.params.commit
		if(selectedCommit === undefined) {
			return (
	            <Timeline
	                repoID={repo.repoID}
	                page={1}
	                commits={repo.commits}
	                commitList={commitList}
	                selectCommit={this.selectCommit}
	                users={{}}
	                usersByEmail={{}}
	            />
			)
		}else {
			return (
				<CommitView
					repoID={repo.repoID}
					repoRoot={repo.repoID} // fix this
					user={this.props.user}
					commit={commits[selectedCommit]}
					codeColorScheme={undefined}
					getDiff={this.getDiff}
					selectCommit={this.selectCommit}
				/>
			)
		}
	}

	selectCommit(payload: {selectedCommit: string | undefined}){
		const repoID = this.props.match.params.repoID
		const commit = payload.selectedCommit
		if(commit === undefined) {
			this.props.history.push(`/repo/${repoID}/history`)
		}else {
			this.props.history.push(`/repo/${repoID}/history/${commit}`)
		}
	}

	getDiff(payload: {repoRoot: string, commit: string}){
		const repoID = payload.repoRoot
		const commit = payload.commit
		this.props.getDiff({ repoID, commit })
	}
}

interface MatchParams {
	commit: string | undefined
	repoID: string
}

interface Props extends RouteComponentProps<MatchParams>{
	repo: IRepo
	user: IUser
	getDiff: (payload: {repoID: string, commit: string}) => void
	history: History
	classes: any
}

const styles = (theme: Theme) => createStyles({
	progressContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		marginTop: 256,
	}
})

const mapStateToProps = (state: IGlobalState, props: Props) => {
	const repoID = props.match.params.repoID
	const repo = state.repo.repos[repoID]
	const user = state.user.users[state.user.currentUser || ''] || {}
    return {
    	repo,
    	user,
    }
}

const mapDispatchToProps = {
	getDiff,
}

const RepoHistoryPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoHistoryPage))

export default RepoHistoryPageContainer
