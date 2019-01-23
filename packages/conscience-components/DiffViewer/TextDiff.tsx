import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt'
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
        const { fileDiff, classes } = this.props
        const language = fileDiff.to ? filetypes.getLanguage(fileDiff.to) : undefined
        const type = fileDiff.to ? filetypes.getType(fileDiff.to) : undefined

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
            <ExpansionPanel className={classnames(classes.panel, { [classes.panelOpen]: this.state.expanded })} onChange={this.handleChange}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} classes={{ root: classes.summaryRoot }}>
                    <div className={classes.filename}>{panelTitle}</div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.detailsRoot }}>
                    {this.state.expanded &&
                        fileDiff.chunks.map((chunk, i) => (
                            <React.Fragment>
                                <div className={classes.line}>
                                    {type === 'text' &&
                                        <LineChunkContent chunk={chunk} codeColorScheme={this.props.codeColorScheme} language={language} />
                                    }
                                    {type === 'data' &&
                                        <SheetChunkContent chunk={chunk} />
                                    }
                                </div>
                                {i < fileDiff.chunks.length - 1 &&
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
    fileDiff: parse.File
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
        fontWeight: 400,
    },
    labelNew: {
        color: green[500],
    },
    labelDeleted: {
        color: red[500],
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
    renameArrow: {
        verticalAlign: 'middle',
        fill: '#cecece',
    },
})

const mapStateToProps = (state: IGlobalState) => {
    return {
        codeColorScheme: state.user.userSettings.codeColorScheme,
    }
}

export default connect(mapStateToProps, null)(withStyles(styles)(TextDiff))
