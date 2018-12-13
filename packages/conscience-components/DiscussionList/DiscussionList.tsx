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
import moment from 'moment'

class DiscussionList extends React.Component<Props>
{
	render() {
		const { discussions, selectedID, classes } = this.props

        const newestComment = this.props.newestCommentTimestampPerDiscussion

        const order = this.props.order || Object.keys(discussions)
        const discussionsSorted = order.map(id => discussions[id])

		return(
			<List className={classes.list}>
				{discussionsSorted.map(d => {
                    const isSelected = selectedID && d.discussionID === selectedID
                    const showBadge = newestComment[d.discussionID] > (this.props.newestViewedCommentTimestamp[d.discussionID] || 0)
                    const username = (this.props.users[ d.userID ] || {}).name || d.userID
                    const userPicture = (this.props.users[ d.userID ] || {}).picture
                    return(
                    	<ListItem
	                    	button
                            className={classnames(classes.listItem, {[classes.selectedDiscussion]: isSelected})}
	                        classes={{ button: classes.listItemHover }}
                            onClick={() => this.props.selectDiscussion({ discussionID: d.discussionID })}
                    	>
                    		<ListItemText primary={d.subject} secondary={
                    			<React.Fragment>
                                        {showBadge &&
                                            <Badge classes={{ badge: classes.discussionBadge }} className={classes.discussionBadgeWrapper} badgeContent="" color="secondary">{null}</Badge>
                                        }
                                        <div className={classes.sidebarListItemSubtext}>
                                            <div className={classes.sidebarListItemModifiedDate}>
                                                {moment(newestComment[d.discussionID]).fromNow()}
                                            </div>
                                            <div className={classes.sidebarListItemAvatar}>
                                                <UserAvatar username={username} userPicture={userPicture} />
                                            </div>
                                        </div>
                    			</React.Fragment>
                    		}/>
                    	</ListItem>
                	)
				})}
                <ListItem button className={classes.listItem} key={0} onClick={() => this.props.selectDiscussion({ discussionID: 'new' })}>
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
    discussions: {[discussionID: string]: IDiscussion}
    order?: string[]
    selectedID?: string | undefined
    users: {[email: string]: IUser}
    newestViewedCommentTimestamp: {[discussionID: string]: number}
    newestCommentTimestampPerDiscussion: {[discussionID: string]: number}

    selectDiscussion: (payload: {discussionID: string | undefined}) => void

	classes:any
}

const styles = (theme: Theme) => createStyles({
    list: {
        height: '100%',
        padding: 0,
        overflow: 'auto',
        flexGrow: 1,
        width: 350,
        borderTop: '1px solid #e0e0e0',
    },
    listItem: {
        background: 'white',
        borderTop: 0,
        border: '1px solid #e0e0e0',
    },
    listItemHover: {
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
        },
    },
    selectedDiscussion: {
        backgroundColor: '#cee2f1',
    },
    discussionBadge: {
        width: 9,
        height: 9,
        right: 'auto',
        top: -17,
        left: -15,
    },
    discussionBadgeWrapper: {
        display: 'block',
        height: 0,
    },
    sidebarListItemSubtext: {
        display: 'flex',
    },
    sidebarListItemModifiedDate: {
        flexGrow: 1,
    },
    sidebarListItemAvatar: {
        padding: 3,

        '& > div': {
            width: 22,
            height: 22,
            fontSize: '0.8rem',
        },
    },
})

export default withStyles(styles)(DiscussionList)
