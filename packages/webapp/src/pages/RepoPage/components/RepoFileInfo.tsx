import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { IGlobalState } from 'redux/store'
// import { IRepo } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoFileInfo extends React.Component<Props>
{
	render() {
		// const { repo, classes } = this.props

		return (
			<div>
				<h1>{this.props.match.params.filePath}</h1>
			</div>
		)
	}
}

interface MatchParams {
	repoID: string
	filePath: string
}

interface Props extends RouteComponentProps<MatchParams>{
	// repo: IRepo
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
	// const repoID = props.match.params.repoID
	// const repo = state.repo.repos[repoID]
    return {}
}

const mapDispatchToProps = {}

const RepoFileInfoContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoFileInfo))

export default RepoFileInfoContainer
