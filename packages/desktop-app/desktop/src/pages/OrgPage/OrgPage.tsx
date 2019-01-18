import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route, RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import OrgHomePage from './OrgHomePage'
import LargeProgressSpinner from 'conscience-components/LargeProgressSpinner'
import OrgInfo from 'conscience-components/OrgPage/OrgInfo'
import OrgEditorPage from 'conscience-components/OrgPage/OrgEditorPage'
import OrgSettingsPage from 'conscience-components/OrgPage/OrgSettingsPage'
import { fetchOrgInfo } from 'conscience-components/redux/org/orgActions'
import { IGlobalState } from 'redux/store'
import { IOrganization, OrgPage } from 'conscience-lib/common'
import { autobind, orgPageToString, stringToOrgPage } from 'conscience-lib/utils'


@autobind
class OrgPageRoutes extends React.Component<Props>
{
    render() {
        const { org, classes } = this.props
        if (org === undefined) {
            return <LargeProgressSpinner />
        }
        const orgPage = stringToOrgPage(this.props.location.pathname)

        return (
            <main className={classes.main}>
                <OrgInfo
                    org={org}
                    orgPage={orgPage}
                    menuLabelsHidden={this.props.menuLabelsHidden}
                    navigateOrgPage={this.navigateOrgPage}
                />
                <div className={classes.orgPage}>
                    <div className={classes.orgPageInner}>
                        <Switch>
                            <Route exact path='/org/:orgID' component={OrgHomePage} />
                            <Route exact path='/org/:orgID/editor' component={OrgEditorPage} />
                            <Route exact path='/org/:orgID/settings' component={OrgSettingsPage} />
                        </Switch>
                    </div>
                </div>
            </main>
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
    main: {
        width: '100%'
    },
    orgPage: {
        width: '100%',
        height: '100%',
        overflowY: 'auto',
    },
    orgPageInner: {
        marginBottom: 128,
        marginRight: 48,
        marginTop: 16,
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
)(withStyles(styles)(OrgPageRoutes))
