import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/styles/hljs'
import parse from 'parse-diff'

export interface LineChunkContentProps {
    chunk: parse.Chunk
    classes: any
}

class LineChunkContent extends React.Component<LineChunkContentProps>
{
    render() {
        const {classes, chunk} = this.props
        const syntaxStyle = {padding: 0, margin: 0, background: 'none'}
        const codeTagProps = { style: { fontFamily: "Consolas, Monaco, 'Courier New', sans-serif", fontWeight: 500, fontSize: '0.7rem' } }
        return (
            <React.Fragment>
                <Table>
                    <TableBody>
                        {chunk.changes.map((change: parse.Change, i: number) => {
                            switch (change.type) {
                                case  'add':
                                    return(
                                        <TableRow key={i} className={classes.row + ' ' + classes.added}>
                                            <TableCell className={classes.cell + ' ' + classes.lineNum + ' ' + classes.lineNumAdd}></TableCell>
                                            <TableCell className={classes.cell + ' ' + classes.lineNum + ' ' + classes.lineNumAdd}><code>{change.ln}</code></TableCell>
                                            <TableCell className={classes.cell}><code>+</code></TableCell>
                                            <TableCell className={classes.cell}>
                                                <SyntaxHighlighter style={docco} customStyle={syntaxStyle} codeTagProps={codeTagProps as any}>
                                                    {change.content.replace('+', ' ')}
                                                </SyntaxHighlighter>
                                            </TableCell>
                                        </TableRow>
                                    )
                                case  'del':
                                    return(
                                        <TableRow key={i} className={classes.row + ' ' + classes.deleted}>
                                            <TableCell className={classes.cell + ' ' + classes.lineNum + ' ' + classes.lineNumDel}><code>{change.ln}</code></TableCell>
                                            <TableCell className={classes.cell + ' ' + classes.lineNum + ' ' + classes.lineNumDel}><code></code></TableCell>
                                            <TableCell className={classes.cell}><code>-</code></TableCell>
                                            <TableCell className={classes.cell}>
                                                <SyntaxHighlighter style={docco} customStyle={syntaxStyle} codeTagProps={codeTagProps as any}>
                                                    {change.content.replace('-', ' ')}
                                                </SyntaxHighlighter>
                                            </TableCell>
                                        </TableRow>
                                    )
                                default:
                                    return(
                                        <TableRow key={i} className={classes.row}>
                                            <TableCell className={classes.cell + ' ' + classes.lineNum}><code>{change.ln1}</code></TableCell>
                                            <TableCell className={classes.cell + ' ' + classes.lineNum}><code>{change.ln2}</code></TableCell>
                                            <TableCell className={classes.cell}></TableCell>
                                            <TableCell className={classes.cell}>
                                                <SyntaxHighlighter style={docco} customStyle={syntaxStyle} codeTagProps={codeTagProps as any}>
                                                    {change.content}
                                                </SyntaxHighlighter>
                                            </TableCell>
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
    row: {
        height: '24px',
        border: 0,
    },
    cell: {
        border: 0,
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

export default withStyles(styles)(LineChunkContent)
