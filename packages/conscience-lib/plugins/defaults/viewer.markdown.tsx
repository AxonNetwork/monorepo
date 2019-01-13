import path from 'path'
import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import RenderMarkdown from 'conscience-components/RenderMarkdown/RenderMarkdown'
import autobind from 'conscience-lib/utils/autobind'

import { IRepo, IComment, IUser, IDiscussion, FileMode } from 'conscience-lib/common'

@autobind
class MarkdownViewerPlugin extends React.Component<Props, State> {
    state = {
        textViewerMode: 'viewer' as IViewerMode,
    }

    render() {
        const { fileContents, classes } = this.props

        return (
            <Card>
                <CardContent classes={{ root: classes.mdRoot }}>
                    <RenderMarkdown
                        text={fileContents || ''}
                        repo={this.props.repo}
                        comments={this.props.comments}
                        users={this.props.users}
                        discussions={this.props.discussions}
                        directEmbedPrefix={this.props.directEmbedPrefix}
                        dirname={path.dirname(this.props.filename)}
                        codeColorScheme={this.props.codeColorScheme}
                        getFileContents={this.getFileContents}
                        selectFile={this.selectFile}
                        selectDiscussion={this.selectDiscussion}
                    />
                </CardContent>
            </Card>
        )
    }

    // @@TODO Hook these up to redux
    async getFileContents(filename: string) {
        console.log("Get file contents: ", filename)
        return ""
    }

    selectFile(payload: { filename: string | undefined; mode: FileMode }) {
        console.log('Selected File: ', payload)
    }

    selectDiscussion(payload: { discussionID: string | undefined }) {
        console.log('Selected Discussion: ', payload)
    }

    onChangeTextViewerMode(mode: IViewerMode) {
        this.setState({ textViewerMode: mode })
    }
}

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    repoID: string
    directEmbedPrefix: string
    filename: string
    fileContents?: string
}

interface StateProps {
    repo: IRepo
    users: { [userID: string]: IUser }
    discussions: { [userID: string]: IDiscussion }
    comments: { [commentID: string]: IComment }
    codeColorScheme: string | undefined
}

type IViewerMode = 'raw' | 'viewr'

interface State {
    textViewerMode: IViewerMode
}

const styles = () => createStyles({
    mdRoot: {
        padding: 48,
        // minWidth: 680,
    },
    textViewerMode: {
        textAlign: 'right',

        '& a': {
            textDecoration: 'none',
        },
    },
})

// @@TODO: change `state` back to type `IGlobalState`?  how to handle desktop vs. web?
const mapStateToProps = (state: any, ownProps: OwnProps) => {
    return {
        repo: state.repo.repos[ownProps.repoID],
        users: state.user.users,
        discussions: state.discussion.discussions,
        comments: state.discussion.comments,
        codeColorScheme: state.user.userSettings.codeColorScheme,
    }
}

const mapDispatchToProps = {}

export default {
    pluginType: 'file viewer',
    name: 'markdown-viewer',
    humanName: 'Default Markdown viewer',
    viewer: connect(
        mapStateToProps,
        mapDispatchToProps
    )(withStyles(styles)(MarkdownViewerPlugin)),
}
