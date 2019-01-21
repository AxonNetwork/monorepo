import React from 'react'
import classnames from 'classnames'
import moment from 'moment'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import IconButton from '@material-ui/core/IconButton'
import CancelIcon from '@material-ui/icons/Cancel'

import Thread from '../Thread'
import CreateDiscussion from '../CreateDiscussion'
import UserAvatar from '../UserAvatar'
import { IUser, IRepo, IDiscussion, IComment, FileMode } from 'conscience-lib/common'


class RepoDiscussionPage extends React.Component<Props>
{
    componentWillMount() {
        // @@TODO: intelligent caching
        const repoID = this.props.repo.repoID
        this.props.getDiscussions({ repoID })
    }

    render() {
        const { repo, discussions, selectedID, user, users, comments, classes } = this.props

        const newDiscussion = selectedID === 'new' // @@TODO: shitty

        const newestComment = this.props.newestCommentTimestampPerDiscussion
        const discussionsSorted = this.props.discussionIDsSortedByNewestComment.map(discussionID => discussions[discussionID] || { discussionID })

        return (
            <div className={classes.discussionPane}>
                <List className={classes.list}>

                    {discussionsSorted.map(d => {
                        const isSelected = selectedID && d.discussionID === selectedID
                        const showBadge = newestComment[d.discussionID] > (this.props.newestViewedCommentTimestamp[d.discussionID] || 0)
                        const user = this.props.users[d.userID]
                        return (
                            <ListItem
                                button
                                className={classnames(classes.listItem, { [classes.selectedDiscussion]: isSelected })}
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
                                                <UserAvatar user={user} />
                                            </div>
                                        </div>
                                    </React.Fragment>
                                } />
                            </ListItem>
                        )
                    })}

                    <ListItem button className={classes.listItem} key={0} onClick={() => this.props.selectDiscussion({ discussionID: 'new' })}>
                        <ListItemText primary={'New Discussion'} />
                        <ListItemIcon>
                            <ControlPointIcon />
                        </ListItemIcon>
                    </ListItem>
                    {/* <Divider /> */}
                </List>
                {newDiscussion &&
                    <div className={classes.threadPane}>
                        <IconButton onClick={() => this.props.selectDiscussion({ discussionID: undefined })} className={classes.closeNewDiscussionPanelButton}>
                            <CancelIcon />
                        </IconButton>
                        <Typography variant="title" className={classes.startNewDiscussionPrompt}>Start a new discussion</Typography>
                        <CreateDiscussion
                            repoID={this.props.repo.repoID}
                            user={user}
                            files={repo.files || {}}
                            discussions={discussions}
                            createDiscussion={this.props.createDiscussion}
                        />
                    </div>
                }
                {!newDiscussion && selectedID !== undefined &&
                    <div className={classes.threadPane}>
                        <Thread
                            repo={this.props.repo}
                            user={user}
                            discussionID={selectedID}
                            discussions={discussions}
                            users={users}
                            comments={comments}
                            directEmbedPrefix={this.props.directEmbedPrefix}
                            newestViewedCommentTimestamp={this.props.newestViewedCommentTimestamp[selectedID] || 0}
                            unselect={() => this.props.selectDiscussion({ discussionID: undefined })}
                            getFileContents={this.props.getFileContents}
                            selectFile={this.props.selectFile}
                            selectDiscussion={this.props.selectDiscussion}
                            createComment={this.props.createComment}
                            sawComment={this.props.sawComment}
                            selectUser={this.props.selectUser}
                        />
                    </div>
                }
            </div>
        )
    }
}

interface Props {
    repo: IRepo
    user: IUser
    discussions: { [discussionID: string]: IDiscussion }
    users: { [email: string]: IUser }
    comments: { [commentID: string]: IComment }
    selectedID: string | undefined
    directEmbedPrefix: string
    newestViewedCommentTimestamp: { [discussionID: string]: number }
    newestCommentTimestampPerDiscussion: { [discussionID: string]: number }
    discussionIDsSortedByNewestComment: string[]

    getDiscussions: (payload: { repoID: string }) => void
    getFileContents: (filename: string) => Promise<string>
    selectFile: (payload: { commit?: string, filename: string | undefined, mode: FileMode }) => void
    selectDiscussion: (payload: { discussionID: string | undefined }) => void
    createDiscussion: (payload: { repoID: string, subject: string, commentText: string }) => void
    createComment: (payload: { repoID: string, discussionID: string, text: string, callback: (error?: Error) => void }) => void
    sawComment: (payload: { repoID: string, discussionID: string, commentTimestamp: number }) => void
    selectUser: (payload: { username: string }) => void

    classes: any
}

const styles = (theme: Theme) => createStyles({
    discussionPane: {
        height: 'calc(100% - 80px)',
        display: 'flex',
    },
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
    title: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit,
    },
    threadPane: {
        position: 'relative',
        marginLeft: 20,
        height: '100%',
        width: '100%',
        flexGrow: 5,
    },
    selectedDiscussion: {
        backgroundColor: '#cee2f1',
    },
    closeNewDiscussionPanelButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: theme.spacing.unit,
    },
    startNewDiscussionPrompt: {
        fontSize: '1.8rem',
        padding: theme.spacing.unit,
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
})

export default withStyles(styles)(RepoDiscussionPage)
