import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { values, sortBy, toPairs } from 'lodash'
import moment from 'moment'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CancelIcon from '@material-ui/icons/Cancel'

import Thread from './Discussion/Thread'
import CreateDiscussion from './Discussion/CreateDiscussion'
import UserAvatar from 'components/UserAvatar'
import { getDiscussions, selectDiscussion, createDiscussion } from 'redux/discussion/discussionActions'
import { createComment } from 'redux/comment/commentActions'
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

        // @@TODO: probably better to do some of this processing/sorting/etc. in the reducer
        const mostRecentReplies =
            values(this.props.comments)
            .filter(c => c.attachedTo.type === 'discussion')
            .reduce((into, each) => {
                if (into[each.attachedTo.subject] === undefined || into[each.attachedTo.subject].mostRecentComment < each.created) {
                    into[each.attachedTo.subject] = { mostRecentComment: each.created, user: each.user }
                }
                return into
            }, {} as { [discussionID: number]: {mostRecentComment: number, user: string} })

        const discussionIDsSorted =
            sortBy(toPairs(mostRecentReplies), (pair) => pair[1].mostRecentComment)
            .map(pair => pair[0])
            .reverse()

        return (
            <div className={classes.discussionPage}>
                <List className={classes.list}>
                    {discussionIDsSorted.map(created => (
                        <React.Fragment key={created}>
                            <ListItem button className={classnames(classes.listItem, {[classes.selectedDiscussion]: created === this.props.selected})} key={created} onClick={() => this.props.selectDiscussion({ created })}>
                                {selected === undefined &&
                                    <React.Fragment>
                                        <ListItemText primary={discussions[created].subject} secondary={
                                            <div className={classes.sidebarListItemSubtext}>
                                                <div className={classes.sidebarListItemModifiedDate}>
                                                    {moment(mostRecentReplies[created].mostRecentComment).fromNow()}
                                                </div>
                                                <div className={classes.sidebarListItemAvatar}>
                                                    <UserAvatar username={this.props.users[ discussions[created].email ].name} />
                                                </div>
                                            </div>
                                        }/>
                                        <ListItemIcon>
                                            <ChevronRightIcon />
                                        </ListItemIcon>
                                    </React.Fragment>
                                }
                                {selected !== undefined &&
                                    <React.Fragment>
                                        <ListItemText primary={discussions[created].subject} secondary={
                                            <div className={classes.sidebarListItemSubtext}>
                                                <div className={classes.sidebarListItemModifiedDate}>
                                                    {moment(mostRecentReplies[created].mostRecentComment).fromNow()}
                                                </div>
                                                <div className={classes.sidebarListItemAvatar}>
                                                    <UserAvatar username={this.props.users[ discussions[created].email ].name} />
                                                </div>
                                            </div>
                                        }/>

                                    </React.Fragment>
                                }
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                    <ListItem button className={classes.listItem} key={0} onClick={() => this.props.selectDiscussion({ created: -1 })}>
                        <ListItemText primary={'New Discussion'} />
                        <ListItemIcon>
                            <ControlPointIcon />
                        </ListItemIcon>
                    </ListItem>
                    <Divider />
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
    getDiscussions: typeof getDiscussions
    selectDiscussion: typeof selectDiscussion
    createDiscussion: typeof createDiscussion
    createComment: typeof createComment
    classes: any
}

const styles = (theme: Theme) => createStyles({
    discussionPage: {
        maxHeight: 'calc(100% - 84px)',
        // border: '1px solid',
        // borderColor: theme.palette.grey[300],
        display: 'flex',
    },
    list: {
        height: '100%',
        padding: 0,
        overflow: 'auto',
        flexGrow: 1,
        width: 350,
        border: '1px solid #e0e0e0',
    },
    listItem: {
        background: 'white',
    },
    title: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit,
    },
    threadPane: {
        // borderLeft: '1px solid',
        // borderColor: theme.palette.grey[300],
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
        comments: state.comment.comments[repoID] || {},
        selected: state.discussion.selected,
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

