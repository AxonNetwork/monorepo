import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import UserAvatar from 'components/UserAvatar'
import moment from 'moment'
import autobind from 'utils/autobind'


@autobind
class CommentWrapper extends React.Component<Props>
{
    render() {
        const { username, created, classes } = this.props

        return (
            <div className={classes.comment}>
                <div className={classes.commentAvatar}>
                    <UserAvatar username={username} />
                </div>

                <div className={classes.commentBody}>
                    <Typography className={classes.commentHeader}>
                        <strong>{username}</strong> <small>({moment(created).fromNow()})</small>
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
    created: number
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
    },
    commentText: {
        padding: theme.spacing.unit * 2,

        '& p': {
            paddingBottom: 6,
        },
    },
})

export default withStyles(styles)(CommentWrapper)
