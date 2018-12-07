import React from 'react'
import { Switch, Route } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import RepoList from './components/RepoList'
import RepoInfo from './components/RepoInfo'


class RepoPage extends React.Component<Props>
{
	render() {
		const { classes } = this.props
		return (
			<div className={classes.container}>
				<main className={classes.main}>
					<Switch>
						<Route exact path='/repo' component={RepoList} />
						<Route path='/repo/:repoID' component={RepoInfo} />
					</Switch>
				</main>
			</div>
		)
	}
}

interface Props {
	classes: any
}

const styles = (theme: Theme) => createStyles({
	container: {
		display: 'flex',
		justifyContent: 'center',
	},
	main: {
		width: '80%'
	}
})

export default withStyles(styles)(RepoPage)
