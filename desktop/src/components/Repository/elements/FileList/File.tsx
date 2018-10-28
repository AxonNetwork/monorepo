import React from 'react'
import classnames from 'classnames'
import { withStyles, createStyles } from '@material-ui/core/styles'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import Tooltip from '@material-ui/core/Tooltip'
import FileIcon from './FileIcon'

import moment from 'moment'
import bytes from 'bytes'
import path from 'path'
const shell = (window as any).require('electron').shell

import autobind from 'utils/autobind'
import { IRepoFile } from '../../../../common'


@autobind
class File extends React.Component<Props>
{
    selectFile() {
        const isFolder = this.props.file.type === 'folder'
        this.props.selectFile({ selectedFile: { file: this.props.file.name, isFolder, editing: false } })
    }

    openItemWithSystemEditor(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation()
        console.log(this.props)
        shell.openItem(path.join(this.props.repoRoot, this.props.file.name))
    }

    openEditor(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation()
        this.props.selectFile({ selectedFile: { file: this.props.file.name, isFolder: false, editing: true } })
    }

    canQuickEdit() {
        // @@TODO: filetype standardization
        const extensions = [ '.md', '.markdown', '.mdown', '.txt' ]
        return this.props.file.type !== 'folder' && extensions.includes(path.extname(this.props.file.name).toLowerCase())
    }

    render() {
        const { file, selectFile, classes } = this.props
        const canClickFile = !!selectFile
        const name = path.basename(file.name)
        return (
            <React.Fragment>
                <TableRow hover={canClickFile} onClick={this.selectFile} className={classes.tableRow} classes={{ hover: classes.tableRowHover }}>
                    <TableCell scope="row" className={classes.tableCell}>
                        <div className={classes.listItem}>
                            <FileIcon fileType={file.type} status={file.status}/>
                            <Typography variant="subheading" className={classes.filename}>{name}</Typography>
                        </div>
                    </TableCell>
                    <TableCell className={classes.tableCell}>{bytes(file.size)}</TableCell>
                    <TableCell className={classes.tableCell}>{moment(file.modified).fromNow()}</TableCell>
                    <TableCell className={classnames(classes.tableCell, classes.tableCellActions)}>
                        {this.canQuickEdit() &&
                        <Tooltip title="Quick edit">
                            <IconButton onClick={this.openEditor} className={classes.editIconButton}><EditIcon /></IconButton>
                        </Tooltip>
                        }
                        <Tooltip title="Open this file with another app">
                            <IconButton onClick={this.openItemWithSystemEditor} className={classes.editIconButton}><OpenInNewIcon /></IconButton>
                        </Tooltip>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        )
    }
}

interface Props {
    file: IRepoFile
    repoRoot: string
    selectFile: Function
    classes: any
}

const styles = createStyles({
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
    tableRowHover: {
        '&:hover': {
            backgroundColor: 'rgba(124, 170, 255, 0.13) !important',
        },
    },

    // This is here so that it can be overridden by FileList or other parent components
    tableCell: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    tableCellActions: {
        textAlign: 'right',

        '& button': {
            marginLeft: 16,
        },
    },
})

export default withStyles(styles)(File)
