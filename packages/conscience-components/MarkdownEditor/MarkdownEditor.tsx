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
import path from 'path'


@autobind
class MarkdownEditor extends React.Component<Props, State>
{
    state = {
        contents: '',
        error: undefined,
    }

    _inputText: HTMLTextAreaElement | null = null

    render() {
        const { filename, repo, classes } = this.props

        const contentsOnDisk = ((repo.files || {})[filename] || {}).contents
        if (contentsOnDisk === undefined) {
            return <div className={classes.root}>Loading...</div>
        }

        const modified = contentsOnDisk !== this.state.contents

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
                            defaultValue={contentsOnDisk}
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
                                    repo={this.props.repo}
                                    comments={this.props.comments}
                                    users={this.props.users}
                                    discussions={this.props.discussions}
                                    codeColorScheme={this.props.codeColorScheme}
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

    onClickSave() {
        this.props.saveFileContents({
            contents: this.state.contents,
            repoID: this.props.repo.repoID,
            filename: this.props.filename,
            callback: (error?: Error) => {
                if(error){
                    console.error(error)
                }
            }
        })
        // @@TODO: Error checking
    }

    onClickClose() {
        if (this.props.fileExistsOnDisk) {
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
        this.setState({ contents: this._inputText.value })
    }

    componentDidMount() {
        // fs.readFile(path.join(this.props.reprepoRoot, this.props.filename), 'utf8', (err: Error, contents: string) => {
        //     if (err) {
        //         // @@TODO: display error in UI
        //         console.error('error loading ~>', err)
        //         this.setState({
        //             loading: false,
        //             contents: this.props.defaultContents || '',
        //             contentsOnDisk: '',
        //             fileExistsOnDisk: false,
        //             error: err,
        //         })
        //         return
        //     }

        //     this.setState({
        //         loading: false,
        //         contents: contents,
        //         contentsOnDisk: contents,
        //         fileExistsOnDisk: true,
        //         error: undefined,
        //     })
        // })
    }
}

interface Props {
    repo: IRepo
    filename: string
    comments: {[commentID: string]: IComment}
    users: {[userID: string]: IUser}
    discussions: {[userID: string]: IDiscussion}
    codeColorScheme?: string | undefined
    fileExistsOnDisk?: boolean

    selectFile: (payload: { filename: string | undefined, mode: FileMode }) => void
    selectDiscussion: (payload: { discussionID: string | undefined }) => void
    saveFileContents: (payload: { contents: string, repoID: string, filename: string, callback: (error?: Error) => void }) => void

    classes: any
}

interface State {
    contents: string
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

export default withStyles(styles)(MarkdownEditor)