import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { History } from 'history'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import FileList from 'conscience-components/FileList'
import { IGlobalState } from 'redux/store'
import { IRepo } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoFiles extends React.Component<Props>
{
	selectFile(file: any){
		const repoID = this.props.match.params.repoID
		if(file.selectedFile === undefined){
			this.props.history.push(`/repo/${repoID}/files`)
		}else{
			const filepath = file.selectedFile.file
			this.props.history.push(`/repo/${repoID}/files/${filepath}`)
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
		const selected = this.props.match.params.filepath || ""
		return (
			<div>
				<FileList
					repoRoot="protocol"
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
	filepath: string
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

const RepoFilesContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoFiles))

export default RepoFilesContainer
