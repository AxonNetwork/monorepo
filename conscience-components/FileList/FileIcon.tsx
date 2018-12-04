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

interface FileIconProps {
    fileType: string
    status: string
    classes: any
}

// @@TODO: filetype standardization
function FileIcon(props: FileIconProps) {
    const { fileType, status, classes } = props
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
        case 'unknown':
        default:
            icon = <HelpOutlineIcon />
    }
    if (status === 'M' || status === '?' || status === 'U') {
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
        top: -2,
        width:  8,
        right: -2,
        height:  8,
    },
})

export default withStyles(styles)(FileIcon)
