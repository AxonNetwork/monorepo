import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect, withRouter, RouteComponentProps } from 'react-router'
import Header from 'components/Header'
import Footer from 'components/Footer'
import LoginPage from 'pages/LoginPage'
import RepoPage from 'pages/RepoPage'
import UserPage from 'pages/UserPage'
import SettingsPage from 'pages/SettingsPage'
import OrgPage from 'pages/OrgPage'
import ShowcasePage from 'pages/ShowcasePage'
import { IGlobalState } from 'redux/store'


function Routes({ loginState, username, history }: Props) {
    const location = history.location.pathname
    return (
        <div>
            {location !== '/login' &&
                <Header />
            }
            <Switch>
                <Route exact path="/login" component={LoginPage} />
                <PrivateRoute path="/repo/:repoID" component={RepoPage} loginState={loginState} />
                <PrivateRoute path="/settings" component={SettingsPage} loginState={loginState} />
                <PrivateRoute path="/org/:orgID" component={OrgPage} loginState={loginState} />
                <Route path="/showcase/:orgID" component={ShowcasePage} />
                <Route path="/user/:username" component={UserPage} />
                <Route render={() => {
                    if (loginState === LoginState.LoggedIn) {
                        return <Redirect to={`/user/${username}`} />
                    } else {
                        return <Redirect to="/login" />
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
    NotLoggedIn,
}

interface Props extends RouteComponentProps {
    loginState: LoginState
    username: string | undefined
}

export function PrivateRoute({ component: Component, loginState, ...rest }: any) {
    return (
        <Route {...rest} render={(props) => {
            if (loginState === LoginState.LoggedIn) {
                return <Component {...props} />
            } else if (loginState === LoginState.NotLoggedIn) {
                return (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: props.location },
                        }}
                    />
                )
            } else {
                return null
            }
        }} />
    )
}

const mapStateToProps = (state: IGlobalState) => {
    let loginState = LoginState.NotLoggedIn
    if (!state.user.checkedLoggedIn) {
        loginState = LoginState.Checking
    }
    if (state.user.currentUser !== undefined) {
        loginState = LoginState.LoggedIn
    }
    const user = state.user.users[state.user.currentUser || '']
    const username = (user || {}).username

    return {
        loginState,
        username,
    }
}

const mapDispatchToProps = {}

const RoutesContainer = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(Routes) as any,
)

export default RoutesContainer
