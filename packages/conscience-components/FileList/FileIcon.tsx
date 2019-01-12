import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Badge from '@material-ui/core/Badge'
import FolderIcon from '@material-ui/icons/Folder'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import * as filetypes from 'conscience-lib/utils/fileTypes'

interface FileIconProps {
    filename: string
    isFolder: boolean
    status: string
    classes: any
}

function FileIcon(props: FileIconProps) {
    const { filename, isFolder, status, classes } = props

    if (isFolder) {
        return <ListItemIcon><FolderIcon /></ListItemIcon>
    }

    const IconCmpt = filetypes.getIcon(filename) || HelpOutlineIcon
    let icon = <IconCmpt />

    if (status === 'M' || status === '?' || status === 'U') {
        icon = <Badge classes={{ badge: classes.badge }} badgeContent="" color="secondary">{icon}</Badge>
    }
    return <ListItemIcon>{icon}</ListItemIcon>
}

const styles = createStyles({
    badge: {
        top: -2,
        width: 8,
        right: -2,
        height: 8,
    },
})

export default withStyles(styles)(FileIcon)
