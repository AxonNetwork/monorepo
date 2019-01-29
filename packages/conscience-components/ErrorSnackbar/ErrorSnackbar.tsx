import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import ErrorIcon from '@material-ui/icons/Error'

const ErrorSnackbar = (props: any) => {
    const { onClose, message, classes, ...rest } = props
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            {...rest}
        >
            <SnackbarContent
                className={classes.snackbarContent}
                message={
                    <div className={classes.snackbarError}>
                        <ErrorIcon />
                        {message}
                    </div>
                }
                action={[
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                ]}
            />
        </Snackbar>
    )
}

const styles = (theme: Theme) => createStyles({
    snackbarContent: {
        backgroundColor: theme.palette.error.dark
    },
    snackbarError: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        '& svg': {
            marginRight: 8
        }
    }
})

export default withStyles(styles)(ErrorSnackbar)