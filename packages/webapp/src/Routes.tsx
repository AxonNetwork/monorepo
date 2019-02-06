import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect, withRouter, RouteComponentProps } from 'react-router'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Header from 'components/Header'
import Footer from 'components/Footer'
import LoginPage from 'pages/LoginPage'
import RepoPage from 'pages/RepoPage'
import UserPage from 'conscience-components/UserPage'
import SettingsPage from 'pages/SettingsPage'
import OrgPage from 'pages/OrgPage'
import ShowcasePage from 'pages/ShowcasePage'
import SearchPage from 'conscience-components/SearchPage'
import { IGlobalState } from 'conscience-components/redux'


function Routes({ loginState, username, history, classes }: Props) {
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
                <Route path="/user/:username" render={props => {
                    return <UserPage {...props} classes={{ main: classes.constrainedWidth }} />
                }} />
                <Route path="/search/:query" component={SearchPage} />
                <Route render={() => {
                    if (loginState === LoginState.LoggedIn) {
                        return <Redirect to={`/user/${username}`} />
                    } else {
                        return <Redirect to="/login" />
                    }
                }} />
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
    classes?: any
}

export function PrivateRoute({ component: Component, loginState, ...rest }: any) {
    return (
        <Route {...rest} render={(props) => {
            if (loginState === LoginState.LoggedIn) {
                return <Component {...props} />

            } else if (loginState === LoginState.NotLoggedIn) {
                return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />

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

const styles = createStyles({
    constrainedWidth: {
        width: 1024,
    },
})

const mapDispatchToProps = {}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Routes)))
