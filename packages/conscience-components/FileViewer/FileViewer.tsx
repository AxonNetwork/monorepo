import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import RenderMarkdown from '../RenderMarkdown'
import CodeViewer from '../CodeViewer'
import DataViewer from '../DataViewer'
import { IRepo, IComment, IUser, IDiscussion, FileMode } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import path from 'path'


@autobind
class FileViewer extends React.Component<Props, State>
{
    render() {
        const { filename, repo, classes } = this.props
        if (!filename || !repo) {
            return null
        }

        const extension = path.extname(filename).toLowerCase().substring(1)

        const fileContents = ((repo.files || {})[filename] || {}).contents || ''

        // @@TODO: filetype standardization
        switch (extension) {
        case 'md':
        case 'mdown':
        case 'markdown':
            return (
                <Card>
                    <CardContent classes={{ root: classes.mdRoot }}>
                        <RenderMarkdown
                            text={fileContents}
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
            )
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'png':
        case 'tif':
        case 'tiff':
            return <img src={'file://' + path.join(repo.path, filename)} className={classes.imageEmbed} />
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
            return (
                <Card>
                    <CardContent classes={{ root: classes.codeRoot }}>
                        <CodeViewer
                            language={extension}
                            contents={fileContents}
                            codeColorScheme={this.props.codeColorScheme}
                            backgroundColor={this.props.backgroundColor}
                        />
                    </CardContent>
                </Card>
            )
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
        default:
            return <div>We don't have a viewer for this kind of file yet.</div>
        }
    }
}

interface Props {
    filename: string
    repo: IRepo
    comments: {[commentID: string]: IComment}
    users: {[userID: string]: IUser}
    discussions: {[userID: string]: IDiscussion}
    codeColorScheme?: string | undefined
    backgroundColor?: string
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
    codeRoot: {
        padding: 0,
        paddingBottom: '0 !important',
        minWidth: 680,
    },
    dataRoot: {
    }
})

export default withStyles(styles)(FileViewer)
