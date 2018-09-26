import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import LineChunkContent from './LineChunkContent'
import SheetChunkContent from './SheetChunkContent'
import autobind from 'utils/autobind'
import parse from 'parse-diff'

export interface ChunkProps {
    filename: string
    type: string
    chunk: parse.Chunk
    classes: any
}

export interface ChunkState {
    expanded: boolean
}

@autobind
class Chunk extends React.Component<ChunkProps, ChunkState>
{
    state = {
        expanded: false
    }

    handleChange = (_: any, expanded: boolean) => {
        this.setState({expanded: expanded})
    }

    render() {
        const { filename, type, chunk, classes } = this.props
        const changes = chunk.changes.reduce((acc:any, curr:parse.NormalChange|parse.AddChange|parse.DeleteChange) => {
            if (curr.content[0] === '+') { acc.add++ }
            if (curr.content[0] === '-') { acc.del++ }
            return acc
        }, {add: 0, del: 0})
        return (
            <React.Fragment>
                <ExpansionPanel onChange={this.handleChange}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} classes={{root: classes.summaryRoot}}>
                        <code>{filename + ': Added ' + changes.add + ' and deleted ' + changes.del + ' around line ' + chunk.newStart}</code>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails classes={{root: classes.detailsRoot}}>
                        {this.state.expanded &&
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
                        }
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </React.Fragment>
        )
    }
}

const styles = (theme: Theme) => createStyles({
    row: {
        height: '24px',
        border: 0,
    },
    summaryRoot: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.secondary.main,
        fontWeight: 'bold',
    },
    detailsRoot: {
        padding: 0,
    },
    button: {
        textTransform: 'none',
    },
})

export default withStyles(styles)(Chunk)
