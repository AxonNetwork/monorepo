import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import FileViewer from './ConnectedFileViewer'
import Breadcrumbs from 'conscience-components/Breadcrumbs'
import FileList from 'conscience-components/FileList'
import { IGlobalState } from 'redux/store'
import { IRepo, FileMode } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoFilesPage extends React.Component<Props>
{
	selectFile(payload: {filename: string | undefined, mode: FileMode}){
		const repoID = this.props.match.params.repoID
		const { filename, mode } = payload
		if(filename === undefined){
			this.props.history.push(`/repo/${repoID}/files`)
		}else if(mode === FileMode.View){
			this.props.history.push(`/repo/${repoID}/files/${filename}`)
		}else {
			this.props.history.push(`/repo/${repoID}/edit/${filename}`)
		}
	}

	render() {
		const { repo, classes } = this.props
		const files = repo.files
		if(files === undefined) {
			return (
				<div className={classes.progressContainer}>
					<CircularProgress color="secondary" />
				</div>
			)
		}
		const selected = this.props.match.params.filename || ""
		const repoID = this.props.match.params.repoID || ""
		const file = files[selected]
		if(file !== undefined) {
			return(
				<div>
					<Breadcrumbs
						repoRoot={repo.repoID}
						selectedFolder={selected}
						selectFile={this.selectFile}
						classes={{root: classes.breadcrumbs}}
					/>
					<FileViewer filename={selected} repoID={repoID} />
				</div>
			)
		}
		return (
			<div>
				<FileList
					repoRoot={repo.repoID}
					files={files}
					selectFile={this.selectFile}
					selectedFolder={selected}
					fileExtensionsHidden={false}
				/>
			</div>
		)
	}
}

interface MatchParams {
	repoID: string
	filename: string | undefined
}

interface Props extends RouteComponentProps<MatchParams>{
	repo: IRepo
	classes: any
}

const styles = (theme: Theme) => createStyles({
	progressContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		marginTop: 256,
	},
	breadcrumbs: {
		marginBottom: 32,
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

const RepoFilesPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoFilesPage))

export default RepoFilesPageContainer
