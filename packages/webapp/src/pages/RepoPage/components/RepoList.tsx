import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { getRepoList } from 'redux/repo/repoActions'
import { IGlobalState } from 'redux/store'
import autobind from 'conscience-lib/utils/autobind'


@autobind
class RepoList extends React.Component<Props>
{
	componentWillMount(){
		this.props.getRepoList({})
	}

	render() {
		const { repoList, classes } = this.props
		return (
			<List className={classes.list}>
				{repoList.map(id=>(
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
	repoList: string[]
	getRepoList: typeof getRepoList
	classes: any
}

const styles = (theme: Theme) => createStyles({
	list: {
		marginTop: 32,
		border: '1px solid ' + theme.palette.grey[600],
	},
})

const mapStateToProps = (state: IGlobalState) => {
    return {
    	repoList: state.repo.repoList
    }
}

const mapDispatchToProps = {
	getRepoList
}

const RepoListContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoList))

export default RepoListContainer
