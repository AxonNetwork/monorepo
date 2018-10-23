import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import Typography from '@material-ui/core/Typography'

const shell = (window as any).require('electron').shell
import { filterSubfolder, mergeFolders, sortFolders } from './fileListUtils'

import File from './File'
import Breadcrumbs from './Breadcrumbs'
import { IRepoFile } from '../../../../common'


class FileList extends React.Component<Props>
{
    render() {
        let { classes, files, selectedFolder } = this.props
        if (selectedFolder !== undefined) {
            files = filterSubfolder(files, selectedFolder)
        }
        files = mergeFolders(files, selectedFolder)
        const names = sortFolders(files)
        return (
            <React.Fragment>
                <Breadcrumbs
                    repoRoot={this.props.repoRoot}
                    selectedFolder={selectedFolder}
                    selectFile={this.props.selectFile}
                />
                {names.length === 0 &&
                    <div className={classes.emptyRepoText}>
                        <Typography>There's nothing here yet.</Typography>
                        <Typography>
                            <span>Start by adding files to your </span>
                            <a href="#"
                                onClick={()=>shell.openItem(this.props.repoRoot)}
                                className={classes.link}
                            >
                                Repository Folder
                            </a>
                        </Typography>
                    </div>
                }
                <Table className={classes.table}>
                    <TableBody>
                        {
                            names.map((name) => {
                                const file = files[name]
                                return (
                                    <File
                                        file={file}
                                        repoRoot={this.props.repoRoot}
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

interface Props {
    repoRoot: string
    files: {[name: string]: IRepoFile}
    selectedFolder: string|undefined
    selectFile: Function
    classes: any
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
    emptyRepoText: {
        marginTop: theme.spacing.unit * 2,
        '& p': {
            marginTop: theme.spacing.unit * 2
        }
    },
    link: {
        color: theme.palette.secondary.main
    }
})

export default withStyles(styles)(FileList)
