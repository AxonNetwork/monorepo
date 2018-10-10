import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import moment from 'moment'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import IconButton from '@material-ui/core/IconButton'
import CancelIcon from '@material-ui/icons/Cancel'

import Thread from './Discussion/Thread'
import CreateDiscussion from './Discussion/CreateDiscussion'
import UserAvatar from 'components/UserAvatar'
import { getDiscussions, selectDiscussion, createDiscussion, createComment } from 'redux/discussion/discussionActions'
import { IGlobalState } from 'redux/store'
import { IUser, IRepo, IDiscussion, IComment } from 'common'


class RepoDiscussionPage extends React.Component<Props>
{
    componentWillMount() {
        // @@TODO: intelligent caching
        this.props.getDiscussions({ repoID: this.props.repoID })
    }

    render() {
        const classes = this.props.classes
        const discussions = this.props.discussions || {}

        let selected: IDiscussion | undefined
        let newDiscussion = false
        if (this.props.selected !== undefined) {
            selected = discussions[this.props.selected]
            if (selected === undefined) {
                newDiscussion = true
            }
        }

        const newestComment = this.props.newestCommentTimestampPerDiscussion
        const discussionsSorted = this.props.discussionIDsSortedByNewestComment.map(created => discussions[created] || { created })

        return (
            <div className={classes.discussionPage}>
                <List className={classes.list}>

                    {discussionsSorted.map(d => {
                        const isSelected = this.props.selected && d.created === this.props.selected
                        const showBadge = newestComment[d.created] > (this.props.newestViewedCommentTimestamp[d.created] || 0)
                        const username = (this.props.users[ d.email ] || {}).name || d.email
                        return (
                            <React.Fragment key={d.created}>
                                <ListItem
                                    button
                                    className={classnames(classes.listItem, {[classes.selectedDiscussion]: isSelected})}
                                    onClick={() => this.props.selectDiscussion({ created: d.created })}
                                >
                                    <ListItemText primary={d.subject} secondary={
                                        <React.Fragment>
                                            {showBadge &&
                                                <Badge classes={{ badge: classes.discussionBadge }} className={classes.discussionBadgeWrapper} badgeContent="" color="secondary">{null}</Badge>
                                            }
                                            <div className={classes.sidebarListItemSubtext}>
                                                <div className={classes.sidebarListItemModifiedDate}>
                                                    {moment(newestComment[d.created]).fromNow()}
                                                </div>
                                                <div className={classes.sidebarListItemAvatar}>
                                                    <UserAvatar username={username} />
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    }/>
                                </ListItem>
                                {/* <Divider /> */}
                            </React.Fragment>
                        )
                    })}

                    <ListItem button className={classes.listItem} key={0} onClick={() => this.props.selectDiscussion({ created: -1 })}>
                        <ListItemText primary={'New Discussion'} />
                        <ListItemIcon>
                            <ControlPointIcon />
                        </ListItemIcon>
                    </ListItem>
                    {/* <Divider /> */}
                </List>
                {newDiscussion &&
                    <div className={classes.threadPane}>
                        <IconButton onClick={() => this.props.selectDiscussion({ created: undefined })} className={classes.closeNewDiscussionPanelButton}>
                            <CancelIcon />
                        </IconButton>
                        <Typography variant="title" className={classes.startNewDiscussionPrompt}>Start a new discussion</Typography>
                        <CreateDiscussion
                            repoRoot={this.props.repo.path}
                        />
                    </div>
                }
                {selected !== undefined &&
                    <div className={classes.threadPane}>
                        <Thread
                            repo={this.props.repo}
                            title={(selected as IDiscussion).subject}
                            type="discussion"
                            subject={(selected as IDiscussion).created}
                            unselect={() => this.props.selectDiscussion({ created: undefined })}
                        />
                    </div>
                }
            </div>
        )
    }
}

interface Props {
    repoID: string
    repo: IRepo
    users: {[email: string]: IUser}
    discussions: {[created: number]: IDiscussion}
    comments: {[id: number]: IComment}
    selected: number | undefined
    newestViewedCommentTimestamp: {[discussionID: number]: number}
    newestCommentTimestampPerDiscussion: {[discussionID: number]: number}
    discussionIDsSortedByNewestComment: number[]

    getDiscussions: typeof getDiscussions
    selectDiscussion: typeof selectDiscussion
    createDiscussion: typeof createDiscussion
    createComment: typeof createComment
    classes: any
}

const styles = (theme: Theme) => createStyles({
    discussionPage: {
        maxHeight: 'calc(100% - 84px)',
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
    title: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit,
    },
    threadPane: {
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
        backgroundColor: theme.palette.grey[300],
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

const mapStateToProps = (state: IGlobalState) => {
    const selected = state.repository.selectedRepo || ''
    const repo = state.repository.repos[selected] || {}
    const repoID = repo.repoID || ''
    const users = state.user.users
    return {
        repo,
        repoID,
        users,
        discussions: state.discussion.discussions[repoID] || {},
        comments: state.discussion.comments[repoID] || {},
        selected: state.discussion.selected,
        newestViewedCommentTimestamp: (state.user.newestViewedCommentTimestamp[repoID] || {}),
        newestCommentTimestampPerDiscussion: (state.discussion.newestCommentTimestampPerDiscussion[repoID] || {}),
        discussionIDsSortedByNewestComment: (state.discussion.discussionIDsSortedByNewestComment[repoID] || []),
    }
}

const mapDispatchToProps = {
    getDiscussions,
    selectDiscussion,
    createDiscussion,
    createComment,
}

const RepoDiscussionPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoDiscussionPage))

export default RepoDiscussionPageContainer

