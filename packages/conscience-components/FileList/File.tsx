import isEqual from 'lodash/isEqual'
import React from 'react'
import classnames from 'classnames'
import { withStyles, createStyles } from '@material-ui/core/styles'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Typography from '@material-ui/core/Typography'
import deepOrange from '@material-ui/core/colors/deepOrange'
import Tooltip from '@material-ui/core/Tooltip'
import FileIcon from './FileIcon'
import FileButtons from './FileButtons'

import moment from 'moment'
import bytes from 'bytes'
import path from 'path'

import { IRepoFile, FileMode, URI, URIType } from 'conscience-lib/common'
import { parseMergeConflict } from 'conscience-lib/utils'
import autobind from 'conscience-lib/utils/autobind'
import * as filetypes from 'conscience-lib/utils/fileTypes'
import { selectFile } from 'conscience-components/navigation'
import { getFileContents } from 'conscience-components/env-specific'


@autobind
class File extends React.Component<Props, State>
{
    state = {
        mergeConflict: false
    }

    async componentDidMount() {
        if (this.props.uri.type === URIType.Local) {
            if (this.props.file.mergeConflict) {
                const contents = (await getFileContents(this.props.uri, { as: 'string' })) as string
                const chunks = parseMergeConflict(contents)
                if (chunks.length > 1) {
                    this.setState({ mergeConflict: true })
                }
            }
        }
    }

    selectFile() {
        if (this.state.mergeConflict) {
            selectFile(this.props.uri, FileMode.ResolveConflict)
        } else {
            selectFile(this.props.uri, FileMode.View)
        }
    }

    openItemWithSystemEditor(e: React.MouseEvent<HTMLElement>) {
        if (this.props.uri.type === URIType.Network) {
            throw new Error('network URIs cannot be opened locally')
        }

        e.stopPropagation()
        const shell = (window as any).require('electron').shell
        shell.openItem(path.join(this.props.uri.repoRoot, this.props.file.name))
    }

    openEditor(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation()
        selectFile(this.props.uri, FileMode.Edit)
    }

    canQuickEdit() {
        if (!this.props.canEditFiles || this.props.file.type === 'folder') {
            return false
        }
        return filetypes.isTextFile(this.props.file.name)

        // const editors = filetypes.getEditors(this.props.file.name)
        // return editors.length > 0
    }

    render() {
        const { file, classes } = this.props
        if (!file || !file.name) {
            console.error('file.name is undefined', file)
            return null
        }
        if (file.status === 'D') {
            return null
        }
        const name = this.props.showFullPaths ? file.name : path.basename(file.name)

        let displayname: string
        if (this.props.fileExtensionsHidden) {
            const parts = name.split('.')
            displayname = (parts.length > 1) ? parts.slice(0, -1).join('.') : parts[0]
        } else {
            displayname = name
        }

        const isLocal = this.props.uri.type === URIType.Local

        const fileRow = (
            <TableRow
                hover
                onClick={this.selectFile}
                className={classnames(classes.tableRow, this.state.mergeConflict ? classes.mergeConflict : '')}
                classes={{ hover: this.state.mergeConflict ? classes.mergeConflictHover : classes.tableRowHover }}
            >
                <TableCell scope="row" className={classes.tableCell}>
                    <div className={classes.listItem}>
                        <FileIcon filename={file.name} isFolder={file.type === 'folder'} status={file.status} />
                        <Typography variant="subheading" className={classes.filename}>{displayname}</Typography>
                    </div>
                </TableCell>
                <TableCell className={classnames(classes.tableCell, classes.tableCellAlignRight)}>{bytes(file.size)}</TableCell>
                <TableCell className={classnames(classes.tableCell, classes.tableCellAlignRight)}>{moment(file.modified).fromNow()}</TableCell>
                {isLocal &&
                    <TableCell className={classnames(classes.tableCell, classes.tableCellAlignRight, classes.tableCellActions)}>
                        <FileButtons
                            uri={this.props.uri}
                            file={this.props.file}
                            canEditFiles={this.props.canEditFiles}
                        />
                    </TableCell>
                }
            </TableRow>
        )
        if (this.state.mergeConflict) {
            return (
                <Tooltip title="This file has a merge conflict. Click to resolve.">
                    {fileRow}
                </Tooltip>
            )
        } else {
            return fileRow
        }
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return !isEqual(this.props.uri, nextProps.uri) ||
            this.props.file.name !== nextProps.file.name ||
            this.props.fileExtensionsHidden !== nextProps.fileExtensionsHidden ||
            this.props.canEditFiles !== nextProps.canEditFiles ||
            this.props.showFullPaths !== nextProps.showFullPaths ||
            this.state.mergeConflict !== nextState.mergeConflict
    }
}

interface State {
    mergeConflict: boolean
}

type Props = OwnProps & { classes: any }

interface OwnProps {
    uri: URI
    file: IRepoFile
    fileExtensionsHidden: boolean | undefined
    canEditFiles?: boolean
    showFullPaths?: boolean
}

const styles = createStyles({
    listItem: {
        display: 'flex',
        padding: 0,
    },
    filename: {
        padding: '0 16px',
        textOverflow: 'ellipsis',
        maxWidth: '100%',
        overflow: 'hidden',
    },
    tableRow: {
        height: 36,
    },
    tableRowHover: {
        '&:hover': {
            backgroundColor: 'rgba(124, 170, 255, 0.13) !important',
        },
    },
    mergeConflict: {
        backgroundColor: deepOrange[300]
    },
    mergeConflictHover: {
        '&:hover': {
            backgroundColor: deepOrange[400] + " !important"
        }
    },
    tableCell: {
        borderBottom: 'none',
        maxWidth: 680,
        paddingRight: 20,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    tableCellAlignRight: {
        textAlign: 'right',
    },
    tableCellActions: {
        '& button': {
            marginLeft: 16,
        },
    },
})

export default withStyles(styles)(File)
