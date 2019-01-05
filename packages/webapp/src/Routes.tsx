import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect, withRouter } from 'react-router'
import { History } from 'history'
import Header from 'components/Header'
import Footer from 'components/Footer'
import LoginPage from 'pages/LoginPage'
import RepoPage from 'pages/RepoPage'
import SettingsPage from 'pages/SettingsPage'
import OrgPage from 'pages/OrgPage'
import ShowcasePage from 'pages/ShowcasePage'
import { IGlobalState } from 'redux/store'

function Routes(
	{ loginState, history }: Props
	){
	const location = history.location.pathname
	return (
		<div>
			{location !== '/login' &&
			    <Header />
			}
		    <Switch>
				<Route exact path='/login' component={LoginPage} />
				<PrivateRoute path='/repo' component={RepoPage} loginState={loginState} />
				<PrivateRoute path='/settings' component={SettingsPage} loginState={loginState} />
				<PrivateRoute path='/org' component={OrgPage} loginState={loginState} />
				<PrivateRoute path='/showcase/:orgID' component={ShowcasePage} loginState={loginState} />
				<Route render={() => {
					if(loginState === LoginState.LoggedIn){
						return <Redirect to='/repo' />
					}else {
						return <Redirect to='/login' />
					}
				}}
				/>
		    </Switch>
		    <Footer />
		</div>
	)
}

enum LoginState {
	Checking,
	LoggedIn,
	NotLoggedIn
}

interface Props {
	loginState: LoginState
	history: History
}

export function PrivateRoute({ component: Component, loginState, ...rest}: any) {
	return (
		<Route {...rest} render={(props) => {
			if(loginState === LoginState.LoggedIn) {
				return <Component {...props} />
			}else if(loginState === LoginState.NotLoggedIn){
				return(
					<Redirect
						to={{
			              pathname: "/login",
			              state: { from: props.location }
			            }}
					 />
				)
			}else {
				return null
			}
		}} />
	)
}

const mapStateToProps = (state: IGlobalState) => {
	let loginState = LoginState.NotLoggedIn
	if(!state.user.checkedLoggedIn){
		loginState = LoginState.Checking
	}
	if(state.user.currentUser !== undefined) {
		loginState = LoginState.LoggedIn
	}

    return {
    	loginState
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
