import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Popper from '@material-ui/core/Popper'
import { autobind } from 'conscience-lib/utils'
import CommentWrapper from '../CommentWrapper'
import RenderMarkdown from '../RenderMarkdown'
import { IComment, IUser, URI } from 'conscience-lib/common'
import { IGlobalState } from 'conscience-components/redux'

@autobind
class CommentLink extends React.Component<Props, State>
{
    state = {
        showPopper: false,
    }

    _anchorElement: HTMLAnchorElement | null = null

    render() {
        const { comment, classes } = this.props
        if (!comment) {
            return null
        }

        const boundariesElement = document.getElementById('hihihi') // @@TODO: either pass ref via props, or rename div ID to something sane

        return (
            <React.Fragment>
                <a
                    className={classes.link}
                    onClick={undefined}
                    onMouseEnter={this.showPopper}
                    onMouseLeave={this.hidePopper}
                    ref={x => this._anchorElement = x}
                >
                    comment {comment.commentID}
                </a>
                <Popper
                    open={this.state.showPopper}
                    anchorEl={this._anchorElement}
                    placement="right"
                    onMouseEnter={this.showPopper}
                    onMouseLeave={this.hidePopper}
                    className={classes.popper}
                    style={{ maxHeight: window.innerHeight * 0.8 }}
                    popperOptions={{
                        modifiers: {
                            preventOverflow: { enabled: true, boundariesElement },
                        },
                    }}
                >
                    <CommentWrapper
                        user={this.props.user}
                        created={comment.created}
                        classes={{ comment: classes.comment, commentBody: classes.commentBody, commentText: classes.commentText }}
                        style={{ maxHeight: window.innerHeight * 0.8 }}
                    >
                        <RenderMarkdown
                            text={comment.text}
                            uri={this.props.uri}
                        />
                    </CommentWrapper>
                </Popper>
            </React.Fragment>
        )
    }

    showPopper = () => {
        this.setState({ showPopper: true })
    }

    hidePopper = () => {
        this.setState({ showPopper: false })
    }
}

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    uri: URI
    commentID: string
}

interface StateProps {
    comment: IComment | undefined
    user: IUser | undefined
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

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const comment = state.discussion.comments[ownProps.commentID]
    const user = comment ? state.user.users[comment.userID || ''] : undefined
    return {
        comment,
        user,
    }
}

export default connect(mapStateToProps, null)(withStyles(styles)(CommentLink))
