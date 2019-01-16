import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

function LargeProgressSpinner({ classes, ...rest }: any) {
    return (
        <div className={classes.root}>
            <CircularProgress color="secondary" {...rest} />
        </div>
    )
}


const styles = (theme: Theme) => createStyles({
    root: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 256,
    }
})

export default withStyles(styles)(LargeProgressSpinner)