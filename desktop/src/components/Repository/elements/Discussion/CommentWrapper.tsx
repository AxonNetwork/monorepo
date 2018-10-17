import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import UserAvatar from 'components/UserAvatar'
import moment from 'moment'
import autobind from 'utils/autobind'


@autobind
class CommentWrapper extends React.Component<Props>
{
    render() {
        const { username, userPicture, created, classes } = this.props
        const time = typeof created === 'string' ? created : moment(created).fromNow()
        return (
            <div className={classes.comment}>
                <div className={classes.commentAvatar}>
                    <UserAvatar username={username} userPicture={userPicture} />
                </div>

                <div className={classes.commentBody}>
                    <Typography className={classes.commentHeader}>
                        {username &&
                            <span>
                                {this.props.showBadge &&
                                    <Badge classes={{ badge: classes.commentBadge }} badgeContent="" color="secondary">
                                        <span>
                                            <strong>{username}</strong> <small>({time})</small>
                                        </span>
                                    </Badge>
                                }
                                {!this.props.showBadge &&
                                    <span>
                                        <strong>{username}</strong> <small>({time})</small>
                                    </span>
                                }
                            </span>
                        }
                    </Typography>

                    <div className={classes.commentText}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}

interface Props {
    username: string | undefined
    userPicture: string | undefined
    created: number | string
    showBadge?: boolean
    classes: any
}

const styles = (theme: Theme) => createStyles({
    comment: {
        display: 'flex',
    },
    commentAvatar: {
        flexGrow: 0,
        flexShrink: 0,
        padding: '24px 0 10px 16px',
        '& div': {
            backgroundColor: '#006ea2',
        },
    },
    commentBody: {
        margin: theme.spacing.unit * 2,
        padding: 0,
        border: '1px solid #e2e2e2',
        borderRadius: 6,
        backgroundColor: 'white',
        flexGrow: 1,
    },
    commentHeader: {
        backgroundColor: '#f1f1f1',
        padding: '8px 12px',
        borderBottom: '1px solid #e2e2e2',
        color: '#545454',
        minHeight: 38,
    },
    commentText: {
        padding: theme.spacing.unit * 2,

        '& p': {
            paddingBottom: 10,
            margin: 0,
        },
    },
    commentBadge: {
        width: 9,
        height: 9,
        top: -4,
    },
})

export default withStyles(styles)(CommentWrapper)
