import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { IGlobalState } from 'redux/store'
import autobind from 'conscience-lib/utils/autobind'


@autobind
class HomePage extends React.Component<Props>
{
	render() {
		return (
			<div>
				<h1>HOME</h1>
			</div>
		)
	}
}

interface Props {
	repoIDs: string[]
	classes: any
}

const styles = (theme: Theme) => createStyles({
	container: {
		display: 'flex',
		justifyContent: 'center',
	},
	main: {
		width: '80%'
	},
	list: {
		marginTop: 32,
		border: '1px solid ' + theme.palette.grey[600],
	},
	link: {

	}
})

const mapStateToProps = (state: IGlobalState) => {
	const repoIDs = Object.keys(state.repo.repos)
    return {
    	repoIDs
    }
}

const mapDispatchToProps = {}

const HomePageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(HomePage))

export default HomePageContainer
