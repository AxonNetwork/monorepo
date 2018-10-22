import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Popper from '@material-ui/core/Popper'
import autobind from 'utils/autobind'
import { IGlobalState } from 'redux/store'
import { IComment } from 'common'
import CommentWrapper from 'components/Repository/elements/Discussion/CommentWrapper'
import RenderMarkdown from 'components/RenderMarkdown/RenderMarkdown'

@autobind
class CommentLink extends React.Component<Props, State>
{
    state = {
        showPopper: false,
    }

    _ref!: HTMLAnchorElement

    render() {
        const { commentID, comment, username, userPicture, repoRoot, classes } = this.props
        if (comment === undefined) {
            return null
        }

        return (
            <React.Fragment>
                <a
                    className={classes.link}
                    onClick={undefined}
                    onMouseEnter={this.showPopper}
                    onMouseLeave={this.hidePopper}
                    ref={(x: any) => this._ref = x}
                >
                    comment {commentID}
                </a>
                <Popper
                    open={this.state.showPopper}
                    anchorEl={this._ref}
                    placement="left"
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
                                basePath={repoRoot || ''}
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

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    commentID: string
}

interface StateProps {
    comment: IComment | undefined
    username: string | undefined
    userPicture: string | undefined
    repoRoot: string | undefined
}

interface DispatchProps {}

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

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const comment = state.discussion.comments[ownProps.commentID || '']

    let username: string | undefined
    let userPicture: string | undefined
    let repoRoot: string | undefined

    if (comment) {
        username = (state.user.users[comment.userID] || {}).name || comment.userID
        userPicture = (state.user.users[comment.userID] || {}).picture
        repoRoot = (state.repository.repos[comment.repoID] || {}).path
    }

    return {
        comment,
        username,
        userPicture,
        repoRoot,
    }
}

const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(CommentLink))

