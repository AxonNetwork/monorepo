import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import FileIcon from './FileIcon'
import moment from 'moment'
import bytes from 'bytes'
import path from 'path'
const shell = window.require('electron').shell

class File extends Component
{
    constructor(props) {
        super(props)
        this.openItem = this.openItem.bind(this)
        this.selectFile = this.selectFile.bind(this)
    }

    selectFile() {
        if (!!this.props.selectFile) {
            const isFolder = this.props.file.type === 'folder'
            this.props.selectFile(this.props.file.path, isFolder)
        }
    }

    openItem(e) {
        e.stopPropagation()
        shell.openItem(this.props.file.path)
    }

    render() {
        const classes = this.props.classes
        const file = this.props.file
        const canClickFile = !!this.props.selectFile
        const name = path.basename(file.name)
        return (
            <React.Fragment>
                <TableRow hover={canClickFile} onClick={this.selectFile} className={classes.tableRow}>
                    <TableCell scope="row" className={classes.tableCell}>
                        <div className={classes.listItem}>
                            <FileIcon fileType={file.type} status={file.status}/>
                            <Typography variant="subheading" className={classes.filename}>{name}</Typography>
                        </div>
                    </TableCell>
                    <TableCell className={classes.tableCell}>{bytes(file.size)}</TableCell>
                    <TableCell className={classes.tableCell}>{moment(file.modified).fromNow()}</TableCell>
                    <TableCell className={classes.tableCell}>
                        <IconButton onClick={this.openItem} className={classes.editIconButton}>
                            <EditIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        )
    }
}

File.propTypes = {
    file: PropTypes.object.isRequired,
    selectFile: PropTypes.func,
    classes: PropTypes.object.isRequired,
}

const styles = theme => ({
    listItem: {
        display: 'flex',
        padding: 0,
    },
    editIconButton: {
        padding: 0,
    },
    filename: {
        padding: '0 16px',
    },

    // This is here so that it can be overridden by FileList or other parent components
    tableRow: {},

    // This is here so that it can be overridden by FileList or other parent components
    tableCell: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
})

export default withStyles(styles)(File)
