import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect, withRouter } from 'react-router'
import { History } from 'history'
import Header from 'components/Header'
import LoginPage from 'pages/LoginPage'
import HomePage from 'pages/HomePage'
import RepoPage from 'pages/RepoPage'
import SettingsPage from 'pages/SettingsPage'
import { IGlobalState } from 'redux/store'

function Routes(
	{ loggedIn, history }: {loggedIn: boolean, history: History}
	){
	const location = history.location.pathname
	return (
		<div>
			{location !== '/login' &&
			    <Header />
			}
		    <Switch>
				<Route exact path='/login' component={LoginPage} />
				<PrivateRoute path='/repo' component={RepoPage} loggedIn={loggedIn} />
				<PrivateRoute path='/settings' component={SettingsPage} loggedIn={loggedIn} />
				<Route render={() => (
					<React.Fragment>
						{loggedIn && <Redirect to='/repo' />}a
						{!loggedIn && <HomePage />}
					</React.Fragment>
					)}
				/>
		    </Switch>
		</div>
	)
}

export function PrivateRoute({ component: Component, loggedIn, ...rest}: any) {
	return (
		<Route {...rest} render={(props) => (
			loggedIn === true
			? <Component {...props} />
			: <Redirect
				to={{
	              pathname: "/login",
	              state: { from: props.location }
	            }}
			 />
		)}
		/>
	)
}

const mapStateToProps = (state: IGlobalState) => {
	const loggedIn = state.user.currentUser !== undefined
    return {
    	loggedIn
    }
}

const mapDispatchToProps = {}

const RoutesContainer = withRouter(
	connect(
	    mapStateToProps,
	    mapDispatchToProps,
	)(Routes) as any
)

export default RoutesContainer
