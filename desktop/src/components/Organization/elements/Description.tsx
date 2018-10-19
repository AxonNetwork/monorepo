import React from 'react'
import { Theme, createStyles, withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

class Description extends React.Component<Props>
{
    render(){
        const { description, classes } = this.props
        return(
            <Typography className={classes.description}>
                {description}
            </Typography>
        )
    }
}

interface Props {
    description: string
    classes: any
}

const styles = (theme: Theme) => createStyles({
    description:{
        fontStyle: 'italic',
        marginBottom: theme.spacing.unit
    }
})

export default withStyles(styles)(Description)