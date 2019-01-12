import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route, RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import OrgInfo from './components/OrgInfo'
import OrgHomePage from './components/OrgHomePage'
import OrgEditorPage from './components/OrgEditorPage'
import OrgSettingsPage from './components/OrgSettingsPage'
import { fetchOrgInfo } from 'redux/org/orgActions'
import { IGlobalState } from 'redux/store'
import { IOrganization, OrgPage } from 'conscience-lib/common'
import { autobind, orgPageToString, stringToOrgPage } from 'conscience-lib/utils'


@autobind
class OrgRoutes extends React.Component<Props>
{
    render() {
        const { org, classes } = this.props
        if (org === undefined) {
            return (
                <div className={classes.progressContainer}>
                    <CircularProgress color="secondary" />
                </div>
            )
        }
        const orgPage = stringToOrgPage(this.props.location.pathname)

        return (
            <div>
                <OrgInfo
                    org={org}
                    orgPage={orgPage}
                    menuLabelsHidden={this.props.menuLabelsHidden}
                    navigateOrgPage={this.navigateOrgPage}
                />
                <div>
                    <Switch>
                        <Route exact path='/org/:orgID' component={OrgHomePage} />
                        <Route exact path='/org/:orgID/editor' component={OrgEditorPage} />
                        <Route exact path='/org/:orgID/settings' component={OrgSettingsPage} />
                    </Switch>
                </div>
            </div>
        )
    }

    componentDidMount() {
        const orgID = this.props.match.params.orgID
        this.props.fetchOrgInfo({ orgID })
    }

    navigateOrgPage(orgPage: OrgPage) {
        const orgID = this.props.match.params.orgID
        const page = orgPageToString(orgPage)
        if (page === 'home') {
            this.props.history.push(`/org/${orgID}`)
        } else {
            this.props.history.push(`/org/${orgID}/${page}`)
        }
    }
}

interface MatchParams {
    orgID: string
}

interface Props extends RouteComponentProps<MatchParams> {
    org: IOrganization
    menuLabelsHidden: boolean
    fetchOrgInfo: typeof fetchOrgInfo
    classes: any
}

const styles = (theme: Theme) => createStyles({
    progressContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 256,
    },
})

const mapStateToProps = (state: IGlobalState, props: Props) => {
    const orgID = props.match.params.orgID
    return {
        org: state.org.orgs[orgID],
        menuLabelsHidden: state.user.userSettings.menuLabelsHidden || false,
    }
}

const mapDispatchToProps = {
    fetchOrgInfo
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(OrgRoutes))
