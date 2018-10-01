import React from 'react'
import moment from 'moment'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'

import RevertFilesDialog from './RevertFilesDialog'
import { ITimelineEvent } from '../../../../common'
import autobind from 'utils/autobind'
import { removeEmail, getUserInitials, strToColor } from 'utils'


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
        const username = removeEmail(event.user)
        const avatarColor = strToColor(event.user)
        return (
            <React.Fragment>
                <div className={classes.event}>
                    {/*<IconButton className={classes.menuButton} onClick={this.handleClick}>
                        <MoreVertIcon />
                    </IconButton>*/}
                    <div className={classes.topline}></div>
                    <div className={classes.eventIconContainer}>
                        <Avatar style={{ backgroundColor: avatarColor }} className={classes.avatar}>{getUserInitials(username)}</Avatar>
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
    classes: any
}

interface State {
    openDialog: boolean
}

const styles = (theme: Theme) => createStyles({
    event: {
        position: 'relative',
        paddingTop: '24px',
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
