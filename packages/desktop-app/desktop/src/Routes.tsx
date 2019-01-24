import React from 'react'
import { Route, Switch, Redirect, withRouter, RouteComponentProps } from 'react-router'
import WelcomePage from './pages/WelcomePage'
import RepoPage from './pages/RepoPage'
import NewRepoPage from './pages/NewRepoPage'
import OrgPage from './pages/OrgPage'
import SettingsPage from './pages/SettingsPage'
import UserPage from 'conscience-components/UserPage'

function Routes(props: Props) {
    console.log(props.history.location.pathname)
    return (
        <Switch>
            <Route path="/local-repo/:repoHash" component={RepoPage} />
            <Route path="/new-repo" component={NewRepoPage} />
            <Route path="/new-repo/:orgID" component={NewRepoPage} />
            <Route path="/org/:orgID" component={OrgPage} />
            <Route path="/welcome" component={WelcomePage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/user/:username" component={UserPage} />
            <Route render={() => (
                <Redirect to="/welcome" />
            )} />
        </Switch>
    )
}

interface Props extends RouteComponentProps { }

export default withRouter(Routes)
