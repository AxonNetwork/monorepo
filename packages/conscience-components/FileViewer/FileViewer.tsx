import path from 'path'
import urljoin from 'url-join'
import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import RenderMarkdown from '../RenderMarkdown'
import CodeViewer from '../CodeViewer'
import { IRepo, IComment, IUser, IDiscussion, FileMode } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'
import { FileViewerComponent } from 'conscience-lib/plugins'


@autobind
class FileViewer extends React.Component<Props, State>
{
    render() {
        const { fileContents } = this.state
        const { filename, repo, classes } = this.props
        if (!filename || !repo) {
            return null
        }

        const viewers = filetypes.getViewers(filename)
        if (viewers.length === 0) {
            return <Typography>We don't have a viewer for this kind of file yet.</Typography>
        }

        const viewerName = this.state.viewerName || viewers[0].name
        let Viewer: FileViewerComponent
        for (let v of viewers) {
            if (v.name === viewerName) {
                Viewer = v.viewer
                break
            }
        }
        if (Viewer === undefined) {
            Viewer = viewers[0].viewer
        }

        return (
            <div>
                <Select value={viewerName} onChange={this.onChangeViewer}>
                    {viewers.map(viewer => <MenuItem value={viewer.name}>{viewer.humanName}</MenuItem>)}
                </Select>

                <Viewer
                    repoID={this.props.repo.repoID}
                    directEmbedPrefix={this.props.directEmbedPrefix}
                    filename={filename}
                    fileContents={fileContents}
                />
            </div>
        )
    }

    onChangeViewer(evt: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({ viewerName: evt.target.value })
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
    viewerName: string | undefined
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
