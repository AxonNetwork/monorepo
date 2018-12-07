import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { IGlobalState } from 'redux/store'
import autobind from 'conscience-lib/utils/autobind'


@autobind
class RepoList extends React.Component<Props>
{
	render() {
		const { repoIDs, classes } = this.props
		return (
			<List className={classes.list}>
				{repoIDs.map(id=>(
					<Link to={`/repo/${id}`} className={classes.link}>
						<ListItem button>
							<ListItemText primary={id} />
						</ListItem>
					</Link>
				))}
			</List>
		)
	}
}

interface Props {
	repoIDs: string[]
	classes: any
}

const styles = (theme: Theme) => createStyles({
	list: {
		marginTop: 32,
		border: '1px solid ' + theme.palette.grey[600],
	},
})

const mapStateToProps = (state: IGlobalState) => {
	const repoIDs = Object.keys(state.repo.repos)
    return {
    	repoIDs
    }
}

const mapDispatchToProps = {}

const RepoListContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoList))

export default RepoListContainer
