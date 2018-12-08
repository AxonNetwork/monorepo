import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect, withRouter } from 'react-router'
import Header from 'components/Header'
import LoginPage from 'pages/LoginPage'
import HomePage from 'pages/HomePage'
import RepoPage from 'pages/RepoPage'
import { IGlobalState } from 'redux/store'

function Routes(
	{ loggedIn }: {loggedIn: boolean}
	){
	return (
		<div>
		    <Header />
		    <Switch>
				<Route exact path='/login' component={LoginPage} />
				<PrivateRoute path='/repo' component={RepoPage} loggedIn={loggedIn} />
				<Route component={HomePage} />
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
