import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import DiscussionsPane from 'conscience-components/DiscussionsPane'
import { sawComment } from 'conscience-components/redux/user/userActions'
import { getDiscussions, createDiscussion, createComment } from 'conscience-components/redux/discussion/discussionActions'
import { IGlobalState } from 'redux/store'
import { IRepo, IUser, IDiscussion, IComment, FileMode } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import fs from 'fs'
import path from 'path'


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
                    classes={{ threadPane: classes.threadPane }}
                />
            </div>
        )
    }

    directEmbedPrefix() {
        const path = this.props.repo.path
        const prefix = "file://" + path
        return prefix
    }

    async getFileContents(filename: string) {
        return new Promise<string>((resolve, reject) => {
            fs.readFile(path.join(this.props.repo.path || "", filename), 'utf8', (err: Error, contents: string) => {
                if (err) {
                    reject(err)
                }
                resolve(contents)
            })
        })
    }

    selectFile(payload: { filename: string | undefined, mode: FileMode }) {
        const repoHash = this.props.match.params.repoHash
        const filename = payload.filename
        if (filename === undefined) {
            this.props.history.push(`/repo/${repoHash}/files`)
        } else {
            this.props.history.push(`/repo/${repoHash}/files/${filename}`)
        }
    }

    selectDiscussion(payload: { discussionID: string | undefined }) {
        const repoHash = this.props.match.params.repoHash
        const discussionID = payload.discussionID
        if (discussionID === undefined) {
            this.props.history.push(`/repo/${repoHash}/discussion`)
        } else {
            this.props.history.push(`/repo/${repoHash}/discussion/${discussionID}`)
        }
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
    repoHash: string
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
    sawComment: (payload: { repoID: string, discussionID: string, commentTimestamp: number }) => void

    classes: any
}

const styles = (theme: Theme) => createStyles({
    page: {
        marginTop: 16,
        width: '100%',
        height: '100%',
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: Props) => {
    const repoRoot = state.repo.reposByHash[ownProps.match.params.repoHash]
    const repo = state.repo.repos[repoRoot] || {}
    const repoID = repo.repoID || ''
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
    sawComment,
}

const RepoDiscussionPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoDiscussionPage))

export default RepoDiscussionPageContainer
