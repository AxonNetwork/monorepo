import React from 'react'
import { Theme, withStyles, createStyles } from '@material-ui/core'
import classnames from 'classnames'
import Repositories from './elements/Repositories'
import Members from './elements/Members'

class OrganizationHomePage extends React.Component<Props>
{
    render(){
        const { classes } = this.props
        return(
            <div className={classes.organizationHomePage}>
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
    classes: any
}

const styles = (theme: Theme) => createStyles({
    organizationHomePage: {
        width: '100%',
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

export default withStyles(styles)(OrganizationHomePage)