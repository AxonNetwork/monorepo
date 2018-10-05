import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'
import { createDiscussion } from 'redux/discussion/discussionActions'
import autobind from 'utils/autobind'
import CommentWrapper from './CommentWrapper'
import SmartTextarea from 'components/SmartTextarea'


@autobind
class CreateDiscussion extends React.Component<Props, State>
{
    state = {
        error: '',
    }

    _inputSubject!: HTMLInputElement
    _inputComment!: HTMLInputElement

    onSubmit() {
        const valid = this._inputComment.value.length > 0 && this._inputSubject.value.length > 0
        if (valid) {
            this.setState({ error: '' })
            this.props.createDiscussion({
                repoID: this.props.repoID,
                subject: this._inputSubject.value,
                commentText: this._inputComment.value,
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
                        label="Comment"
                        className={classes.textField}
                        rows={3}
                        inputRef={x => this._inputComment = x}
                        files={this.props.files}
                        discussions={this.props.discussions}
                        onSubmit={() => this.onSubmit()}
                    />
                    {/*<TextField
                        id="comment"
                        label="Comment"
                        className={classes.textField}
                        fullWidth
                        multiline
                        rows={3}
                        inputRef={x => this._inputComment = x}
                    />*/}
                    <Button color="secondary" variant="contained" onClick={this.onSubmit}>
                        Create
                    </Button>
                    <FormHelperText error className={classes.error}>{this.state.error}</FormHelperText>
                </form>
            </CommentWrapper>
        )
    }
}

interface Props {
    repoID: string

    username: string | undefined
    files: {[name: string]: IRepoFile}
    discussions: {[created: number]: IDiscussion}

    createDiscussion: typeof createDiscussion
    commentWrapperClasses?: any
    classes: any
}

interface State {
    error: string
}

const styles = (theme: Theme) => createStyles({
    commentWrapper: {}, // this is just here so it can be overridden
    form: {
        width: '100%',
        padding: '16px 36px',
    },
    textField: {
        display: 'block',
        marginBottom: theme.spacing.unit,
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: Props) => {
    const repo = state.repository.repos[ownProps.repoRoot] || {}
    const username = (state.user.users[ state.user.currentUser || '' ] || {}).name
    return {
        username,
        files: repo.files || {},
        discussions: state.discussion.discussions[repo.repoID] || {},
    }
}

const mapDispatchToProps = {
    createDiscussion,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(CreateDiscussion))

