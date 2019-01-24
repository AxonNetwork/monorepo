import React from 'react'
import classnames from 'classnames'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import CodeViewer from 'conscience-components/CodeViewer'
import parse from 'parse-diff'
import tinycolor from 'tinycolor2'
import { schemes } from 'conscience-lib/utils'


class LineChunkContent extends React.Component<Props>
{
    render() {
        const { classes } = this.props

        const scheme = (schemes as any)[this.props.codeColorScheme || 'pojoaque']
        const schemeDefaults = scheme['pre[class*="language-"]']
        const backgroundColor = (schemeDefaults || {}).background || '#ffffff'
        console.log('scheme: ', this.props.codeColorScheme || 'pojoaque')

        // @@TODO: cache these in State or maybe even map(schemes, () => add bgRed, bgGreen) -> memoize the schemes module
        let bgRed: string
        let bgGreen: string
        console.log('bgcolor: ', backgroundColor)
        if (tinycolor(backgroundColor).isDark()) {
            console.log('isDark')
            bgRed = tinycolor.mix('#ff0000', backgroundColor, 90).toHexString()
            bgGreen = tinycolor.mix('#00ff00', backgroundColor, 90).toHexString()
        } else {
            console.log('isLight')
            bgRed = tinycolor.mix(red[100], backgroundColor, 50).toHexString()
            bgGreen = tinycolor.mix(green[100], backgroundColor, 50).toHexString()
        }
        return (
            <React.Fragment>
                <Table>
                    <TableBody>
                        {this.props.chunk.changes.map((change, i) => {
                            switch (change.type) {
                                case 'add':
                                    return (
                                        <TableRow key={i} className={classnames(classes.row, classes.added)}>
                                            <TableCell className={classnames(classes.cell, classes.lineNum, classes.lineNumAdd, classes.constrainWidth)}></TableCell>
                                            <TableCell className={classnames(classes.cell, classes.lineNum, classes.lineNumAdd, classes.constrainWidth)}><code>{change.ln}</code></TableCell>
                                            <TableCell className={classnames(classes.cell, classes.constrainWidth)}><code>+</code></TableCell>
                                            <TableCell className={classes.cell}>
                                                <CodeViewer
                                                    fileContents={' ' + change.content.slice(1)}
                                                    language={this.props.language || ''}
                                                    classes={{ codeContainer: classes.codeContainer }}
                                                    syntaxStyle={{ lineHeight: '1.3rem' }}
                                                    backgroundColor={bgGreen}
                                                />
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
                                                <CodeViewer
                                                    fileContents={' ' + change.content.slice(1)}
                                                    language={this.props.language || ''}
                                                    classes={{ codeContainer: classes.codeContainer }}
                                                    syntaxStyle={{ lineHeight: '1.3rem' }}
                                                    backgroundColor={bgRed}
                                                />
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
                                                <CodeViewer
                                                    fileContents={change.content}
                                                    language={this.props.language || ''}
                                                    classes={{ codeContainer: classes.codeContainer }}
                                                    syntaxStyle={{ lineHeight: '1.3rem' }}
                                                />
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
    codeContainer: {
        padding: 0,
        overflowX: 'unset',
    },
})

export default withStyles(styles)(LineChunkContent)
