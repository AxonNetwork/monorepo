import React from 'react'
import { Route, Switch, Redirect, withRouter, RouteComponentProps } from 'react-router'
import { withStyles, createStyles } from '@material-ui/core/styles'
import WelcomePage from './pages/WelcomePage'
import RepoPage from './pages/RepoPage'
import NewRepoPage from './pages/NewRepoPage'
import OrgPage from './pages/OrgPage'
import SettingsPage from './pages/SettingsPage'
import SearchPage from 'conscience-components/SearchPage'
import UserPage from 'conscience-components/UserPage'

function Routes({ history, classes }: Props) {
    return (
        <Switch>
            <Route path="/local-repo/:repoHash" component={RepoPage} />
            <Route path="/repo/:repoID" component={RepoPage} />
            <Route path="/new-repo" component={NewRepoPage} />
            <Route path="/new-repo/:orgID" component={NewRepoPage} />
            <Route path="/org/:orgID" component={OrgPage} />
            <Route path="/welcome" component={WelcomePage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/user/:username" render={props => {
                return <UserPage {...props} classes={{ container: classes.scrollContainer }} />
            }} />
            <Route path="/search/:query" component={SearchPage} />
            <Route render={() => (
                <Redirect to="/welcome" />
            )} />
        </Switch>
    )
}


interface Props extends RouteComponentProps {
    classes: any
}

const styles = createStyles({
    scrollContainer: {
        overflowY: 'auto',
    },
})

export default withStyles(styles)(withRouter(Routes))
