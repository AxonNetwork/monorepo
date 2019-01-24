import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CircularProgress from '@material-ui/core/CircularProgress'

function ConscienceIconButton(props: any) {
    const { loading, children, classes, ...rest } = props
    return (
        <IconButton
            disabled={loading}
            {...rest}
        >
            {!loading &&
                <React.Fragment>
                    {children}
                </React.Fragment>
            }
            {loading &&
                <CircularProgress
                    size={24}
                    className={classes.buttonLoading}
                />
            }
        </IconButton>
    )
}

const styles = (theme: Theme) => createStyles({
    buttonLoading: {
        color: theme.palette.secondary.main,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
})

export default withStyles(styles)(ConscienceIconButton)