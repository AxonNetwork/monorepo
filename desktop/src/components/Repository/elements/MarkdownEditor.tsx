import fs from 'fs'
import path from 'path'
import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CancelIcon from '@material-ui/icons/Cancel'
import SaveIcon from '@material-ui/icons/Save'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import RenderMarkdown from 'components/RenderMarkdown/RenderMarkdown'
import Breadcrumbs from 'components/Repository/elements/FileList/Breadcrumbs'
import FormattingHelp from 'components/FormattingHelp'
import { selectFile } from 'redux/repository/repoActions'
import { FileMode } from 'redux/repository/repoReducer'
import autobind from 'utils/autobind'


@autobind
class MarkdownEditor extends React.Component<Props, State>
{
    state = {
        loading: true,
        contents: '',
        contentsOnDisk: '',
        fileExistsOnDisk: false,
        error: undefined,
    }

    _inputText: HTMLTextAreaElement | null = null

    render() {
        const { filename, classes } = this.props

        if (this.state.loading) {
            return <div className={classes.root}>Loading...</div>
        }

        const modified = this.state.contentsOnDisk !== this.state.contents

        return (
            <div className={classes.root}>
                <Breadcrumbs
                    repoRoot={this.props.repoRoot}
                    selectedFolder={filename}
                    classes={{ root: classes.breadcrumbs }}
                />

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
                            defaultValue={this.state.contents}
                            onChange={this.onChangeText}
                            inputRef={x => this._inputText = x}
                        />
                        <FormattingHelp />
                    </div>

                    <div className={classes.renderedWrapper}>
                        <Card>
                            <CardContent>
                                <RenderMarkdown
                                    text={this.state.contents}
                                    basePath={this.props.repoRoot || ''}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    onClickSave() {
        fs.writeFile(path.join(this.props.repoRoot, this.props.filename), this.state.contents, { encoding: 'utf8' }, (err) => {
            if (err) {
                console.error('error saving ~>', err)
                return
            }
            this.setState({ contentsOnDisk: this.state.contents })
        })
    }

    onClickClose() {
        if (this.state.fileExistsOnDisk) {
            this.props.selectFile({ selectedFile: { file: this.props.filename, isFolder: false, mode: FileMode.View } })
        } else {
            const dir = path.dirname(this.props.filename)
            if (dir === '.') {
                this.props.selectFile({ selectedFile: undefined })
            } else {
                this.props.selectFile({ selectedFile: { file: dir, isFolder: true, mode: FileMode.View } })
            }
        }
    }

    onChangeText() {
        if (!this._inputText) {
            return
        }
        this.setState({ contents: this._inputText.value })
    }

    componentDidMount() {
        fs.readFile(path.join(this.props.repoRoot, this.props.filename), 'utf8', (err: Error, contents: string) => {
            if (err) {
                // @@TODO: display error in UI
                console.error('error loading ~>', err)
                this.setState({
                    loading: false,
                    contents: this.props.defaultContents || '',
                    contentsOnDisk: '',
                    fileExistsOnDisk: false,
                    error: err,
                })
                return
            }

            this.setState({
                loading: false,
                contents: contents,
                contentsOnDisk: contents,
                fileExistsOnDisk: true,
                error: undefined,
            })
        })
    }
}

interface Props {
    repoRoot: string
    filename: string
    defaultContents?: string

    selectFile: typeof selectFile

    classes: any
}

interface State {
    loading: boolean
    contents: string
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
})

const mapDispatchToProps = {
    selectFile,
}

export default connect(
    null,
    mapDispatchToProps,
)(withStyles(styles)(MarkdownEditor))