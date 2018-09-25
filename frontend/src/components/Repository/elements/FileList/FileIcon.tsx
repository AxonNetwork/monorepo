import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Badge from '@material-ui/core/Badge'
import CodeIcon from '@material-ui/icons/Code'
import AssessmentIcon from '@material-ui/icons/Assessment'
import SubjectIcon from '@material-ui/icons/Subject'
import PermMediaIcon from '@material-ui/icons/PermMedia'
import FolderIcon from '@material-ui/icons/Folder'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'

class FileIcon extends Component {
    render(){
        let icon
        switch (this.props.fileType) {
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
        if(this.props.status === "*modified" || this.props.status === "*added"){
            icon = (
                <Badge classes={{badge:this.props.classes.badge}} badgeContent='' color="secondary">
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
}

FileIcon.propTypes = {
    fileType: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired
}

const styles = theme => ({
    badge: {
        top: '-4px',
        width:' 8px',
        right: '-4px',
        height:' 8px'
    }
})

export default withStyles(styles)(FileIcon)
