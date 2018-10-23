import React from 'react'
import { Theme, withStyles, createStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import classnames from 'classnames'
import Repositories from './elements/Repositories'
import Members from './elements/Members'
import RenderMarkdown from 'components/RenderMarkdown/RenderMarkdown'
import { IOrganization } from 'common'

class OrganizationHomePage extends React.Component<Props>
{
    render(){
        const { org, classes } = this.props
        return(
            <div className={classes.organizationHomePage}>
                <div className={classes.boxes}>
                    <Card className={classes.readmeBox}>
                        <CardContent>
                            <RenderMarkdown
                                text={org.readme}
                                basePath=""
                            />
                        </CardContent>
                    </Card>
                    <Repositories classes={{root: classes.box}} />
                </div>
                <Members classes={{root: classnames(classes.box, classes.membersBox)}} />
            </div>
        )
    }
}

interface Props {
    org: IOrganization
    classes: any
}

const styles = (theme: Theme) => createStyles({
    organizationHomePage: {
        width: '100%',
        display: 'flex',
    },
    boxes: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 2,
        marginRight: 128,
    },
    box: {
        marginRight: theme.spacing.unit * 3,
    },
    readmeBox: {
        marginBottom: theme.spacing.unit *3
    },
    membersBox: {
       minWidth: 350,
       flexGrow: 1,
        marginRight: theme.spacing.unit * 6,
    }
})

export default withStyles(styles)(OrganizationHomePage)