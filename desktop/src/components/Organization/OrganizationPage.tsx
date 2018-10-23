import React from 'react'
import { connect } from 'react-redux'
import { Theme, withStyles, createStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Tabs from '../Tabs/Tabs'
import OrganizationHomePage from './OrganizationHomePage'
import OrganizationSettingsPage from './OrganizationSettingsPage'
import { OrgPage } from 'redux/org/orgReducer'
import { navigateOrgPage } from 'redux/org/orgActions'
import { IGlobalState } from 'redux/store'
import { IOrganization } from 'common'

class OrganizationPage extends React.Component<Props>
{
    render(){
        const { org, orgPage, classes } = this.props
        if(org === undefined){
            return null
        }

        return(
            <div className={classes.organizationPage}>
                <div className={classes.header}>
                    <div className={classes.orgInfoContainer}>
                        {org.picture.length > 0 &&
                            <div>
                                <img src={org.picture} className={classes.orgPicture} />
                            </div>
                        }
                        <div className={classes.orgInfo}>
                            <Typography variant="headline" className={classes.headline}>
                                {org.name}
                            </Typography>
                            <Typography>
                                <em>{org.description}</em>
                            </Typography>
                        </div>
                    </div>
                    <Tabs
                        pages={[
                            [OrgPage.Home, 'Home'],
                            [OrgPage.Settings, 'Settings']
                        ]}
                        activePage={this.props.orgPage}
                        onTabSelect={(orgPage: OrgPage) => this.props.navigateOrgPage({ orgPage })}
                        menuLabelsHidden={this.props.menuLabelsHidden}
                    />
                </div>
                {orgPage === OrgPage.Home &&
                    <OrganizationHomePage
                        org={org}
                    />
                }
                {orgPage === OrgPage.Settings &&
                    <OrganizationSettingsPage />
                }
           </div>
        )
    }
}

interface Props {
    org: IOrganization
    orgPage: OrgPage
    menuLabelsHidden: boolean
    navigateOrgPage: typeof navigateOrgPage
    classes: any
}

const styles = (theme: Theme) => createStyles({
    organizationPage: {
        width: '100%',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        borderBottom: '1px solid #e4e4e4',
        marginBottom: theme.spacing.unit * 2
    },
    orgInfoContainer: {
        display: 'flex',
        marginBottom: theme.spacing.unit
    },
    orgInfo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    orgPicture: {
        width: 100,
        borderRadius: 10,
        marginRight: theme.spacing.unit * 4
    },
    headline: {
        fontSize: '2rem',
        color: 'rgba(0, 0, 0, 0.7)',
        marginBottom: theme.spacing.unit
    },
    description: {
        fontStyle: 'italic',
        marginBottom: theme.spacing.unit,
        fontSize: '12pt'
    },
    tabContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexGrow: 1,
        maxWidth: 510,
        marginLeft: 100,
        marginRight: 60,
    },
    tab: {
        // padding: '10px 16px 0',
        // width: '3.5rem',
        height: '2.6rem',
        backgroundColor: '#f3f3f3',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontFamily: 'Helvetica',
        color: 'rgba(0, 0, 0, 0.33)',
        border: '1px solid #e4e4e4',
        borderRadius: 3,
        position: 'relative',
        top: 1,

        '& svg': {
            width: '0.8em',
            height: '0.8em',
            marginRight: 3,
            verticalAlign: 'bottom',
        },

        '& button': {
            color: 'inherit',
            textTransform: 'none',
            minWidth: 'unset',
            padding: '0 16px',
            borderRadius: 0,
            height: '100%',
            fontWeight: 400,
        },
        '& button:hover': {
            backgroundColor: 'inherit',
        },
    },
})

const mapStateToProps = (state: IGlobalState) => {
    const org = state.org.orgs[state.org.selectedOrg || ""]
    const orgPage = state.org.orgPage
    const menuLabelsHidden = state.user.menuLabelsHidden
    return {
        org,
        orgPage,
        menuLabelsHidden,
    }
}

const mapDispatchToProps = {
    navigateOrgPage
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(OrganizationPage))