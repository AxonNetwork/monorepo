import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt'
import parse from 'parse-diff'


class BinaryDiff extends React.Component<Props>
{
    render() {
        const { classes, fileDiff } = this.props

        if (!fileDiff) {
            return null
        }

        let panelTitle: JSX.Element | null = null
        if (fileDiff.from && fileDiff.to) {
            if (fileDiff.new || fileDiff.from === '/dev/null') {
                panelTitle = <div><span className={classes.labelNew}>(new)</span> {fileDiff.to}</div>
            } else if (fileDiff.deleted || fileDiff.to === '/dev/null') {
                panelTitle = <div><span className={classes.labelDeleted}>(deleted)</span> {fileDiff.from}</div>
            } else if (fileDiff.from === fileDiff.to) {
                panelTitle = <div>{fileDiff.to}</div>
            } else {
                panelTitle = <div>{fileDiff.from} <ArrowRightAltIcon className={classes.renameArrow} /> {fileDiff.to}</div>
            }
        }

        return (
            <ExpansionPanel expanded={false} className={classes.panel}>
                <ExpansionPanelSummary expandIcon={null} classes={{ root: classes.summaryRoot }}>
                    <div className={classes.filename}>{panelTitle}</div>
                </ExpansionPanelSummary>
            </ExpansionPanel>
        )

        // const changes = file.chunks.reduce((acc: parse.Change[], curr: parse.Chunk) => {
        //     return acc.concat(curr.changes)
        // }, [])
        // const chunkCounts = changes.filter((ch: any) => ch.content.indexOf('chunks') > -1)
        // const chunkTotal = parseInt(chunkCounts[chunkCounts.length - 1].content.split(' ')[1])
        // const adds = changes.filter((ch: any) => ch.add)
        // const dels = changes.filter((ch: any) => ch.del)

        // let chunks = []
        // for (let i = 3; i < (chunkTotal + 3); i++) {
        //     let changed = false
        //     if (adds.some(((ch: any) => ch.ln && ch.ln === i))) {
        //         chunks.push('add')
        //         changed = true
        //     }
        //     if (dels.some(((ch: any) => ch.ln && ch.ln === i))) {
        //         chunks.push('del')
        //         changed = true
        //     }
        //     if (!changed) {
        //         chunks.push('normal')
        //     }
        // }
        // return (
        //     <Card className={classes.card}>
        //         <CardContent>
        //             <code className={classes.header}>{`${file.to}: ${chunkTotal} chunks: ${adds.length} added and ${dels.length} deleted`}</code>
        //             {chunks.map((ch, i) => {
        //                 let chunkClass = classes.chunk
        //                 if (ch === 'add') { chunkClass = chunkClass + ' ' + classes.add }
        //                 if (ch === 'del') { chunkClass = chunkClass + ' ' + classes.del }
        //                 return <div key={i} className={chunkClass}></div>
        //             })}
        //         </CardContent>
        //     </Card>
        // )
    }
}

interface Props {
    fileDiff: parse.File
    classes: any
}

const styles = (theme: Theme) => createStyles({
    // chunk: {
    //     width: 16,
    //     height: 16,
    //     display: 'inline-block',
    //     margin: 2,
    //     border: '1px solid',
    //     borderColor: theme.palette.grey[900],
    //     backgroundColor: theme.palette.grey[200],
    // },
    // add: {
    //     backgroundColor: green[500],
    // },
    // del: {
    //     backgroundColor: red[500],
    // },
    // header: {
    //     color: theme.palette.secondary.main,
    //     fontWeight: 'bold',
    //     display: 'block',
    //     marginBottom: 16,
    // },
    panel: {
        '&:before': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
        },
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    summaryRoot: {
        fontWeight: 'bold',
        borderBottom: '1px solid rgba(0, 0, 0, 0.15)',
    },
    filename: {
        fontFamily: 'Consolas, Menlo, "Courier New", Courier, monospace',
        fontWeight: 400,
    },
    labelNew: {
        color: green[500],
    },
    labelDeleted: {
        color: red[500],
    },
    renameArrow: {
        verticalAlign: 'middle',
    },
})

export default withStyles(styles)(BinaryDiff)
