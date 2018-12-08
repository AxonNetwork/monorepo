import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route, RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import RepoInfo from './RepoInfo'
import RepoFiles from './RepoFiles'
import { getRepo } from 'redux/repo/repoActions'
import { IGlobalState } from 'redux/store'
import { IRepo, RepoPage } from 'conscience-lib/common'
import { autobind, repoPageToString } from 'conscience-lib/utils'

@autobind
class Repository extends React.Component<Props>
{
	componentWillMount(){
		const repoID = this.props.match.params.repoID
		this.props.getRepo({ repoID })
	}

    navigateRepoPage(repoPage: RepoPage){
        const repoID = this.props.match.params.repoID
        const page = repoPageToString(repoPage)
        if(page === 'home'){
            this.props.history.push(`/repo/${repoID}`)
            return
        }
        this.props.history.push(`/repo/${repoID}/${page}`)
    }

	render() {
		const { repo, classes } = this.props
		if(repo === undefined) {
			return (
				<div className={classes.progressContainer}>
					<CircularProgress color="secondary" />
				</div>
			)
		}
		return (
			<div className={classes.repository}>
				<RepoInfo
					repo={repo}
					repoPage={RepoPage.Files}
					menuLabelsHidden={false}
					navigateRepoPage={this.navigateRepoPage}
				/>
				<div className={classes.subpage}>
					<Switch>
						<Route path='/repo/:repoID/files/:filepath+' component={RepoFiles} />
						<Route path='/repo/:repoID/files' component={RepoFiles} />
						<Route path='/repo/:repoID' component={RepoFiles} />
					</Switch>
				</div>
			</div>
		)
	}
}

interface MatchParams {
	repoID: string
}

interface Props extends RouteComponentProps<MatchParams>{
	repo: IRepo
	getRepo: typeof getRepo
	classes: any
}

const styles = (theme: Theme) => createStyles({
	progressContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		marginTop: 256,
	},
	repository: {
		marginTop: 32
	},
	subpage: {
		marginTop: 32,
	}
})

const mapStateToProps = (state: IGlobalState, props: Props) => {
	const repoID = props.match.params.repoID
	const repo = state.repo.repos[repoID]
    return {
    	repo
    }
}

const mapDispatchToProps = {
	getRepo
}

const RepositoryContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(Repository))

export default RepositoryContainer
