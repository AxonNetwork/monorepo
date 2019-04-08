import path from 'path'
import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CancelIcon from '@material-ui/icons/Cancel'
import SaveIcon from '@material-ui/icons/Save'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import RenderMarkdown from 'conscience-components/RenderMarkdown'
import FormattingHelp from 'conscience-components/FormattingHelp'
import SmartTextarea from 'conscience-components/SmartTextarea'
import { selectFile } from 'conscience-components/navigation'
import { FileMode, URI } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class MarkdownEditor extends React.Component<Props, State>
{
    constructor(props: Props) {
        super(props)
        this.state = {
            currentContents: props.initialContents,
            contentsOnDisk: props.initialContents,
            fileExistsOnDisk: props.fileExistsOnDisk || false,
            error: undefined,
        }
    }

    render() {
        const { classes } = this.props
        const modified = this.state.currentContents !== this.state.contentsOnDisk

        return (
            <div className={classes.root}>
                <div className={classes.toolbar}>
                    <IconButton
                        onClick={this.onClickSave}
                        disabled={!modified}
                    >
                        <SaveIcon />
                    </IconButton>
                    <IconButton onClick={this.onClickClose}>
                        <CancelIcon />
                    </IconButton>
                </div>

                <div className={classes.columnContainer}>
                    <div className={classes.textareaWrapper}>
                        <SmartTextarea
                            uri={this.props.uri}
                            initialContents={this.props.initialContents}
                            rows={1}
                            rowsMax={false}
                            variant="outlined"
                            onChange={this.onChangeText}
                            InputProps={{
                                margin: 'none',
                                classes: {
                                    root: classes.textareaRoot,
                                    inputMultiline: classes.textareaRoot,
                                }
                            }}
                            classes={{ root: classes.textareaRoot }}
                            textFieldClasses={{ root: classes.textareaRoot }}
                        />
                    </div>

                    <div className={classes.renderedWrapper}>
                        <Card>
                            <CardContent>
                                <RenderMarkdown
                                    uri={this.props.uri}
                                    text={this.state.currentContents}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    async onClickSave() {
        try {
            this.props.saveFileContents(this.state.currentContents)
            this.setState({ contentsOnDisk: this.state.currentContents })
        } catch (error) {
            this.setState({ error })
            return
        }
    }

    onClickClose() {
        let uri = this.props.uri
        if (!this.state.fileExistsOnDisk) {
            const dir = path.dirname(this.props.uri.filename || '')
            if (dir === '.') {
                uri = { ...this.props.uri, filename: undefined }
            } else {
                uri = { ...this.props.uri, filename: dir }
            }
        }
        selectFile(uri, FileMode.View)
    }

    onChangeText(value: string) {
        this.setState({ currentContents: value })
    }
}

interface Props {
    uri: URI
    initialContents: string
    fileExistsOnDisk: boolean
    saveFileContents: (contents: string) => Promise<void>
    classes: any
}

interface State {
    currentContents: string
    contentsOnDisk: string
    fileExistsOnDisk: boolean
    error: Error | undefined
}

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 222px)',
        paddingBottom: 30,
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    columnContainer: {
        display: 'flex',
        flexGrow: 1,
        height: '100%',
    },
    textareaWrapper: {
        flexGrow: 1,
        width: '50%',
        height: '100%',
        marginRight: 30,

        '& textarea': {
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '0.9rem',
        },
    },
    renderedWrapper: {
        flexGrow: 1,
        width: '50%',
        height: '100%',
        overflowY: 'scroll'
    },
    progressContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 256,
    },

    textareaRoot: {
        height: '100%',
    },
})

export default withStyles(styles)(MarkdownEditor)