import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Popper from '@material-ui/core/Popper'
import { autobind } from 'conscience-lib/utils'
import CommentWrapper from '../CommentWrapper'
import RenderMarkdown from '../RenderMarkdown'
import { IRepo, IComment, IUser, IDiscussion, FileMode } from 'conscience-lib/common'


@autobind
class CommentLink extends React.Component<Props, State>
{
    state = {
        showPopper: false,
    }

    _ref!: HTMLAnchorElement

    render() {
        const { commentID, comments, users, repo, classes } = this.props
        const comment = comments[commentID]
        if (comment === undefined) {
            return null
        }
        const username = (users[comment.userID] || {} as any).name || comment.userID
        const userPicture = (users[comment.userID] || {} as any).picture

        return (
            <React.Fragment>
                <a
                    className={classes.link}
                    onClick={undefined}
                    onMouseEnter={this.showPopper}
                    onMouseLeave={this.hidePopper}
                    ref={(x: any) => this._ref = x}
                >
                    comment {comment.commentID}
                </a>
                <Popper
                    open={this.state.showPopper}
                    anchorEl={this._ref}
                    placement="right"
                    onMouseEnter={this.showPopper}
                    onMouseLeave={this.hidePopper}
                    className={classes.popper}
                >
                        <CommentWrapper
                            username={username}
                            userPicture={userPicture}
                            created={comment.created}
                        >
                            <RenderMarkdown
                                text={comment.text}
                                repo={repo}
                                comments={comments}
                                users={users}
                                discussions={this.props.discussions}
                                codeColorScheme={this.props.codeColorScheme}
                                selectFile={this.props.selectFile}
                                selectDiscussion={this.props.selectDiscussion}
                            />
                        </CommentWrapper>
                </Popper>
            </React.Fragment>
        )
    }

    showPopper() {
        this.setState({ showPopper: true })
    }

    hidePopper() {
        this.setState({ showPopper: false })
    }
}

interface Props {
    commentID: string
    comments: {[commentID: string]: IComment}
    users: {[userID: string]: IUser}
    discussions: {[userID: string]: IDiscussion}
    repo: IRepo
    codeColorScheme?: string | undefined
    selectFile: (payload: {filename: string | undefined, mode: FileMode}) => void
    selectDiscussion: (payload: {discussionID: string | undefined}) => void
    classes: any
}

interface State {
    showPopper: boolean
}

const styles = (theme: Theme) => createStyles({
    link: {
        color: theme.palette.secondary.main,
        textDecoration: 'underline',
        cursor: 'pointer',
    },
    popper: {
        width: 450,
        height: 350,
        backgroundColor: theme.palette.background.default,
        border: '1px solid',
        borderColor: theme.palette.grey[400],
        overflow: 'scroll',
    },
})

export default (withStyles(styles)(CommentLink))

