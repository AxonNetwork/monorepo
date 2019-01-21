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
import { IRepo, IUser, IDiscussion, IComment, FileMode } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'
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
        const { filename, repo, classes } = this.props

        const modified = this.state.contentsOnDisk !== this.state.fileContents

        return (
            <div className={classes.root}>
                <Breadcrumbs
                    repoRoot={repo.path || repo.repoID}
                    selectedFolder={filename}
                    selectFile={this.props.selectFile}
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
                                    text={this.state.fileContents}
                                    repo={this.props.repo}
                                    comments={this.props.comments}
                                    users={this.props.users}
                                    discussions={this.props.discussions}
                                    directEmbedPrefix={this.props.directEmbedPrefix}
                                    dirname=""
                                    codeColorScheme={this.props.codeColorScheme}
                                    getFileContents={this.props.getFileContents}
                                    selectFile={this.props.selectFile}
                                    selectDiscussion={this.props.selectDiscussion}
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
        if (prevProps.filename !== this.props.filename || prevProps.repo.path !== this.props.repo.path) {
            this.updateFileContents()
        }
    }

    async updateFileContents() {
        // Don't handle binary files, only text
        if (!filetypes.isTextFile(this.props.filename)) {
            this.setState({ fileContents: '' })
            return
        }

        try {
            const fileContents = await this.props.getFileContents(this.props.filename)
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
            this.props.saveFileContents({
                contents: this.state.fileContents,
                repoID: this.props.repo.repoID,
                filename: this.props.filename,
            })
        } catch (error) {
            this.setState({ error })
            return
        }
        this.setState({ contentsOnDisk: this.state.fileContents })
    }

    onClickClose() {
        if (this.state.fileExistsOnDisk) {
            this.props.selectFile({ filename: this.props.filename, mode: FileMode.View })
        } else {
            const dir = path.dirname(this.props.filename)
            if (dir === '.') {
                this.props.selectFile({ filename: undefined, mode: FileMode.View })
            } else {
                this.props.selectFile({ filename: dir, mode: FileMode.View })
            }
        }
    }

    onChangeText() {
        if (!this._inputText) {
            return
        }
        this.setState({ fileContents: this._inputText.value })
    }
}

interface Props {
    repo: IRepo
    filename: string
    comments: { [commentID: string]: IComment }
    users: { [userID: string]: IUser }
    discussions: { [userID: string]: IDiscussion }
    codeColorScheme?: string | undefined
    fileExistsOnDisk?: boolean
    directEmbedPrefix: string

    getFileContents: (filename: string) => Promise<string>
    selectFile: (payload: { filename: string | undefined, mode: FileMode }) => void
    selectDiscussion: (payload: { discussionID: string | undefined }) => void
    saveFileContents: (payload: { contents: string, repoID: string, filename: string }) => Promise<{}>
    // saveFileContents: (payload: { contents: string, repoID: string, filename: string, callback: (error?: Error) => void }) => void

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