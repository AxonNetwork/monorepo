import React from 'react'
import moment from 'moment'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import LinkIcon from '@material-ui/icons/Link'

import RevertFilesDialog from './RevertFilesDialog'
import UserAvatar from 'components/UserAvatar'
import { ITimelineEvent } from '../../../../common'
import autobind from 'utils/autobind'
import { removeEmail, extractEmail } from 'utils'


@autobind
class TimelineEvent extends React.Component<Props, State>
{
    state = {
        openDialog: false,
    }

    handleClick() {
        this.setState({ openDialog: true })
    }

    handleClose() {
        this.setState({ openDialog: false })
    }

    render() {
        const { event, classes } = this.props
        return (
            <React.Fragment>
                <div className={classes.event}>
                    <div className={classes.topline}></div>
                    {event.verified !== undefined &&
                        <div className={classes.linkIconContainer}>
                            <Tooltip title={'Secured on blockchain: ' + moment(event.verified).format('MMM do YYYY, h:mm a')}>
                                <LinkIcon classes={{root: classes.linkIcon}}/>
                            </Tooltip>
                        </div>
                    }
                    <div className={classes.eventIconContainer}>
                        <UserAvatar username={this.props.username} userPicture={this.props.userPicture} className={classes.avatar} />
                    </div>
                    <div className={classes.eventDescription}>
                        <Typography className={classes.commitMessage}>{event.message}</Typography>
                        <Typography className={classes.date}>{moment(event.time).calendar()}</Typography>
                        <Typography className={classes.username}>{event.user}</Typography>
                    </div>
                </div>

                <RevertFilesDialog
                    event={this.props.event}
                    repoRoot={this.props.repoRoot}
                    revertFiles={this.props.revertFiles}
                    open={this.state.openDialog}
                    onClose={this.handleClose}
                />
            </React.Fragment>
        )
    }
}

interface Props {
    event: ITimelineEvent
    repoRoot: string
    getDiff: Function
    revertFiles: Function
    username: string | undefined
    userPicture: string | undefined
    classes: any
}

interface State {
    openDialog: boolean
}

const styles = (theme: Theme) => createStyles({
    event: {
        position: 'relative',
        padding: '18px 0 12px',
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
    avatar: {
        // backgroundColor: theme.palette.background.default,
        // color: theme.palette.secondary.main,
        // border: '2px solid',
    },
    eventDescription: {
        position: 'relative',
        display: 'inline-block',
        left: 56,
        width: 'calc(100% - 56px)',
    },
    commitMessage: {
        fontSize: '11pt',
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
        // paddingLeft: '16px',
        // borderLeft: '2px solid',
        // borderLeftColor: theme.palette.grey[300],
        // color: theme.palette.text.secondary,
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

// function EventTitle(props: {
//     version: number
//     user: string
//     files: string[] | string
// }) {
//     const user = props.user || 'Someone'
//     const { files, version } = props
//     let filesString
//     if (typeof files === 'string') {
//         filesString = files
//     }else {
//         filesString = files.reduce((acc: JSX.Element[], curr: string, i: number) => {
//             acc.push(<code key={i}>{curr}</code>)
//             if (files.length - i > 2) { acc.push(<span>, </span>) }
//             if (files.length - i == 2) { acc.push(<span> and </span>) }
//             return acc
//         }, [])
//     }
//     return <span><strong>v{version}: {user}</strong> edited {filesString}</span>
// }

export default withStyles(styles)(TimelineEvent)
