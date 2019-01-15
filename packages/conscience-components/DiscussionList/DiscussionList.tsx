import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import classnames from 'classnames'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import Badge from '@material-ui/core/Badge'
import UserAvatar from '../UserAvatar'
import { IDiscussion, IUser } from 'conscience-lib/common'
import moment from 'moment'

class DiscussionList extends React.Component<Props>
{
    render() {
        const { discussions, selectedID, classes } = this.props

        const newestComment = this.props.newestCommentTimestampPerDiscussion

        const order = this.props.order || Object.keys(discussions)
        let discussionsSorted = order.map(id => discussions[id])
        if (this.props.maxLength !== undefined) {
            discussionsSorted = discussionsSorted.slice(0, this.props.maxLength)
        }

        return (
            <List className={classes.list}>
                {discussionsSorted.map(d => {
                    const isSelected = selectedID && d.discussionID === selectedID
                    const showBadge = newestComment[d.discussionID] > (this.props.newestViewedCommentTimestamp[d.discussionID] || 0)
                    const user = this.props.users[d.userID]
                    return (
                        <ListItem
                            button
                            className={classnames(classes.listItem, { [classes.listItemSelected]: isSelected })}
                            classes={{ button: classes.listItemHover }}
                            onClick={() => this.props.selectDiscussion({ discussionID: d.discussionID })}
                        >
                            <ListItemText primary={d.subject} primaryTypographyProps={{ variant: 'body1', classes: { body1: classes.heading } }} secondary={
                                <React.Fragment>
                                    {showBadge &&
                                        <Badge classes={{ badge: classes.badge }} className={classes.badgeWrapper} badgeContent="" color="secondary">{null}</Badge>
                                    }
                                    <div className={classes.subheading}>
                                        <div className={classes.modifiedDate}>
                                            {moment(newestComment[d.discussionID]).fromNow()}
                                        </div>
                                        <div className={classes.avatar}>
                                            <UserAvatar user={user} />
                                        </div>
                                    </div>
                                </React.Fragment>
                            } />
                        </ListItem>
                    )
                })}
                <ListItem button className={classnames(classes.listItem, classes.listItemLast)} key={0} onClick={() => this.props.selectDiscussion({ discussionID: 'new' })}>
                    <ListItemText primary={'New Discussion'} />
                    <ListItemIcon>
                        <ControlPointIcon />
                    </ListItemIcon>
                </ListItem>
            </List>
        )
    }
}

interface Props {
    discussions: { [discussionID: string]: IDiscussion }
    order?: string[]
    maxLength?: number
    selectedID?: string | undefined
    users: { [email: string]: IUser }
    newestViewedCommentTimestamp: { [discussionID: string]: number }
    newestCommentTimestampPerDiscussion: { [discussionID: string]: number }

    selectDiscussion: (payload: { discussionID: string | undefined }) => void

    classes: any
}

const styles = (theme: Theme) => createStyles({
    list: {
        height: '100%',
        width: '100%',
        padding: 0,
        overflow: 'auto',
        flexGrow: 1,
    },
    listItem: {
        background: 'white',
        borderTop: 0,
        borderBottom: '1px solid #e0e0e0',
    },
    listItemLast: {
        borderBottom: 'none',
    },
    listItemHover: {
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
        },
    },
    listItemSelected: {
        backgroundColor: '#cee2f1',
    },
    badge: {
        width: 9,
        height: 9,
        right: 'auto',
        top: -17,
        left: -15,
    },
    badgeWrapper: {
        display: 'block',
        height: 0,
    },
    heading: {
        // fontSize: '11pt',
        fontWeight: 'bold',
        color: 'rgba(0, 0, 0, 0.75)',
    },
    subheading: {
        display: 'flex',
    },
    modifiedDate: {
        flexGrow: 1,
    },
    avatar: {
        padding: 3,

        '& > div': {
            width: 22,
            height: 22,
            fontSize: '0.8rem',
        },
    },
})

export default withStyles(styles)(DiscussionList)
