import path from 'path'
import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import parse from 'parse-diff'
import { IGlobalState } from 'conscience-components/redux'

import LineChunkContent from './LineChunkContent'
import SheetChunkContent from './SheetChunkContent'
import { autobind } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'

@autobind
class TextDiff extends React.Component<Props, State>
{
    state = {
        expanded: false,
    }

    handleChange(_: any, expanded: boolean) {
        console.log('handleChange', expanded)
        this.setState({ expanded })
    }

    render() {
        const { filename, chunks, classes } = this.props
        const language = filetypes.getLanguage(filename)
        const type = filetypes.getType(filename)
        // const changes = chunk.changes.reduce((acc:any, curr:parse.NormalChange|parse.AddChange|parse.DeleteChange) => {
        //     if (curr.content[0] === '+') { acc.add++ }
        //     if (curr.content[0] === '-') { acc.del++ }
        //     return acc
        // }, {add: 0, del: 0})
        return (
            <ExpansionPanel className={classnames(classes.panel, { [classes.panelOpen]: this.state.expanded })} onChange={this.handleChange}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} classes={{ root: classes.summaryRoot }}>
                    <Typography className={classes.filename}>{filename /*+ ': Added ' + changes.add + ' and deleted ' + changes.del + ' around line ' + chunk.newStart*/}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.detailsRoot }}>
                    {this.state.expanded &&
                        chunks.map((chunk, i) => (
                            <React.Fragment>
                                <div className={classes.line}>
                                    {type === 'text' &&
                                        <LineChunkContent chunk={chunk} codeColorScheme={this.props.codeColorScheme} language={language} />
                                    }
                                    {type === 'data' &&
                                        <SheetChunkContent chunk={chunk} />
                                    }
                                </div>
                                {i < chunks.length - 1 &&
                                    <div className={classes.diffBreakMarker}>...</div>
                                }
                            </React.Fragment>
                        ))
                    }
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    filename: string
    chunks: parse.Chunk[]
}

interface StateProps {
    codeColorScheme?: string | undefined
}

interface State {
    expanded: boolean
}

const styles = (theme: Theme) => createStyles({
    panel: {
        '&:before': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
        },
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    panelOpen: {
        margin: '20px 0',
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    row: {
        height: '24px',
        border: 0,
    },
    summaryRoot: {
        // backgroundColor: theme.palette.background.default,
        // color: theme.palette.secondary.main,
        fontWeight: 'bold',
        borderBottom: '1px solid rgba(0, 0, 0, 0.15)',
    },
    filename: {
        fontFamily: 'Consolas, Menlo, "Courier New", Courier, monospace',
    },
    detailsRoot: {
        padding: 0,
        flexDirection: 'column',
        overflow: 'auto',
    },
    diffBreakMarker: {
        padding: 15,
        backgroundColor: '#eff7ff',
    },
    button: {
        textTransform: 'none',
    },
})

const mapStateToProps = (state: IGlobalState) => {
    return {
        codeColorScheme: state.user.userSettings.codeColorScheme,
    }
}

export default connect(mapStateToProps, null)(withStyles(styles)(TextDiff))
