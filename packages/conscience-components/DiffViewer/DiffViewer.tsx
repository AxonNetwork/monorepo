import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import Button from '@material-ui/core/Button'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { URI } from 'conscience-lib/common'
import { IGlobalState } from '../redux'
import TextDiff from './TextDiff'
import BinaryDiff from './BinaryDiff'
import * as filetypes from 'conscience-lib/utils/fileTypes'
import { autobind } from 'conscience-lib/utils'
import { getFileURL } from 'conscience-components/navigation'
import { FileMode } from 'conscience-lib/common'
import parse from 'parse-diff'


@autobind
class DiffViewer extends React.Component<Props, State>
{
    state = {
        expanded: false,
    }

    toggleExpanded(_: any, expanded: boolean) {
        console.log('toggleExpanded', expanded)
        this.setState({ expanded })
    }

    render() {
        const { fileDiff, classes } = this.props
        if (!fileDiff) {
            return null
        }

        const isTextFile = this.props.uri.filename ? filetypes.isTextFile(this.props.uri.filename) : false

        let panelTitle: JSX.Element | null = null
        let badge: JSX.Element | null = null

        if (fileDiff.from && fileDiff.to) {
            if (fileDiff.new || fileDiff.from === '/dev/null') {
                // create file
                panelTitle = <div>{fileDiff.to}</div>
                badge = <div className={classes.labelNew}>(new)</div>

            } else if (fileDiff.deleted || fileDiff.to === '/dev/null') {
                // delete file
                panelTitle = <div>{fileDiff.from}</div>
                badge = <div className={classes.labelDeleted}>(deleted)</div>

            } else if (fileDiff.chunks.length === 0) {
                // rename only
                panelTitle = <div>{fileDiff.from} <ArrowRightAltIcon className={classes.renameArrow} /> {fileDiff.to}</div>
                badge = <div className={classes.labelNoChanges}>(no changes)</div>

            } else if (fileDiff.from === fileDiff.to) {
                // regular change
                panelTitle = <div>{fileDiff.to}</div>

            } else {
                // rename with regular change
                panelTitle = <div>{fileDiff.from} <ArrowRightAltIcon className={classes.renameArrow} /> {fileDiff.to}</div>
            }
        }

        const canExpand = (isTextFile && fileDiff.chunks.length > 0) || !isTextFile

        return (
            <ExpansionPanel
                expanded={this.state.expanded}
                onChange={this.toggleExpanded}
                className={classnames(classes.panel, { [classes.panelOpen]: this.state.expanded })}
            >
                <ExpansionPanelSummary expandIcon={canExpand ? <ExpandMoreIcon /> : null} classes={{ root: classes.summaryRoot }}>
                    <div className={classes.filename}>{panelTitle}</div>
                    {badge}
                    <Link to={getFileURL(this.props.uri, FileMode.View)}>
                        <Button classes={{ text: classes.viewButtonText, root: classes.viewButtonText }}>Open</Button>
                    </Link>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.detailsRoot }}>
                    {isTextFile && this.state.expanded &&
                        <TextDiff fileDiff={fileDiff} codeColorScheme={this.props.codeColorScheme} />
                    }
                    {!isTextFile && this.state.expanded &&
                        <BinaryDiff fileDiff={fileDiff} uri={this.props.uri} />
                    }
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    uri: URI
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
    summaryRoot: {
        fontWeight: 'bold',
        borderBottom: '1px solid rgba(0, 0, 0, 0.15)',
    },
    filename: {
        fontFamily: 'Consolas, Menlo, "Courier New", Courier, monospace',
        fontWeight: 400,
        flexGrow: 1,
        fontSize: '0.9rem',
        color: '#3e3e3e',
    },
    labelNew: {
        color: green[500],
    },
    labelDeleted: {
        color: red[500],
    },
    labelNoChanges: {
        whiteSpace: 'nowrap',
    },
    detailsRoot: {
        padding: 0,
        flexDirection: 'column',
        overflow: 'auto',
    },
    renameArrow: {
        verticalAlign: 'middle',
        fill: '#cecece',
    },
    viewButtonText: {
        padding: 'unset',
        minHeight: 'unset',
    },
})

const mapStateToProps = (state: IGlobalState) => {
    const { codeColorScheme } = state.user.userSettings
    return {
        codeColorScheme,
    }
}

export default connect(mapStateToProps, null)(withStyles(styles)(DiffViewer))
