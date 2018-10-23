import React from 'react'
import classnames from 'classnames'
import moment from 'moment'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import CardContent from '@material-ui/core/CardContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Badge from '@material-ui/core/Badge'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import { connect } from 'react-redux'
import { IRepo, IUser, IDiscussion } from 'common'
import { IGlobalState } from 'redux/store'
import { selectCommit } from 'redux/repository/repoActions'
import { selectDiscussion } from 'redux/discussion/discussionActions'
import FileViewer from './FileViewer'
import UserAvatar from 'components/UserAvatar'
import Timeline from './Timeline/Timeline'

import autobind from 'utils/autobind'


@autobind
class RepoHomePage extends React.Component<Props>
{
    render() {
        const { repo, classes } = this.props
        if (repo === undefined) {
            return null
        }

        const commitList = (repo.commitList || []).slice(0, 5)
        const discussionList = (this.props.discussionIDsSortedByNewestComment || []).slice(0, 5)
        const readmeExists = !!(repo.files || {})['README.md']

        return (
            <div className={classes.root}>
                {readmeExists &&
                    <div className={classnames(classes.readmeContainer, classes.box)}>
                        <FileViewer filename={'README.md'} repoRoot={repo.path} />
                    </div>
                }
                {!readmeExists &&
                    <div className={classnames(classes.readmeContainer, classes.box, classes.readmeContainerNoReadme)}>
                        <div className={classes.readmeContainerNoReadmeContents}>
                            <Typography className={classes.noReadmeText}>
                                Click to add a welcome message and instructions to this repository.
                            </Typography>

                            <AddCircleOutlineIcon className={classes.noReadmeAddIcon} />
                        </div>
                    </div>
                }

                <div className={classes.boxes}>
                    <Card className={classnames(classes.usersContainer, classes.box)}>
                        <CardContent>
                            <Typography variant="h6">Team</Typography>

                            <div className={classes.usersList}>
                                {(repo.sharedUsers || []).map(userID => {
                                    const user = this.props.users[userID] || {}
                                    return <UserAvatar username={user.name} userPicture={user.picture} className={classes.avatar} />
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={classnames(classes.discussionsContainer, classes.box)}>
                        <CardContent>
                            <Typography variant="h6">Recent Discussions</Typography>

                            <List>
                                {discussionList.map(discussionID => {
                                    const d = this.props.discussions[discussionID] || {}
                                    const newestComment = this.props.newestCommentTimestampPerDiscussion
                                    const showBadge = newestComment[d.discussionID] > (this.props.newestViewedCommentTimestamp[d.discussionID] || 0)
                                    const username = (this.props.users[ d.userID ] || {}).name || d.userID
                                    const userPicture = (this.props.users[ d.userID ] || {}).picture

                                    return (
                                        <ListItem
                                            button
                                            className={classnames(classes.listItem)}
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
                            </List>
                        </CardContent>
                    </Card>

                    <Card className={classnames(classes.commitsContainer, classes.box)}>
                        <CardContent>
                            <Typography variant="h6">Recent Commits</Typography>

                            <Timeline
                                repoID={repo.repoID}
                                page={0}
                                repoRoot={repo.path}
                                commits={repo.commits}
                                commitList={commitList}
                                selectCommit={this.props.selectCommit}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }
}

interface Props {
    repo: IRepo | undefined
    users: {[userID: string]: IUser}
    usersByEmail: {[email: string]: string}
    newestCommentTimestampPerDiscussion: {[discussionID: string]: number}
    newestViewedCommentTimestamp: {[discussionID: string]: number}
    discussionIDsSortedByNewestComment: string[]
    discussions: {[discussionID: string]: IDiscussion}

    selectCommit: typeof selectCommit
    selectDiscussion: typeof selectDiscussion

    classes: any
}


const styles = createStyles({
    root: {
        display: 'flex',
    },
    box: {
        margin: '0 20px 20px 0',
    },
    readmeContainer: {
        maxWidth: 640,
        flexShrink: 1,
        flexGrow: 1,
    },
    readmeContainerNoReadme: {
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        border: '3px solid #c5c5c5',
        padding: 30,
        textAlign: 'center',
        cursor: 'pointer',
    },
    readmeContainerNoReadmeContents: {
        position: 'relative',
        top: '15%',
    },
    noReadmeText: {
        fontSize: '1.2rem',
        color: '#a2a2a2',
        fontWeight: 700,
        marginBottom: 20,
    },
    noReadmeAddIcon: {
        fontSize: '5rem',
        color: '#a2a2a2',
    },
    boxes: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        flexGrow: 1,
    },
    usersContainer: {
        flexGrow: 0,
        flexShrink: 0,
    },
    usersList: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    avatar: {
        marginRight: 4,
    },

    // @@TODO: delete these after component-izing the discussion list
    listItem: {
        background: 'white',
        borderTop: 0,
        borderBottom: '1px solid #e0e0e0',

        '&:last-child': {
            borderBottom: 'none',
        },
    },
    listItemHover: {
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
        },
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
    const selectedRepo = state.repository.selectedRepo

    let repo: IRepo | undefined = undefined
    if (selectedRepo !== null && selectedRepo !== undefined) {
        repo = state.repository.repos[selectedRepo] || undefined
    }
    const repoID = (repo || {repoID: undefined}).repoID || ''

    return {
        repo,
        users: state.user.users,
        usersByEmail: state.user.usersByEmail,
        newestCommentTimestampPerDiscussion: state.discussion.newestCommentTimestampPerDiscussion,
        newestViewedCommentTimestamp: (state.user.newestViewedCommentTimestamp[repoID] || {}),
        discussionIDsSortedByNewestComment: state.discussion.discussionIDsSortedByNewestComment[repoID] || [],
        discussions: state.discussion.discussions,
    }
}

const mapDispatchToProps = {
    selectCommit,
    selectDiscussion,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoHomePage))