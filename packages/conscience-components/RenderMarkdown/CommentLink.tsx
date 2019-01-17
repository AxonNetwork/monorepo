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
        const user = users[comment.userID]

        return (
            <React.Fragment>
                <a
                    className={classes.link}
                    onClick={undefined}
                    onMouseEnter={this.showPopper}
                    onMouseLeave={this.hidePopper}
                    ref={(x: any) => (this._ref = x)}
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
                    style={{ maxHeight: window.innerHeight * 0.8 }}
                >
                    <CommentWrapper
                        user={user}
                        created={comment.created}
                        classes={{ comment: classes.comment, commentBody: classes.commentBody, commentText: classes.commentText }}
                        style={{ maxHeight: window.innerHeight * 0.8 }}
                    >
                        <RenderMarkdown
                            text={comment.text}
                            repo={repo}
                            comments={comments}
                            users={users}
                            discussions={this.props.discussions}
                            directEmbedPrefix={this.props.directEmbedPrefix}
                            dirname={this.props.dirname}
                            codeColorScheme={this.props.codeColorScheme}
                            getFileContents={this.props.getFileContents}
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
    comments: { [commentID: string]: IComment }
    users: { [userID: string]: IUser }
    discussions: { [userID: string]: IDiscussion }
    repo: IRepo
    directEmbedPrefix: string
    dirname: string
    codeColorScheme?: string | undefined
    getFileContents: (filename: string) => Promise<string>
    selectFile: (payload: { filename: string | undefined; mode: FileMode }) => void
    selectDiscussion: (payload: { discussionID: string | undefined }) => void
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
    },
    comment: {
        // height: '100%',
    },
    commentBody: {
        margin: 0,
        boxShadow: '1px 1px 6px #00000021',
    },
    commentText: {
        overflow: 'auto',
        height: 'calc(100% - 38px)',
    },
})

export default withStyles(styles)(CommentLink)
