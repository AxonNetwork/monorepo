import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import FileList from 'conscience-components/FileList'
import { getRepo } from 'redux/repo/repoActions'
import { IGlobalState } from 'redux/store'
import { IRepo } from 'conscience-lib/common'
import autobind from 'conscience-lib/utils/autobind'

@autobind
class RepoInfo extends React.Component<Props>
{
	componentWillMount(){
		const repoID = this.props.match.params.repoID
		this.props.getRepo({ repoID })
	}

	selectFile(file: any){
		console.log("Selected File: ", file)
	}

	render() {
		const { repo, classes } = this.props
		if((repo || {}).files === undefined) {
			return (
				<div className={classes.progressContainer}>
					<CircularProgress color="secondary" />
				</div>
			)
		}
		const files = repo.files || {}
		return (
			<div className={classes.fileList}>
				<FileList
					repoRoot=""
					files={files}
					selectFile={this.selectFile}
					selectedFolder={undefined}
					fileExtensionsHidden={false}
				/>

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
	fileList: {
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

const RepoInfoContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoInfo))

export default RepoInfoContainer
