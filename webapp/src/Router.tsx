import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router'
import Header from 'components/Header'
import LoginPage from 'pages/LoginPage'
import HomePage from 'pages/HomePage'
import { IGlobalState } from 'redux/store'

function Router({ loggedIn }: { loggedIn: boolean }) {
	return (
		<div>
			<Header />
			<Switch>
				<Route exact path='/login' component={LoginPage} />
				{/*<Route path='/react' component={ReactPage} />*/}
				{/*<Route path='/parallax' component={ParallaxPage} />*/}
				{/*<Route component={LoginPage} />*/}
				<PrivateRoute path='/' component={HomePage} loggedIn={loggedIn} />
			</Switch>
		</div>
	)
}

function PrivateRoute({ component: Component, loggedIn, ...rest}: any) {
	return (
		<Route {...rest} render={(props) => (
			loggedIn === true
			? <Component {...props} />
			: <Redirect to='/login' />
		)} />
	)
}

const mapStateToProps = (state: IGlobalState) => {
	const loggedIn = state.user.currentUser !== undefined
    return {
    	loggedIn
    }
}

const mapDispatchToProps = {}

const RouterContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Router)

export default RouterContainer
