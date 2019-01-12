import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import parse from 'parse-diff'

import { formatCell } from './diffUtils'


export interface SheetChunkContentProps {
    chunk: parse.Chunk
    classes: any
}

class SheetChunkContent extends React.Component<SheetChunkContentProps>
{
    render() {
        let { classes, chunk } = this.props
        const sheetIndex = chunk.changes[0].content.indexOf(']')
        // change row string to array of cells
        const content = chunk.changes.map((change: parse.Change) => {
            return change.content.substring(sheetIndex + 2).split('\t')
        })
        return (
            <React.Fragment>
                <Table>
                    <TableBody>
                        {chunk.changes.map((change: parse.Change, i: number) => {
                            switch (change.type) {
                                case 'add':
                                    return (
                                        <TableRow key={i} className={classes.row + ' ' + classes.added}>
                                            <TableCell className={classes.cell + ' ' + classes.lineNum + ' ' + classes.lineNumAdd}></TableCell>
                                            <TableCell className={classes.cell + ' ' + classes.lineNum + ' ' + classes.lineNumAdd}><code>{change.ln}</code></TableCell>
                                            {content[i].map((cell: string, i: number) =>
                                                <TableCell key={i} className={classes.cell}>
                                                    <code>{formatCell(cell)}</code>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    )
                                case 'del':
                                    return (
                                        <TableRow key={i} className={classes.row + ' ' + classes.deleted}>
                                            <TableCell className={classes.cell + ' ' + classes.lineNum + ' ' + classes.lineNumDel}><code>{change.ln}</code></TableCell>
                                            <TableCell className={classes.cell + ' ' + classes.lineNum + ' ' + classes.lineNumDel}><code></code></TableCell>
                                            {content[i].map((cell: string, i: number) =>
                                                <TableCell key={i} className={classes.cell}>
                                                    <code>{formatCell(cell)}</code>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    )
                                default:
                                    return (
                                        <TableRow key={i} className={classes.row}>
                                            <TableCell className={classes.cell + ' ' + classes.lineNum}><code>{change.ln1}</code></TableCell>
                                            <TableCell className={classes.cell + ' ' + classes.lineNum}><code>{change.ln2}</code></TableCell>
                                            {content[i].map((cell: string, i: number) =>
                                                <TableCell key={i} className={classes.cell}>
                                                    <code>{formatCell(cell)}</code>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    )
                            }
                        })}
                    </TableBody>
                </Table>
            </React.Fragment>
        )
    }
}

const styles = (theme: Theme) => createStyles({
    sheetName: {
        display: 'block',
    },
    row: {
        height: '24px',
        border: 0,
    },
    cell: {
        border: '1px solid',
        borderColor: theme.palette.grey[300],
        padding: '0 4px',
    },
    codeTag: {
        backgroundColor: green[900],
    },
    pre: {
        whiteSpace: 'pre',
    },
    lineNum: {
        backgroundColor: theme.palette.grey[50],
        color: theme.palette.grey[500],
        fontSize: '9pt',
    },
    added: {
        backgroundColor: green[50],
    },
    lineNumAdd: {
        backgroundColor: green[100],
    },
    deleted: {
        backgroundColor: red[50],
    },
    lineNumDel: {
        backgroundColor: red[100],
    },

})

export default withStyles(styles)(SheetChunkContent)
