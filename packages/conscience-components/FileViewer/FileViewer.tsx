import path from 'path'
import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import RenderMarkdown from '../RenderMarkdown'
import CodeViewer from '../CodeViewer'
import DataViewer from '../DataViewer'
import { IRepo, IComment, IUser, IDiscussion, FileMode } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import { filetypes, fileViewers } from 'conscience-lib/utils/fileTypes'


@autobind
class FileViewer extends React.Component<Props, State>
{
    render() {
        const { fileContents } = this.state
        const { filename, repo, classes } = this.props
        if (!filename || !repo) {
            return null
        }

        const extension = path.extname(filename).toLowerCase().substring(1)

        // @@TODO: filetype standardization
        switch (extension) {
        case 'md':
        case 'mdown':
        case 'markdown':
            if (this.state.textViewerMode === 'raw') {
                return (
                    <Card>
                        <CardContent classes={{ root: classes.mdRoot }}>
                            <RawOrViewer
                                mode={this.state.textViewerMode}
                                onChangeMode={this.onChangeTextViewerMode}
                                classes={classes}
                             />
                            <CodeViewer
                                language={extension}
                                contents={fileContents}
                                codeColorScheme={this.props.codeColorScheme}
                                backgroundColor={this.props.backgroundColor}
                            />
                        </CardContent>
                    </Card>
                )
            } else {
                return (
                    <Card>
                        <CardContent classes={{ root: classes.mdRoot }}>
                            <RawOrViewer
                                mode={this.state.textViewerMode}
                                onChangeMode={this.onChangeTextViewerMode}
                                classes={classes}
                             />
                            <RenderMarkdown
                                text={fileContents}
                                repo={this.props.repo}
                                comments={this.props.comments}
                                users={this.props.users}
                                discussions={this.props.discussions}
                                directEmbedPrefix={this.props.directEmbedPrefix}
                                dirname={path.dirname(this.props.filename)}
                                codeColorScheme={this.props.codeColorScheme}
                                selectFile={this.props.selectFile}
                                selectDiscussion={this.props.selectDiscussion}
                            />
                        </CardContent>
                    </Card>
                )
            }

        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'png':
        case 'tif':
        case 'tiff':
        case 'go':
        case 'js':
        case 'jsx':
        case 'json':
        case 'ts':
        case 'tsx':
        case 'py':
        case 'proto':
        case 'tex':
        case 'rb':
        case 'rs':
        case 'r':
        case 'txt':
            const Viewer = fileViewers[ filetypes[extension].viewers[0] ]
            return <Viewer directEmbedPrefix={this.props.directEmbedPrefix} filename={filename} fileContents={fileContents} />

        case 'csv':
            return(
                <Card>
                    <CardContent classes={{ root: classes.dataRoot }}>
                        <DataViewer
                            fileType={extension}
                            contents={fileContents}
                        />
                    </CardContent>
                </Card>
            )

        case 'pdf':
            return (
                <Card>
                    <CardContent classes={{ root: classes.embedRoot }}>
                        <embed src={path.join(this.props.directEmbedPrefix, this.props.filename)} />
                    </CardContent>
                </Card>
            )

        default:
            return <div>We don't have a viewer for this kind of file yet.</div>
        }
    }

    onChangeTextViewerMode(mode: 'raw' | 'viewer') {
        this.setState({ textViewerMode: mode })
    }


    componentDidMount() {
        this.updateFileContents()
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.filename !== this.props.filename || prevProps.repo !== this.props.repo) {
            this.updateFileContents()
        }
    }

    async updateFileContents() {
        try {
            const fileContents = await this.props.getFileContents(this.props.filename)
            this.setState({ fileContents })
        } catch(error) {
            this.setState({ fileContents: '', error })
        }
    }
}

function RawOrViewer(props: { mode: 'raw'|'viewer', onChangeMode: (mode: 'raw'|'viewer') => void, classes: any }) {
    const { mode, onChangeMode, classes } = props
    return (
        <Typography className={classes.textViewerMode}>
            <a href="#" onClick={() => onChangeMode('raw')}    style={{ fontWeight: mode === 'raw'    ? 500 : 400 }}>Raw</a> |
            <a href="#" onClick={() => onChangeMode('viewer')} style={{ fontWeight: mode === 'viewer' ? 500 : 400 }}>Viewer</a>
        </Typography>
    )
}

interface Props {
    filename: string
    directEmbedPrefix: string

    repo: IRepo
    comments: {[commentID: string]: IComment}
    users: {[userID: string]: IUser}
    discussions: {[userID: string]: IDiscussion}
    codeColorScheme?: string | undefined
    backgroundColor?: string
    getFileContents: (filename: string) => Promise<string>
    selectFile: (payload: {filename: string | undefined, mode: FileMode}) => void
    selectDiscussion: (payload: {discussionID: string | undefined}) => void
    classes: any
}

interface State {
    textViewerMode: 'raw' | 'viewer'
    fileContents: string
    error: Error | undefined
}

const styles = () => createStyles({
    imageEmbed: {
        maxWidth: '100%',
    },
    codeContainer: {
        padding: 30,
    },
    mdRoot: {
        padding: 48,
        minWidth: 680,
    },
    codeRoot: {
        padding: 0,
        paddingBottom: '0 !important',
        minWidth: 680,
    },
    embedRoot: {
        padding: 0,
        paddingBottom: '0 !important',
        minWidth: 680,

        '& embed': {
            width: '100%',
            height: 800,
        },
    },
    dataRoot: {
    },
    textViewerMode: {
        textAlign: 'right',

        '& a': {
            textDecoration: 'none',
        },
    },
})

export default withStyles(styles)(FileViewer)
