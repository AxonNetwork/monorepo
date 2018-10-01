import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'

function FileLink(props: Props) {
    const { fileRef, classes } = props
    const parts = fileRef.split("[")
    const filename = parts[1]

    return (
       <a className={classes.link}>
            {filename}
        </a>
    )
}

export interface Props {
    fileRef: string
    classes: any
}

const styles = (theme: Theme) => createStyles({
    link:{
        color: theme.palette.secondary.main,
        textDecoration: 'underline'
    }
})

export default withStyles(styles)(FileLink)
