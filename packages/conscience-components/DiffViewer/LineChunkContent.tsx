import React from 'react'
import classnames from 'classnames'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import SyntaxHighlighter from 'react-syntax-highlighter'
import parse from 'parse-diff'
import tinycolor from 'tinycolor2'
import { schemes } from 'conscience-lib/utils'

const syntaxStyle = {
    padding: 0,
    margin: 0,
    background: 'none',
    textShadow: 'none',
    border: 'none',
    boxShadow: 'none',
    // lineHeight: 'normal',
    // height: '1rem',
    tabSize: 4,
}

const codeTagProps = {
    style: {
        fontFamily: "Consolas, Menlo, Monaco, 'Courier New', sans-serif",
        fontWeight: 500,
        fontSize: '0.8rem',
    },
}

class LineChunkContent extends React.Component<Props>
{
    render() {
        const { classes, language, chunk } = this.props

        const scheme = schemes[this.props.codeColorScheme || Object.keys(schemes)[0]]
        const schemeDefaults = scheme['pre[class*="language-"]']
        const backgroundColor = (schemeDefaults || {}).background || '#ffffff'

        // @@TODO: cache these in State or maybe even map(schemes, () => add bgRed, bgGreen) -> memoize the schemes module
        let bgRed: string
        let bgGreen: string
        if (tinycolor(backgroundColor).isDark()) {
            bgRed = tinycolor.mix('#ff0000', backgroundColor, 90).toHexString()
            bgGreen = tinycolor.mix('#00ff00', backgroundColor, 90).toHexString()
        } else {
            bgRed = tinycolor.mix(red[100], backgroundColor, 50).toHexString()
            bgGreen = tinycolor.mix(green[100], backgroundColor, 50).toHexString()
        }
        return (
            <React.Fragment>
                <Table>
                    <TableBody>
                        {chunk.changes.map((change, i) => {
                            switch (change.type) {
                                case 'add':
                                    return (
                                        <TableRow key={i} className={classnames(classes.row, classes.added)}>
                                            <TableCell className={classnames(classes.cell, classes.lineNum, classes.lineNumAdd, classes.constrainWidth)}></TableCell>
                                            <TableCell className={classnames(classes.cell, classes.lineNum, classes.lineNumAdd, classes.constrainWidth)}><code>{change.ln}</code></TableCell>
                                            <TableCell className={classnames(classes.cell, classes.constrainWidth)}><code>+</code></TableCell>
                                            <TableCell className={classes.cell}>
                                                <div style={{ backgroundColor: bgGreen }}>
                                                    <SyntaxHighlighter style={scheme} language={language} customStyle={syntaxStyle} codeTagProps={codeTagProps as any}>
                                                        {change.content.replace('+', ' ')}
                                                    </SyntaxHighlighter>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                case 'del':
                                    return (
                                        <TableRow key={i} className={classnames(classes.row, classes.deleted)}>
                                            <TableCell className={classnames(classes.cell, classes.lineNum, classes.lineNumDel, classes.constrainWidth)}><code>{change.ln}</code></TableCell>
                                            <TableCell className={classnames(classes.cell, classes.lineNum, classes.lineNumDel, classes.constrainWidth)}><code></code></TableCell>
                                            <TableCell className={classnames(classes.cell, classes.constrainWidth)}><code>-</code></TableCell>
                                            <TableCell className={classes.cell}>
                                                <div style={{ backgroundColor: bgRed }}>
                                                    <SyntaxHighlighter style={scheme} language={language} customStyle={syntaxStyle} codeTagProps={codeTagProps as any}>
                                                        {change.content.replace('-', ' ')}
                                                    </SyntaxHighlighter>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                default:
                                    return (
                                        <TableRow key={i} className={classes.row}>
                                            <TableCell className={classnames(classes.cell, classes.lineNum, classes.constrainWidth)}><code>{change.ln1}</code></TableCell>
                                            <TableCell className={classnames(classes.cell, classes.lineNum, classes.constrainWidth)}><code>{change.ln2}</code></TableCell>
                                            <TableCell className={classnames(classes.cell, classes.constrainWidth)}></TableCell>
                                            <TableCell className={classes.cell}>
                                                <div style={{ backgroundColor }}>
                                                    <SyntaxHighlighter style={scheme} language={language} customStyle={syntaxStyle} codeTagProps={codeTagProps as any}>
                                                        {change.content}
                                                    </SyntaxHighlighter>
                                                </div>
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

interface Props {
    chunk: parse.Chunk
    codeColorScheme: string | undefined
    language: string | undefined
    classes: any
}

const styles = (theme: Theme) => createStyles({
    row: {
        height: 'auto', //'24px',
        border: 0,
        padding: 4,
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
    constrainWidth: {
        width: '1%',
        minWidth: 50,
    },
})

export default withStyles(styles)(LineChunkContent)
