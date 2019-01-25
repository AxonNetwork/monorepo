import moment from 'moment'
import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import classnames from 'classnames'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import Badge from '@material-ui/core/Badge'
import Typography from '@material-ui/core/Typography'
import UserAvatar from '../UserAvatar'
import { selectDiscussion } from '../navigation'
import { getRepoID } from '../env-specific'
import { IGlobalState } from '../redux'
import { IDiscussion, IUser, URI } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class DiscussionList extends React.Component<Props>
{
    render() {
        const { discussions, selectedID, classes } = this.props

        const newestComment = this.props.newestCommentTimestampPerDiscussion

        const order = this.props.order || this.props.discussionIDsSortedByNewestComment
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
                            onClick={() => this.selectDiscussion(d.discussionID)}
                        >
                            {showBadge &&
                                <Badge classes={{ badge: classes.badge }} className={classes.badgeWrapper} badgeContent="" color="secondary">{null}</Badge>
                            }
                            <div className={classes.description}>
                                <Typography className={classes.heading}>
                                    {d.subject}
                                </Typography>
                                <Typography className={classes.subheading}>
                                    {moment(newestComment[d.discussionID]).fromNow()}
                                </Typography>
                            </div>
                            <div className={classes.avatar}>
                                <UserAvatar user={user} disableClick />
                            </div>
                            {/*           <ListItemText primary={d.subject} primaryTypographyProps={{ variant: 'body1', classes: { body1: classes.heading } }} secondary={
                                <React.Fragment>

                                    <div className={classes.subheading}>
                                        <div className={classes.modifiedDate}>
                                            {moment(newestComment[d.discussionID]).fromNow()}
                                        </div>
                                        <div className={classes.avatar}>
                                            <UserAvatar user={user} />
                                        </div>
                                    </div>
                                </React.Fragment>
                            } />*/}
                        </ListItem>
                    )
                })}
                <ListItem button className={classnames(classes.listItem, classes.listItemLast)} key={0} onClick={() => this.selectDiscussion('new')}>
                    <ListItemText primary={'New Discussion'} className={classes.description} />
                    <ListItemIcon>
                        <ControlPointIcon />
                    </ListItemIcon>
                </ListItem>
            </List>
        )
    }

    selectDiscussion(discussionID: string | undefined) {
        selectDiscussion(this.props.uri, discussionID)
    }
}

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    uri: URI
    order?: string[]
    maxLength?: number
    selectedID?: string | undefined
}

interface StateProps {
    discussions: { [discussionID: string]: IDiscussion }
    users: { [email: string]: IUser }
    newestViewedCommentTimestamp: { [discussionID: string]: number }
    newestCommentTimestampPerDiscussion: { [discussionID: string]: number }
    discussionIDsSortedByNewestComment: string[]
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
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        background: 'white',
        borderTop: 0,
        borderBottom: '1px solid #e0e0e0',
    },
    listItemLast: {
        paddingLeft: 24,
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
    },
    badgeWrapper: {
        position: 'absolute',
        display: 'block',
        height: 0,
        left: 4,
        top: '50%',
    },
    description: {
        paddingLeft: 8
    },
    heading: {
        fontWeight: 'bold',
        color: 'rgba(0, 0, 0, 0.75)',
    },
    subheading: {
        color: 'rgba(0, 0, 0, 0.54)',
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

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const repoID = getRepoID(ownProps.uri)

    return {
        users: state.user.users,
        discussions: state.discussion.discussions,
        newestViewedCommentTimestamp: ((state.user.userSettings.newestViewedCommentTimestamp || {})[repoID] || {}),
        newestCommentTimestampPerDiscussion: state.discussion.newestCommentTimestampPerDiscussion,
        discussionIDsSortedByNewestComment: (state.discussion.discussionIDsSortedByNewestComment[repoID] || []),
    }
}

const mapDispatchToProps = {}

export default connect<StateProps, {}, OwnProps, IGlobalState>(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(DiscussionList))
