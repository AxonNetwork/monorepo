import path from 'path'
import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import CodeViewer from 'conscience-components/CodeViewer/CodeViewer'
import RenderMarkdown from 'conscience-components/RenderMarkdown/RenderMarkdown'
import autobind from 'conscience-lib/utils/autobind'

import { IRepo, IComment, IUser, IDiscussion, FileMode } from 'conscience-lib/common'

@autobind
class MarkdownViewer extends React.Component<Props, State>
{
    state = {
        textViewerMode: 'viewer',
    }

    render() {
        const { fileContents, classes } = this.props

        if (this.state.textViewerMode === 'raw') {
            const extension = path.extname(this.props.filename).toLowerCase().substring(1)
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
                            selectFile={null /*this.props.selectFile*/}
                            selectDiscussion={null /*this.props.selectDiscussion*/}
                        />
                    </CardContent>
                </Card>
            )
        }
    }

    onChangeTextViewerMode(mode: 'raw'|'viewer') {
        this.setState({ textViewerMode: mode })
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

const styles = () => createStyles({
    mdRoot: {
        padding: 48,
        minWidth: 680,
    },
    textViewerMode: {
        textAlign: 'right',

        '& a': {
            textDecoration: 'none',
        },
    },
})

type Props = OwnProps & StateProps

interface OwnProps {
    repoID: string
    directEmbedPrefix: string
    filename: string
    fileContents?: string
}

interface StateProps {
    repo: IRepo
    users: {[userID: string]: IUser}
    discussions: {[userID: string]: IDiscussion}
    comments: {[commentID: string]: IComment}
    codeColorScheme: string | undefined
}

interface State {
    textViewerMode: 'raw' | 'viewer'
}

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
    viewer: connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MarkdownViewer)),
}
