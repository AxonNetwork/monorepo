import memoize from 'lodash/memoize'
import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import parse from 'parse-diff'
import tinycolor from 'tinycolor2'
import classnames from 'classnames'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import CodeViewer from 'conscience-components/CodeViewer'
import { autobind, schemes } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'

const getBlendedRedGreen = memoize(function(backgroundColor: string) {
    let bgRed: string
    let bgGreen: string
    if (tinycolor(backgroundColor).isDark()) {
        bgRed = tinycolor.mix('#ff0000', backgroundColor, 90).toHexString()
        bgGreen = tinycolor.mix('#00ff00', backgroundColor, 90).toHexString()
    } else {
        bgRed = tinycolor.mix(red[100], backgroundColor, 50).toHexString()
        bgGreen = tinycolor.mix(green[100], backgroundColor, 50).toHexString()
    }
    return [bgRed, bgGreen]
})

@autobind
class TextDiff extends React.Component<Props, State>
{
    render() {
        const { fileDiff, classes } = this.props
        const language = fileDiff.to ? filetypes.getLanguage(fileDiff.to) : undefined

        const scheme = (schemes as any)[this.props.codeColorScheme || 'pojoaque']
        const schemeDefaults = scheme['pre[class*="language-"]']
        const backgroundColor = (schemeDefaults || {}).background || '#ffffff'

        let [bgRed, bgGreen] = getBlendedRedGreen(backgroundColor)

        return (
            <React.Fragment>
                {fileDiff.chunks.map((chunk, i) => (
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
                                                        <CodeViewer
                                                            fileContents={' ' + change.content.slice(1)}
                                                            language={language || ''}
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
                                                            language={language || ''}
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
                                                            language={language || ''}
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

                        {i < fileDiff.chunks.length - 1 &&
                            <div className={classes.diffBreakMarker}>...</div>
                        }
                    </React.Fragment>
                ))}
            </React.Fragment>
        )
    }
}

type Props = OwnProps & { classes: any }

interface OwnProps {
    fileDiff: parse.File
    codeColorScheme?: string | undefined
}

interface State {
    expanded: boolean
}

const styles = (theme: Theme) => createStyles({
    diffBreakMarker: {
        padding: 15,
        backgroundColor: '#eff7ff',
    },

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

export default withStyles(styles)(TextDiff)
