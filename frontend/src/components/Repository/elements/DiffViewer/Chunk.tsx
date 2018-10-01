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
class Chunk extends React.Component<Props, State>
{
    state = {
        expanded: true,
    }

    handleChange(_: any, expanded: boolean) {
        this.setState({ expanded })
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
                <ExpansionPanel onChange={this.handleChange} defaultExpanded>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} classes={{ root: classes.summaryRoot }}>
                        <Typography>{filename + ': Added ' + changes.add + ' and deleted ' + changes.del + ' around line ' + chunk.newStart}</Typography>
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

interface Props {
    filename: string
    type: string
    chunk: parse.Chunk
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
    detailsRoot: {
        padding: 0,
    },
    button: {
        textTransform: 'none',
    },
})

export default withStyles(styles)(Chunk)
