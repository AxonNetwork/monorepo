import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'
import { autobind } from 'conscience-lib/utils'
import CommentWrapper from '../CommentWrapper'
import SmartTextarea from '../SmartTextarea'
import { IRepoFile, IDiscussion, IUser } from 'conscience-lib/common'


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
        const { user, classes } = this.props

        return (
            <CommentWrapper
                classes={this.props.commentWrapperClasses}
                username={user.name}
                userPicture={user.picture}
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

interface Props {
    repoID: string | undefined
    attachedTo?: string
    commentWrapperClasses?: any
    user: IUser
    files: {[name: string]: IRepoFile}
    discussions: {[discussionID: string]: IDiscussion}
    createDiscussion: (payload: {repoID: string, subject: string, commentText: string}) => void
    classes: any
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

export default withStyles(styles)(CreateDiscussion)
