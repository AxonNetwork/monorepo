import React from 'react'
import { connect } from 'react-redux'
import { Theme, withStyles, createStyles } from '@material-ui/core'
import classnames from 'classnames'
import Typography from '@material-ui/core/Typography'
import Repositories from './elements/Repositories'
import Members from './elements/Members'
import { IGlobalState } from 'redux/store'
import { IOrganization } from 'common'

class OrganizationPage extends React.Component<Props>
{
    render(){
        const { org, classes } = this.props
        return(
            <div className={classes.organizationPage}>
                <div className={classes.header}>
                    <Typography variant="headline" className={classes.headline}>
                        {org.name}
                    </Typography>
                    {/* <Typography className={classes.description}>
                        {org.description}
                    </Typography> */}
                </div>
                <div className={classes.boxes}>
                    <Repositories
                        classes={{root: classes.box}}
                    />
                    <Members
                        classes={{root: classnames(classes.box, classes.membersBox)}}
                    />
                </div>
            </div>
        )
    }
}

interface Props {
    org: IOrganization
    classes: any
}

const styles = (theme: Theme) => createStyles({
    organizationPage: {
        width: '100%',
    },
    header: {
        width: '100%',
        borderBottom: '1px solid #e4e4e4',
        marginBottom: theme.spacing.unit * 2
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
    boxes: {
        display: 'flex',
        marginRight: theme.spacing.unit * 3,
    },
    box: {
        marginRight: theme.spacing.unit * 3,
        flexGrow: 1
    },
    membersBox: {
        width: 350,
        flexGrow: 0
    }
})

const mapStateToProps = (state: IGlobalState) => {
    const selectedOrg = state.org.selectedOrg || ""
    const org = state.org.orgs[selectedOrg]
    return {
        org,
    }
}

const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(OrganizationPage))