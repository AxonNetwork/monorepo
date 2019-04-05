import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'


class Footer extends React.Component<Props>
{
    render() {
        const { classes } = this.props
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <Divider className={classes.divider} />
                    <Typography className={classes.text}>
                        &copy; Conscience, Inc.
					</Typography>
                </div>
            </div>
        )
    }
}

interface Props {
    classes: any
}

const styles = (theme: Theme) => createStyles({
    root: {
        marginTop: 64,
        marginBottom: 32,
        display: 'flex',
        justifyContent: 'center',
    },
    content: {
        width: '80%',
    },
    divider: {
        marginBottom: 16
    },
    text: {
        textAlign: 'center',
        color: theme.palette.grey[600]
    }
})

export default withStyles(styles)(Footer)
