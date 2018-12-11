import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { History } from 'history'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Timeline from 'conscience-components/Timeline'
import { IGlobalState } from 'redux/store'
import { IRepo } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoHistoryPage extends React.Component<Props>
{
	selectCommit(payload: {commit: string}){
		console.log('commit: ', commit)
	}

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

		return (
			<div>
                <Timeline
                    repoID={repo.repoID}
                    page={1}
                    commits={repo.commits}
                    commitList={commitList}
                    selectCommit={this.selectCommit}
                    users={{}}
                    usersByEmail={{}}
                />
			</div>
		)
	}
}

interface MatchParams {
	commit: string | undefined
	repoID: string
}

interface Props extends RouteComponentProps<MatchParams>{
	repo: IRepo
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
    return {
    	repo
    }
}

const mapDispatchToProps = {}

const RepoHistoryPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoHistoryPage))

export default RepoHistoryPageContainer
