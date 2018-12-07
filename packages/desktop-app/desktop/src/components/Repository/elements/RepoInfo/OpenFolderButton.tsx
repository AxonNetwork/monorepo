import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
const shell = (window as any).require('electron').shell

export interface OpenFolderButtonProps {
    folderPath: string
    classes: {
        button: string
        icon: string
    }
}

function OpenFolderButton(props: OpenFolderButtonProps){
    const { folderPath, classes } = props
    return (
        <div
            className={classes.button}
            onClick={()=>shell.openItem(folderPath)}
        >
            <FolderOpenIcon className={classes.icon}/>
        </div>
    )
}

const styles = (theme: Theme) => createStyles({
    button: {
        position: 'absolute',
        textAlign: 'right',
        top: 0,
        right: 0,
        width: 0,
        height: 0,
        borderTop: '64px solid',
        borderTopColor: theme.palette.secondary.main,
        borderLeft: '64px solid transparent',
        color: 'white',
        overflow: 'show',
    },
    icon: {
        position: 'absolute',
        top: '-56px',
        right: '8px',
    },
})

export default withStyles(styles)(OpenFolderButton)
