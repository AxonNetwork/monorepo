import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
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
                <Breadcrumbs repoRoot={this.props.repoRoot} selectedFolder={selectedFolder} />

                {names.length === 0 &&
                    <div className={classes.emptyRepoText}>
                        <Typography>There's nothing here yet.</Typography>
                        <Typography>
                            <span>Start by adding files to your </span>
                            <a href="#"
                                onClick={() => shell.openItem(this.props.repoRoot)}
                                className={classes.link}
                            >
                                Repository Folder
                            </a>
                        </Typography>
                    </div>
                }
                {names.length > 0 &&
                    <Card className={classes.fileListCard}>
                        <CardContent className={classes.fileListCardContent}>
                            <Table className={classes.table}>
                                <TableBody>
                                    {names.map((name) => {
                                        const file = files[name]
                                        return (
                                            <File
                                                file={file}
                                                repoRoot={this.props.repoRoot}
                                                key={name}
                                                selectFile={this.props.selectFile}
                                                classes={{ tableRow: classes.tableRow, tableCell: classes.tableCell }}
                                            />
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                }
            </React.Fragment>
        )
    }
}

interface Props {
    repoRoot: string
    files: {[name: string]: IRepoFile}
    selectedFolder: string | undefined
    selectFile: Function
    classes: any
}

const styles = (theme: Theme) => createStyles({
    fileListCard: {
        margin: '15px 5px 5px 5px',
        padding: 0,
    },
    fileListCardContent: {
        cursor: 'pointer',

        '&:last-child': {
            padding: 0,
            margin: '10px 0',
        },
    },
    button: {
        textTransform: 'none',
        fontSize: '12pt',
        padding: '5px 16px',
        minHeight: 0,
        height: 32,
    },
    table: {
        // marginTop: theme.spacing.unit * 2,
        // borderTop: '1px solid rgba(224, 224, 224, 1)',
    },
    tableRow: {
        height: 36,
    },
    tableCell: {
        borderBottom: 'none',
    },
    emptyRepoText: {
        marginTop: theme.spacing.unit * 2,
        '& p': {
            marginTop: theme.spacing.unit * 2,
        },
    },
    link: {
        color: theme.palette.secondary.main,
    },
})

export default withStyles(styles)(FileList)
