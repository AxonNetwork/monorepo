import React from 'react'
import { Theme, createStyles, withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

class Repositories extends React.Component<Props>
{
    render(){
        const { classes } = this.props
        return(
            <Card className={classes.root}>
                <CardContent>
                    <Typography variant="h6">Studies</Typography>
                </CardContent>
            </Card>
        )
    }
}

interface Props {
    classes: any
}

const styles = (theme: Theme) => createStyles({
    root: {} // pass through styles
})

export default withStyles(styles)(Repositories)