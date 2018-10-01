import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import LineChunkContent from './LineChunkContent'
import SheetChunkContent from './SheetChunkContent'
import autobind from 'utils/autobind'
import parse from 'parse-diff'

@autobind
class TextDiff extends React.Component<Props, State>
{
    state = {
        expanded: false,
    }

    handleChange(_: any, expanded: boolean) {
        this.setState({ expanded })
    }

    render() {
        const { filename, type, chunks, classes } = this.props
        // const changes = chunk.changes.reduce((acc:any, curr:parse.NormalChange|parse.AddChange|parse.DeleteChange) => {
        //     if (curr.content[0] === '+') { acc.add++ }
        //     if (curr.content[0] === '-') { acc.del++ }
        //     return acc
        // }, {add: 0, del: 0})
        return (
            <ExpansionPanel onChange={this.handleChange}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} classes={{ root: classes.summaryRoot }}>
                    <Typography className={classes.filename}>{filename /*+ ': Added ' + changes.add + ' and deleted ' + changes.del + ' around line ' + chunk.newStart*/}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{root: classes.detailsRoot}}>
                    {this.state.expanded &&
                        chunks.map(chunk => (
                            <React.Fragment>
                                <div>
                                    {type === 'text' &&
                                        <div className={classes.overflow}>
                                            <LineChunkContent chunk={chunk} />
                                        </div>
                                    }
                                    {type === 'data' &&
                                        <SheetChunkContent chunk={chunk} />
                                    }
                                </div>
                                <div className={classes.diffBreakMarker}>...</div>
                            </React.Fragment>
                        ))
                    }
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

interface Props {
    filename: string
    type: string
    chunks: parse.Chunk[]
    classes: any
}

interface State {
    expanded: boolean
}

const styles = () => createStyles({
    row: {
        height: '24px',
        border: 0,
    },
    summaryRoot: {
        // backgroundColor: theme.palette.background.default,
        // color: theme.palette.secondary.main,
        fontWeight: 'bold',
    },
    filename: {
        fontFamily: 'Consolas, Menlo, "Courier New", Courier, monospace',
    },
    detailsRoot: {
        padding: 0,
        flexDirection: 'column',
    },
    diffBreakMarker: {
        padding: 15,
        backgroundColor: '#eff7ff',
    },
    button: {
        textTransform: 'none',
    },
})

export default withStyles(styles)(TextDiff)
