import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Tabs from 'conscience-components/Tabs'
import { IOrganization, OrgPage } from 'conscience-lib/common'


class OrgInfo extends React.Component<Props>
{
	render() {
		const { org, classes } = this.props
		return (
            <div className={classes.root}>
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
                        [OrgPage.Settings, 'Settings'],
                    ]}
                    activePage={this.props.orgPage}
                    onTabSelect={(orgPage: OrgPage) => this.props.navigateOrgPage( orgPage )}
                    menuLabelsHidden={this.props.menuLabelsHidden}
                />
            </div>
		)
	}
}

interface Props {
	org: IOrganization
	orgPage: OrgPage
	menuLabelsHidden: boolean
	navigateOrgPage: (orgPage: OrgPage) => void

	classes: any
}

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        borderBottom: '1px solid #e4e4e4',
        marginBottom: theme.spacing.unit * 2,
    },
    orgInfoContainer: {
        display: 'flex',
        marginBottom: theme.spacing.unit,
    },
    orgInfo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
    },
    orgPicture: {
        width: 100,
        borderRadius: 10,
        marginRight: theme.spacing.unit * 4,
    },
    headline: {
        fontSize: '2rem',
        color: 'rgba(0, 0, 0, 0.7)',
        marginBottom: theme.spacing.unit,
    },
})

export default withStyles(styles)(OrgInfo)
