import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'
import { createDiscussion } from 'redux/discussion/discussionActions'
import autobind from 'utils/autobind'
import CommentWrapper from './CommentWrapper'
import SmartTextarea from 'components/SmartTextarea'
import { IGlobalState } from 'redux/store'
import { IRepoFile, IDiscussion } from 'common'
import { keyBy } from 'lodash'


@autobind
class CreateDiscussion extends React.Component<Props, State>
{
    state = {
        error: '',
    }

    _inputSubject!: HTMLInputElement
    _inputComment!: any

    onSubmit() {
        const valid = this._inputComment.getValue().length > 0 && this._inputSubject.value.length > 0
        if (valid && this.props.repoID) {
            let subject = this._inputSubject.value
            if (this.props.attachedTo !== undefined) {
                subject = `[${this.props.attachedTo}] ${subject}`
            }
            this.setState({ error: '' })
            this.props.createDiscussion({
                repoID: this.props.repoID,
                subject: subject,
                commentText: this._inputComment.getValue(),
            })
        } else {
            this.setState({ error: 'Oops! You need both a subject and a comment.' })
        }
    }

    render() {
        const classes = this.props.classes
        return (
            <CommentWrapper
                classes={this.props.commentWrapperClasses}
                username={this.props.username}
                userPicture={this.props.userPicture}
                created={new Date().getTime()}
            >
                <form className={classes.form} onSubmit={this.onSubmit}>
                    <TextField
                        id="subject"
                        label="Subject"
                        className={classes.textField}
                        fullWidth
                        inputRef={x => this._inputSubject = x}
                    />
                    <SmartTextarea
                        placeholder="Start the discussion"
                        rows={3}
                        innerRef={(x: any) => this._inputComment = x}
                        files={this.props.files}
                        discussions={this.props.discussions}
                        onSubmit={() => this.onSubmit()}
                    />
                    <Button color="secondary" variant="contained" onClick={this.onSubmit}>
                        Create
                    </Button>
                    <FormHelperText error className={classes.error}>{this.state.error}</FormHelperText>
                </form>
            </CommentWrapper>
        )
    }
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    repoRoot: string
    attachedTo?: string
    commentWrapperClasses?: any
}

interface StateProps {
    repoID: string | undefined
    username: string | undefined
    userPicture: string | undefined
    files: {[name: string]: IRepoFile}
    discussions: {[discussionID: string]: IDiscussion}
}

interface DispatchProps {
    createDiscussion: typeof createDiscussion
}

interface State {
    error: string
}

const styles = () => createStyles({
    commentWrapper: {}, // this is just here so it can be overridden
    form: {
        width: '100%',
        padding: '16px 36px',
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const repo = state.repository.repos[ownProps.repoRoot || ''] || {}
    const repoID = repo.repoID
    const username = (state.user.users[ state.user.currentUser || '' ] || {}).name
    const userPicture = (state.user.users[ state.user.currentUser || '' ] || {}).picture
    const discussionIDs = state.discussion.discussionsByRepo[repo.repoID] || []
    const discussionList = discussionIDs.map((id: string) => state.discussion.discussions[id])
    const discussions = keyBy(discussionList, 'discussionID')
    return {
        repoID,
        username,
        userPicture,
        files: repo.files || {},
        discussions: discussions,
    }
}

const mapDispatchToProps = {
    createDiscussion,
}

const CreateDiscussionContainer = connect< StateProps, DispatchProps, OwnProps, IGlobalState >(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(CreateDiscussion))

export default CreateDiscussionContainer
