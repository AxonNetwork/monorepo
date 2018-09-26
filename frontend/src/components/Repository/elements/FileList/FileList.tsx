import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'

import { filterSubfolder, mergeFolders, sortFolders } from './fileListUtils'

import File from './File'
import Breadcrumbs from './Breadcrumbs'
import { IRepoFile } from '../../../../common'


export interface FileListProps {
    folderPath: string
    files: {[name: string]: IRepoFile}
    selectedFolder: string
    selectFile: Function
    classes: any
}

class FileList extends React.Component<FileListProps> {
    render() {
        let {classes, files, selectedFolder} = this.props
        if (selectedFolder !== undefined) {
            files = filterSubfolder(files, selectedFolder)
        }
        files = mergeFolders(files)
        const names = sortFolders(files)
        return (
            <React.Fragment>
                <Breadcrumbs
                    folderPath={this.props.folderPath}
                    selectedFolder={selectedFolder}
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

const styles = (theme: Theme) => createStyles({
    button: {
        textTransform: 'none',
        fontSize: '12pt',
        padding: '5px 16px',
        minHeight: 0,
        height: 32,
    },
    table: {
        marginTop: theme.spacing.unit * 2,
        borderTop: '1px solid rgba(224, 224, 224, 1)',
    },
    tableRow: {
        height: 36,
    },
})

export default withStyles(styles)(FileList)
