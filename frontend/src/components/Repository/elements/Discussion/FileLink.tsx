import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'

function FileLink(props: Props) {
    const { fileRef, classes } = props

    return (
        <a
            className={classes.link}
            onClick={()=>props.goToFile(fileRef)}
        >
            {fileRef}
        </a>
    )
}

export interface Props {
    fileRef: string
    goToFile: Function
    classes: any
}

const styles = (theme: Theme) => createStyles({
    link:{
        color: theme.palette.secondary.main,
        textDecoration: 'underline'
    }
})

export default withStyles(styles)(FileLink)
