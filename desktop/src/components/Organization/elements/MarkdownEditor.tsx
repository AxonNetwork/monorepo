import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import RenderMarkdown from 'components/RenderMarkdown/RenderMarkdown'
import autobind from 'utils/autobind'


@autobind
class MarkdownEditor extends React.Component<Props, State>
{
    _inputText: HTMLTextAreaElement | null = null

    constructor(props: Props){
        super(props)
        this.state = {
            contents: props.defaultContents || ""
        }
    }

    render() {
        const { isSaving, classes } = this.props
        const modified = this.state.contents !== this.props.defaultContents

        return (
            <div className={classes.root}>
                <div className={classes.toolbar}>
                    <Button
                        onClick={this.onClickSave}
                        color="secondary"
                        disabled={isSaving || !modified}
                    >
                        Save
                        {isSaving && <CircularProgress size={24} className={classes.buttonLoading} />}
                    </Button>
                    <Button onClick={this.onClickClose} color="secondary">Close</Button>
                </div>

                <div className={classes.columnContainer}>
                    <div className={classes.textareaWrapper}>
                        <TextField
                            multiline
                            fullWidth
                            variant="outlined"
                            rows="40"
                            defaultValue={this.props.defaultContents || this.state.contents}
                            onChange={this.onChangeText}
                            inputRef={x => this._inputText = x}
                        />
                    </div>

                    <div className={classes.renderedWrapper}>
                        <Card>
                            <CardContent>
                                <RenderMarkdown
                                    text={this.state.contents}
                                    basePath=""
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    onClickSave() {
        const contents = this.state.contents
        this.props.handleSave(contents)
    }

    onClickClose() {
        this.props.handleClose()

    }

    onChangeText() {
        if (!this._inputText) {
            return
        }
        this.setState({ contents: this._inputText.value })
    }
}

interface Props {
    defaultContents?: string
    isSaving: boolean
    handleSave: Function
    handleClose: Function

    classes: any
}

interface State {
    contents: string
}

const styles = (theme: Theme) => createStyles({
    root: {
        height: '100%',
        paddingBottom: 30,
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: 64,
        marginBottom: 8,
    },
    toolbarSpacer: {
        flexGrow: 1,
    },
    columnContainer: {
        display: 'flex',
        height: '100%',
    },
    textareaWrapper: {
        flexGrow: 1,
        marginRight: 30,
        maxWidth: 520,
        width: '50%',

        '& textarea': {
            width: '100%',
            height: '100%',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '0.9rem',
        },
    },
    renderedWrapper: {
        flexGrow: 1,
        width: '50%',
        marginRight: 64,
    },
    buttonLoading: {
        color: theme.palette.secondary.main,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
})

export default withStyles(styles)(MarkdownEditor)