import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'
import { autobind } from 'conscience-lib/utils'
import CommentWrapper from '../CommentWrapper'
import SmartTextarea from '../SmartTextarea'
import { createDiscussion } from '../redux/discussion/discussionActions'
import { IGlobalState } from '../redux'
import { IUser, URI } from 'conscience-lib/common'


@autobind
class CreateDiscussion extends React.Component<Props, State>
{
    state = {
        newCommentText: '',
        error: '',
    }

    _inputSubject!: HTMLInputElement

    onSubmit() {
        const { newCommentText } = this.state
        const valid = newCommentText.length > 0 && this._inputSubject.value.length > 0
        if (valid && this.props.uri) {
            let subject = this._inputSubject.value
            if (this.props.attachedTo !== undefined) {
                subject = `[${this.props.attachedTo}] ${subject}`
            }
            this.setState({ error: '' })
            this.props.createDiscussion({
                uri: this.props.uri,
                subject: subject,
                commentText: newCommentText,
            })
        } else {
            this.setState({ error: 'Oops! You need both a subject and a comment.' })
        }
    }

    onChangeNewCommentText = (newCommentText: string) => {
        this.setState({ newCommentText })
    }

    render() {
        const { user, classes } = this.props

        return (
            <CommentWrapper
                classes={this.props.commentWrapperClasses}
                user={user}
                created={"right now"}
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
                        uri={this.props.uri}
                        placeholder="Start the discussion"
                        value={this.state.newCommentText}
                        rows={3}
                        onChange={this.onChangeNewCommentText}
                        onSubmit={this.onSubmit}
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
    uri: URI
    attachedTo?: string
    commentWrapperClasses?: any
}

interface StateProps {
    user: IUser
}

interface DispatchProps {
    createDiscussion: typeof createDiscussion
}

interface State {
    newCommentText: string
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
    return {
        user: state.user.users[state.user.currentUser || ''],
    }
}

const mapDispatchToProps = {
    createDiscussion
}

export default connect<StateProps, DispatchProps, OwnProps, IGlobalState>(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(CreateDiscussion))
