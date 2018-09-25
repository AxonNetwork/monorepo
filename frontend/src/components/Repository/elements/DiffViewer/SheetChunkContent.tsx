import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

import {formatCell} from './diffUtils'

class SheetChunkContent extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        let {classes, chunk} = this.props
        const sheetIndex = chunk.changes[0].content.indexOf("]")
        const sheetName = chunk.changes[0].content.substring(2, sheetIndex)
        // change row string to array of cells
        const content = chunk.changes.map(change=>{
            return change.content.substring(sheetIndex+2).split("\t")
        })
        const colCount = content.reduce((acc, curr)=>Math.max(acc, curr.length),0) + 2
        return (
            <React.Fragment>
                <Table>
                    <TableBody>
                        {chunk.changes.map((change, i)=>{
                            switch (change.type) {
                                case  "add":
                                    return(
                                        <TableRow key={i} className={classes.row + " " + classes.added}>
                                            <TableCell width={1} className={classes.cell + " " + classes.lineNum + " " + classes.lineNumAdd}></TableCell>
                                            <TableCell width={1} className={classes.cell + " " + classes.lineNum + " " + classes.lineNumAdd}><code>{change.ln}</code></TableCell>
                                            {content[i].map((cell, i)=><TableCell width={1} key={i} className={classes.cell}><code>{formatCell(cell)}</code></TableCell>)}
                                        </TableRow>
                                    )
                                case  "del":
                                    return(
                                        <TableRow key={i} className={classes.row + " " + classes.deleted}>
                                            <TableCell width={1} className={classes.cell + " " + classes.lineNum + " " + classes.lineNumDel}><code>{change.ln}</code></TableCell>
                                            <TableCell width={1} className={classes.cell + " " + classes.lineNum + " " + classes.lineNumDel}><code></code></TableCell>
                                            {content[i].map((cell, i)=><TableCell width={1} key={i} className={classes.cell}><code>{formatCell(cell)}</code></TableCell>)}
                                        </TableRow>
                                    )
                                default:
                                    return(
                                        <TableRow key={i} className={classes.row}>
                                            <TableCell width={1} className={classes.cell + " " + classes.lineNum}><code>{change.ln1}</code></TableCell>
                                            <TableCell width={1} className={classes.cell + " " + classes.lineNum}><code>{change.ln2}</code></TableCell>
                                            {content[i].map((cell, i)=><TableCell width={1} key={i} className={classes.cell}><code>{formatCell(cell)}</code></TableCell>)}
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

SheetChunkContent.propTypes = {
    classes: PropTypes.object.isRequired,
    chunk: PropTypes.object.isRequired
}

const styles = theme => ({
    sheetName:{
        display:'block'
    },
    row:{
        height: '24px',
        border: 0,
    },
    cell:{
        border: "1px solid",
        borderColor: theme.palette.grey[300],
        padding: '0 4px',
    },
    codeTag:{
        backgroundColor: green[900]
    },
    pre:{
        whiteSpace: 'pre'
    },
    lineNum:{
        backgroundColor: theme.palette.grey[50],
        color: theme.palette.grey[500],
        fontSize: '9pt'
    },
    added:{
        backgroundColor: green[50],
    },
    lineNumAdd:{
        backgroundColor: green[100],
    },
    deleted:{
        backgroundColor: red[50]
    },
    lineNumDel:{
        backgroundColor: red[100],
    }

})

export default withStyles(styles)(SheetChunkContent)
