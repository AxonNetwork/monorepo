import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import axios from 'axios'
import DiscussionsPane from 'conscience-components/DiscussionsPane'
import { History } from 'history'
import { updateUserSettings, sawComment } from 'redux/user/userActions'
import { getDiscussions, createDiscussion, createComment } from 'redux/discussion/discussionActions'
import { IGlobalState } from 'redux/store'
import { IRepo, IUser, IDiscussion, IComment, IUserSettings, FileMode } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoDiscussionPage extends React.Component<Props>
{
    render() {
        const { discussionID } = this.props.match.params
        const { classes } = this.props
        const directEmbedPrefix = this.directEmbedPrefix()

        return (
            <div className={classes.page}>
                <DiscussionsPane
                    repo={this.props.repo}
                    user={this.props.user}
                    discussions={this.props.discussions}
                    users={this.props.users}
                    comments={this.props.comments}
                    selectedID={discussionID}
                    directEmbedPrefix={directEmbedPrefix}
                    newestViewedCommentTimestamp={this.props.newestViewedCommentTimestamp}
                    newestCommentTimestampPerDiscussion={this.props.newestCommentTimestampPerDiscussion}
                    discussionIDsSortedByNewestComment={this.props.discussionIDsSortedByNewestComment}
                    getDiscussions={this.props.getDiscussions}
                    getFileContents={this.getFileContents}
                    selectFile={this.selectFile}
                    selectDiscussion={this.selectDiscussion}
                    createDiscussion={this.props.createDiscussion}
                    createComment={this.props.createComment}
                    sawComment={this.props.sawComment}
                    selectUser={this.selectUser}
                />
            </div>
        )
    }

    directEmbedPrefix() {
        const API_URL = process.env.API_URL
        const repoID = this.props.match.params.repoID
        const prefix = `${API_URL}/repo/${repoID}/file`
        return prefix
    }

    async getFileContents(filename: string) {
        const directEmbedPrefix = this.directEmbedPrefix()
        const fileUrl = `${directEmbedPrefix}/${filename}`
        const resp = await axios.get<string>(fileUrl)
        return resp.data
    }

    selectFile(payload: { filename: string | undefined, mode: FileMode }) {
        const repoID = this.props.match.params.repoID
        const filename = payload.filename
        if (filename === undefined) {
            this.props.history.push(`/repo/${repoID}/files`)
        } else {
            this.props.history.push(`/repo/${repoID}/files/${filename}`)
        }
    }

    selectDiscussion(payload: { discussionID: string | undefined }) {
        const repoID = this.props.match.params.repoID
        const discussionID = payload.discussionID
        if (discussionID === undefined) {
            this.props.history.push(`/repo/${repoID}/discussion`)
        } else {
            this.props.history.push(`/repo/${repoID}/discussion/${discussionID}`)
        }
    }

    sawComment(payload: { repoID: string, discussionID: string, commentTimestamp: number }) {
        console.log(payload)
    }

    selectUser(payload: { username: string | undefined }) {
        const { username } = payload
        if (username === undefined) {
            return
        }
        this.props.history.push(`/user/${username}`)
    }
}

interface MatchParams {
    repoID: string
    discussionID: string | undefined
}

interface Props extends RouteComponentProps<MatchParams> {
    repo: IRepo
    user: IUser
    discussions: { [discussionID: string]: IDiscussion }
    users: { [email: string]: IUser }
    comments: { [commentID: string]: IComment }
    newestViewedCommentTimestamp: { [discussionID: string]: number }
    newestCommentTimestampPerDiscussion: { [discussionID: string]: number }
    discussionIDsSortedByNewestComment: string[]

    getDiscussions: (payload: { repoID: string }) => void
    createDiscussion: (payload: { repoID: string, subject: string, commentText: string }) => void
    createComment: (payload: { repoID: string, discussionID: string, text: string, callback: (error?: Error) => void }) => void
    updateUserSettings: (payload: { settings: IUserSettings }) => void
    sawComment: (payload: { repoID: string, discussionID: string, commentTimestamp: number }) => void

    history: History
    classes: any
}

const styles = (theme: Theme) => createStyles({
    page: {
        marginTop: 16,
    },
})

const mapStateToProps = (state: IGlobalState, props: Props) => {
    const repoID = props.match.params.repoID
    const repo = state.repo.repos[repoID] || {}
    const users = state.user.users
    const user = users[state.user.currentUser || ''] || {}
    return {
        repo,
        user,
        users,
        discussions: state.discussion.discussions,
        comments: state.discussion.comments,
        newestViewedCommentTimestamp: ((state.user.userSettings.newestViewedCommentTimestamp || {})[repoID] || {}),
        newestCommentTimestampPerDiscussion: state.discussion.newestCommentTimestampPerDiscussion,
        discussionIDsSortedByNewestComment: (state.discussion.discussionIDsSortedByNewestComment[repoID] || []),
    }
}

const mapDispatchToProps = {
    getDiscussions,
    createDiscussion,
    createComment,
    updateUserSettings,
    sawComment,
}

const RepoDiscussionPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoDiscussionPage))

export default RepoDiscussionPageContainer
