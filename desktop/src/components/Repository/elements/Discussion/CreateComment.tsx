import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import autobind from 'utils/autobind'
import { IDiscussion, IRepoFile } from 'common'
import SmartTextarea from 'components/SmartTextarea'
import CommentWrapper from 'components/Repository/elements/Discussion/CommentWrapper'

@autobind
class CreateComment extends React.Component<Props>
{
    _inputComment!: HTMLInputElement

    onSubmit() {
        this.props.onSubmit(this._inputComment.value)
    }

    render() {
        const { classes } = this.props
        return (
            <CommentWrapper
                username={this.props.username}
                userPicture={this.props.userPicture}
                created={new Date().getTime()}
            >
                <form className={classes.form} onSubmit={this.onSubmit}>
                    <SmartTextarea
                        placeholder="Write your comment"
                        rows={3}
                        inputRef={x => this._inputComment = x}
                        files={this.props.files}
                        discussions={this.props.discussions}
                        onSubmit={this.onSubmit}
                    />
                    <Button color="secondary" variant="contained" onClick={this.onSubmit}>
                        Comment
                    </Button>
                    {/* <FormHelperText error className={classes.error}>{this.state.error}</FormHelperText> */}
                </form>
            </CommentWrapper>
        )
    }
}

interface Props {
    files: {[name: string]: IRepoFile} | undefined
    discussions: {[created: number]: IDiscussion}
    username: string | undefined
    userPicture: string | undefined
    onSubmit: (comment: string) => void
    classes: any
}

const styles = (theme: Theme) => createStyles({
    reply: {
        display: 'flex',
        alignSelf: 'flex-end',
        width: '100%',
        borderTop: '1px solid',
        borderColor: theme.palette.grey[300],
    },
    submit: {
        padding: theme.spacing.unit,
        borderRadius: 4,
    },
    icon: {
        color: theme.palette.grey[700],
    },
})

export default withStyles(styles)(CreateComment)
