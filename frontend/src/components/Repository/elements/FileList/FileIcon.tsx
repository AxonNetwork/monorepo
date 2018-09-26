import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Badge from '@material-ui/core/Badge'
import CodeIcon from '@material-ui/icons/Code'
import AssessmentIcon from '@material-ui/icons/Assessment'
import SubjectIcon from '@material-ui/icons/Subject'
import PermMediaIcon from '@material-ui/icons/PermMedia'
import FolderIcon from '@material-ui/icons/Folder'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'

export interface FileIconProps{
    fileType: string
    status: string
    classes: any
}

function FileIcon(props: FileIconProps){
    const { fileType, status, classes} = props
    let icon
    switch (fileType) {
        case 'data':
            icon = <AssessmentIcon />
            break
        case 'code':
            icon = <CodeIcon />
            break
        case 'text':
            icon = <SubjectIcon />
            break
        case 'image':
            icon = <PermMediaIcon />
            break
        case 'folder':
            icon = <FolderIcon />
            break
        case 'unkown':
        default:
            icon = <HelpOutlineIcon />
    }
    if (status === '*modified' || status === '*added') {
        icon = (
            <Badge classes={{badge: classes.badge}} badgeContent="" color="secondary">
                {icon}
            </Badge>
        )
    }
    return(
        <ListItemIcon>
            {icon}
        </ListItemIcon>
    )
}

const styles = createStyles({
    badge: {
        top: -4,
        width:  8,
        right: -4,
        height:  8,
    },
})

export default withStyles(styles)(FileIcon)
