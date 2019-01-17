import React from 'react'
import { Route, Switch, Redirect, withRouter, RouteComponentProps } from 'react-router'
import Welcome from './components/NewRepository/Welcome'
import RepoPage from './pages/RepoPage'
import SettingsPage from './pages/SettingsPage'

function Routes(props: Props) {
    console.log(props.history.location.pathname)
    return (
        <Switch>
            <Route path="/repo/:repoHash" component={RepoPage} />
            <Route path="/welcome" component={Welcome} />
            <Route path="/settings" component={SettingsPage} />
            <Route render={() => (
                <Redirect to="/welcome" />
            )} />
        </Switch>
    )
}

interface Props extends RouteComponentProps { }

export default withRouter(Routes)
