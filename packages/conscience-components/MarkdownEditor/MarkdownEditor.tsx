import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CancelIcon from '@material-ui/icons/Cancel'
import SaveIcon from '@material-ui/icons/Save'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import RenderMarkdown from '../RenderMarkdown'
import Breadcrumbs from '../Breadcrumbs'
import FormattingHelp from '../FormattingHelp'
import { selectFile } from '../navigation'
import { getFileContents } from '../env-specific'
import { FileMode, URI } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'
import isEqual from 'lodash/isEqual'
import path from 'path'


@autobind
class MarkdownEditor extends React.Component<Props, State>
{
    state = {
        fileContents: '',
        contentsOnDisk: '',
        fileExistsOnDisk: false,
        error: undefined,
    }

    _inputText: HTMLTextAreaElement | null = null

    render() {
        const { uri, classes } = this.props

        const modified = this.state.contentsOnDisk !== this.state.fileContents

        return (
            <div className={classes.root}>
                <Breadcrumbs uri={uri} />
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
                        <TextField
                            multiline
                            fullWidth
                            variant="outlined"
                            rows="38"
                            value={this.state.fileContents}
                            onChange={this.onChangeText}
                            inputRef={x => this._inputText = x}
                        />
                        <FormattingHelp />
                    </div>

                    <div className={classes.renderedWrapper}>
                        <Card>
                            <CardContent>
                                <RenderMarkdown
                                    uri={this.props.uri}
                                    text={this.state.fileContents}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.updateFileContents()
    }

    componentDidUpdate(prevProps: Props) {
        if (!isEqual(prevProps.uri, this.props.uri)) {
            this.updateFileContents()
        }
    }

    async updateFileContents() {
        // Don't handle binary files, only text
        if (!filetypes.isTextFile(this.props.uri.filename || '')) {
            this.setState({ fileContents: '' })
            return
        }

        try {
            const fileContents = await getFileContents(this.props.uri)
            this.setState({
                fileContents,
                contentsOnDisk: fileContents,
                fileExistsOnDisk: true,
            })
        } catch (error) {
            this.setState({ fileContents: '', contentsOnDisk: '', fileExistsOnDisk: false, error })
        }
    }

    async onClickSave() {
        try {
            this.props.saveFileContents(this.state.fileContents)
        } catch (error) {
            this.setState({ error })
            return
        }
        this.setState({ contentsOnDisk: this.state.fileContents })
    }

    onClickClose() {
        let uri = this.props.uri
        if (!this.state.fileExistsOnDisk) {
            const dir = path.dirname(this.props.uri.filename || '')
            if (dir === '.') {
                uri = {
                    ...this.props.uri,
                    filename: undefined,
                }
            } else {
                uri = {
                    ...this.props.uri,
                    filename: dir
                }
            }
        }
        selectFile(uri, FileMode.View)
    }

    onChangeText() {
        if (!this._inputText) {
            return
        }
        this.setState({ fileContents: this._inputText.value })
    }
}

interface Props {
    uri: URI
    fileExistsOnDisk?: boolean
    saveFileContents: (contents: string) => Promise<{}>
    classes: any
}

interface State {
    fileContents: string
    contentsOnDisk: string
    fileExistsOnDisk: boolean
    error: Error | undefined
}

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
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
})

export default withStyles(styles)(MarkdownEditor)