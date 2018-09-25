import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'

import moment from 'moment'

import EventTitle from './EventTitle'
import RevertFilesDialog from './RevertFilesDialog'
import DiffViewer from '../DiffViewer/DiffViewer'

class TimelineEvent extends Component
{
    state = {
        openDialog: false,
        showDiff: false
    }

    constructor(props) {
        super(props)

        this.handleClick = this.handleClick.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.toggleDiff = this.toggleDiff.bind(this)
    }

    handleClick(event) {
        this.setState({ openDialog: true })
    }

    handleClose() {
        this.setState({ openDialog: false })
    }

    toggleDiff() {
        const event = this.props.event
        for (let i=0; i<event.files.length; i++) {
            this.props.getDiff(this.props.folderPath, event.files[i], event.commit)
        }
        this.setState({showDiff: !this.state.showDiff})
    }

    render() {
        const classes = this.props.classes
        const event = this.props.event
        const diffs = event.diffs || {}
        const userInitials = event.user.split(' ').map(x => x.substring(0, 1)).join('')
        return (
            <React.Fragment>
                <div className={classes.event}>
                    <IconButton className={classes.menuButton} onClick={this.handleClick}>
                        <MoreVertIcon />
                    </IconButton>
                    <div className={classes.topline}></div>
                    <div className={classes.eventIconContainer}>
                        <Avatar className={classes.avatar}>{userInitials}</Avatar>
                    </div>
                    <div className={classes.eventDescription}>
                        <Typography className={classes.title}>
                            <EventTitle
                                version={event.version}
                                user={event.user}
                                files={event.files}
                            />
                        </Typography>
                        <Typography className={classes.date}>
                            {moment(event.time).calendar()}
                        </Typography>
                        <Typography className={classes.message}>
                            {event.message}
                        </Typography>
                        <Typography className={classes.seeDiff} onClick={this.toggleDiff}>
                            {!this.state.showDiff &&
                                <span>Show differences (from current version) <ArrowDropDownIcon className={classes.arrowIcon}/></span>
                            }
                            {this.state.showDiff &&
                                <span>Hide differences <ArrowDropUpIcon className={classes.arrowIcon}/></span>
                            }
                        </Typography>

                    </div>
                    {this.state.showDiff &&
                        <div className={classes.diffContainer}>
                            {Object.keys(diffs).length == 0 &&
                                <Typography>Loading...</Typography>
                            }
                            {Object.keys(diffs).length > 0 && !Object.keys(diffs).some(d=>diffs[d] !== '') &&
                                <Typography>No differences</Typography>
                            }
                            {Object.keys(diffs).map(((d, i) => {
                                return (
                                    <DiffViewer
                                        key={i}
                                        diff={diffs[d]}
                                        type="text"
                                    />
                                )

                            }).bind(this))}
                        </div>
                    }
                </div>

            <RevertFilesDialog
                event={this.props.event}
                folderPath={this.props.folderPath}
                revertFiles={this.props.revertFiles}
                open={this.state.openDialog}
                onClose={this.handleClose}
            />
            </React.Fragment>
        )
    }
}

TimelineEvent.propTypes = {
    getDiff: PropTypes.func.isRequired,
    revertFiles: PropTypes.func.isRequired,
    event: PropTypes.object.isRequired,
    folderPath: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired
}

const styles = theme => ({
    event: {
        position: 'relative',
        paddingTop:'24px',
        marginLeft: '24px',
    },
    topline: {
        position: 'absolute',
        left: 19,
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: theme.palette.grey[400],
    },
    eventIconContainer: {
        position: 'absolute',
        top: '32px',
        zIndex: 1
    },
    avatar: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.secondary.main,
        border: '2px solid'
    },
    eventDescription: {
        position: 'relative',
        display: 'inline-block',
        left: 56,
        width: 'calc(100% - 56px)'
    },
    title: {
        fontsize: '12pt'
    },
    filename: {
        color: theme.palette.primary.main,
        fontSize: '10pt',
        fontWeight: 'bold'
    },
    date: {
        fontSize: '8pt'
    },
    message: {
        paddingLeft: '16px',
        borderLeft: '2px solid',
        borderLeftColor: theme.palette.grey[300],
        color: theme.palette.text.secondary
    },
    seeDiff: {
        color: theme.palette.secondary.main,
        textDecoration: 'underline'
    },
    arrowIcon: {
        marginBottom: -6,
        marginLeft: -6
    },
    diffContainer: {
        position: 'relative',
        left: 48,
        width: '90%'
    },
    menuButton: {
        position: 'absolute',
        top:28,
        left: -30,
        width: 25,
        height: 40
    }
})

export default withStyles(styles)(TimelineEvent)
