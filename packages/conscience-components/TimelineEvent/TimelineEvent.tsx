import React from 'react'
import moment from 'moment'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import LinkIcon from '@material-ui/icons/Link'

import UserAvatar from '../UserAvatar'
import { ITimelineEvent } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'

@autobind
class TimelineEvent extends React.Component<Props>
{
    render() {
        const { event, classes } = this.props
        return (
            <div
                className={classes.event}
                onClick={() => this.props.selectCommit(event.commit, event.repoID)}
            >
                <div className={classes.topline}></div>
                {event.verified !== undefined &&
                    <div className={classes.linkIconContainer}>
                        <Tooltip title={'Secured on blockchain: ' + moment(event.verified).format('MMM Do YYYY, h:mm a')}>
                            <LinkIcon classes={{ root: classes.linkIcon }} />
                        </Tooltip>
                    </div>
                }
                <div className={classes.eventIconContainer}>
                    <UserAvatar username={this.props.username} userPicture={this.props.userPicture} className={classes.avatar} />
                </div>
                <div className={classes.eventDescription}>
                    <Typography className={classes.commitMessage}>{event.message}</Typography>
                    {event.repoID !== undefined &&
                        <Typography><em>{event.repoID}</em></Typography>
                    }
                    <Typography className={classes.date}>{moment(event.time).calendar()}</Typography>
                    <Typography className={classes.username}>{event.user}</Typography>
                </div>
            </div>
        )
    }
}

interface Props {
    event: ITimelineEvent
    username: string | undefined
    userPicture: string | undefined
    selectCommit: (commit: string, repoID: string | undefined) => void
    classes: any
}

const styles = (theme: Theme) => createStyles({
    event: {
        position: 'relative',
        padding: '18px 0 12px',
        marginLeft: '24px',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
        },
    },
    topline: {
        position: 'absolute',
        left: 19,
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: theme.palette.grey[400],
    },
    linkIcon: {
        fontSize: 18,
    },
    linkIconContainer: {
        position: 'absolute',
        top: 18,
        left: 30,
        borderRadius: '50%',
        width: 18,
        height: 18,
        backgroundColor: theme.palette.secondary.main,
        color: 'white',
    },
    eventIconContainer: {
        position: 'absolute',
        top: '22px',
        zIndex: 1,
    },
    eventDescription: {
        position: 'relative',
        display: 'inline-block',
        left: 56,
        width: 'calc(100% - 56px)',
    },
    commitMessage: {
        fontSize: '11pt',
        color: 'rgba(0, 0, 0, 0.75)',
        fontWeight: 'bold',
    },
    filename: {
        color: theme.palette.primary.main,
        fontSize: '10pt',
        fontWeight: 'bold',
    },
    date: {
        fontSize: '8pt',
    },
    username: {
        fontSize: '8pt',
    },
    seeDiff: {
        color: theme.palette.secondary.main,
        textDecoration: 'underline',
    },
    arrowIcon: {
        marginBottom: -6,
        marginLeft: -6,
    },
    menuButton: {
        position: 'absolute',
        top: 28,
        left: -30,
        width: 25,
        height: 40,
    },
})

export default withStyles(styles)(TimelineEvent)
