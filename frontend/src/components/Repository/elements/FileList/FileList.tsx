import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import Button from '@material-ui/core/Button'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

import {filterSubfolder, mergeFolders} from './fileListUtils'
import path from 'path'

import File from './File'
import Breadcrumbs from './Breadcrumbs';

class FileList extends Component {

    goUpOneDir = () => {
        const dir = path.dirname(this.props.selectedFile.file)
        this.props.selectFile(dir, true)
    }

    render() {
        let {classes, files, selectedFile} = this.props
        if(selectedFile !== undefined){
            files = filterSubfolder(files, selectedFile.file)
        }
        files = mergeFolders(files)
        const names = Object.keys(files).sort((a, b) => {
            if (files[a].type === 'folder' && files[b].type !== 'folder') { return -1 }
            if (files[a].type !== 'folder' && files[b].type === 'folder') { return 1 }
            return (a < b ? -1 : 1)
        })
        return (
            <React.Fragment>
                <Breadcrumbs
                    folderPath={this.props.folderPath}
                    selectedFolder={selectedFile}
                    selectFile={this.props.selectFile}
                />
                <Table className={classes.table}>
                    <TableBody>
                        {
                            names.map((name) => {
                                const file = files[name]
                                return (
                                    <File
                                        file={file}
                                        key={name}
                                        selectFile={this.props.selectFile}
                                        classes={{
                                            tableRow: classes.tableRow,
                                        }}
                                    />
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </React.Fragment>
        )
    }
}

FileList.propTypes = {
    folderPath: PropTypes.string.isRequired,
    files: PropTypes.object.isRequired,
    selectedFolder: PropTypes.object,
    selectFile: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}

const styles = theme => ({
    button: {
        textTransform: 'none',
        fontSize: '12pt',
        padding: '5px 16px',
        minHeight: 0,
        height: 32,
    },
    table: {
        marginTop: theme.spacing.unit*2,
        borderTop: '1px solid rgba(224, 224, 224, 1)',
    },
    tableRow: {
        height: 36
    },
})

export default withStyles(styles)(FileList)
