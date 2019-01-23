import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import LinkIcon from '@material-ui/icons/Link'

import UserAvatar from '../UserAvatar'
import { URI, IUser, ITimelineEvent } from 'conscience-lib/common'
import { autobind, extractEmail } from 'conscience-lib/utils'
import { getRepo } from 'conscience-components/env-specific'
import { selectCommit } from 'conscience-components/navigation'
import { IGlobalState } from 'conscience-components/redux'

@autobind
class TimelineEvent extends React.Component<Props>
{
    render() {
        const { event, classes } = this.props
        if (!event) {
            return null
        }

        return (
            <div
                className={classes.event}
                onClick={this.selectCommit}
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
                    <UserAvatar
                        user={this.props.user}
                        seedText={this.props.userEmail}
                        className={classes.avatar}
                    />
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

    selectCommit() {
        console.log(this.props.uri)
        selectCommit(this.props.uri)
    }
}

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    uri: URI
}

interface StateProps {
    event: ITimelineEvent | undefined
    user: IUser | undefined
    userEmail: string | undefined
}

const styles = (theme: Theme) => createStyles({
    event: {
        position: 'relative',
        padding: '18px 0 12px 24px',
        // marginLeft: '24px',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
        },
    },
    topline: {
        position: 'absolute',
        left: 43,
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
        left: 54,
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

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const repo = getRepo(ownProps.uri, state)
    const event = ((repo || {}).commits || {})[ownProps.uri.commit || '']
    const userEmail = event ? extractEmail(event.user) : undefined
    const user = userEmail ? state.user.users[state.user.usersByEmail[userEmail] || ''] : undefined
    return {
        event,
        user,
        userEmail,
    }
}

export default connect(mapStateToProps, null)(withStyles(styles)(TimelineEvent))
