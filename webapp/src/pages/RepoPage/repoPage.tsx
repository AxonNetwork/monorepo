import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import FileList from 'conscience-components/FileList'
import { IGlobalState } from 'redux/store'
import autobind from 'conscience-lib/utils/autobind'


@autobind
class RepoPage extends React.Component<Props> {
	render() {
		// const { classes } = this.props
		return (
			<div>
				<FileList />
				
			</div>
		)
	}
}

interface Props {
	classes: any
}

const styles = (theme: Theme) => createStyles({})

const mapStateToProps = (state: IGlobalState) => {
    return {}
}

const mapDispatchToProps = {}

const RepoPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoPage))

export default RepoPageContainer
