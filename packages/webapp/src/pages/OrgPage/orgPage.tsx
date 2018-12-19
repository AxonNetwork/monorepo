import React from 'react'
import { Switch, Route } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import OrgListPage from './components/OrgListPage'
import OrgRoutes from './OrgRoutes'


class OrgPage extends React.Component<Props>
{
	render() {
		const { classes } = this.props
		return (
			<div className={classes.container}>
				<main className={classes.main}>
					<Switch>
						<Route exact path='/org' component={OrgListPage} />
						<Route path='/org/:orgID' component={OrgRoutes} />
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
		width: '80%',
		marginTop: 32,
	}
})

export default withStyles(styles)(OrgPage)
