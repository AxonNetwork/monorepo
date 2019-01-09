import path from 'path'
import urljoin from 'url-join'
import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import RenderMarkdown from '../RenderMarkdown'
import CodeViewer from '../CodeViewer'
import { IRepo, IComment, IUser, IDiscussion, FileMode } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'


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
        case 'pdf':
            return (
                <Card>
                    <CardContent classes={{ root: classes.embedRoot }}>
                        <embed src={urljoin(this.props.directEmbedPrefix, this.props.filename)} />
                    </CardContent>
                </Card>
            )

        default:
            console.log('file contents', filename)
            const viewers = filetypes.getViewers(filename)
            if (viewers.length === 0) {
                return <Typography>We don't have a viewer for this kind of file yet.</Typography>
            }

            const Viewer = viewers[0]

            return <Viewer
                        repoID={this.props.repo.repoID}
                        directEmbedPrefix={this.props.directEmbedPrefix}
                        filename={filename}
                        fileContents={fileContents}
                    />
        }
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
        // Don't handle binary files, only text
        if (!filetypes.isTextFile(this.props.filename)) {
            this.setState({ fileContents: '' })
            return
        }

        try {
            const fileContents = await this.props.getFileContents(this.props.filename)
            this.setState({ fileContents })
        } catch (error) {
            this.setState({ fileContents: '', error })
        }
    }
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
    embedRoot: {
        padding: 0,
        paddingBottom: '0 !important',
        minWidth: 680,

        '& embed': {
            width: '100%',
            height: 800,
        },
    },
})

export default withStyles(styles)(FileViewer)
