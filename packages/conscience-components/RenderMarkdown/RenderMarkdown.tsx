import React from 'react'
import ReactMarkdown from 'react-markdown'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import FileLink from './FileLink'
import DiscussionLink from './DiscussionLink'
import CommentLink from './CommentLink'
import CodeViewer from '../CodeViewer'
import shortcodes from './remark-references'
import { IComment, IUser, IDiscussion }  from 'conscience-lib/common'
import { autobind }  from 'conscience-lib/utils'
import path from 'path'


@autobind
class RenderMarkdown extends React.Component<Props>
{
    render() {
        return (
            <Typography className={this.props.classes.wrapper}>
                <ReactMarkdown
                    source={this.props.text}
                    plugins={[ shortcodes ]}
                    renderers={{
                        shortcode: this.parseShortcodes,
                        code: this.renderCode,
                    }}
                />
            </Typography>
        )
    }

    renderCode(node: any) {
        return (
            <CodeViewer
                contents={node.value}
                language={node.language}
                codeColorScheme={this.props.codeColorScheme}
            />
        )
    }

    parseShortcodes(node: { identifier: string, contents: string }) {
        const { identifier, contents } = node
        const { comments, users, discussions, repoRoot } = this.props
        console.log(node)

        switch (identifier) {
        case 'image':
            return <img src={'file://' + path.join(this.props.repoRoot, contents)} className={this.props.classes.embeddedImage} />
        case 'file':
            return (
                <FileLink
                    filename={contents}
                    repoRoot={repoRoot}
                    selectFile={this.props.selectFile}
                />
            )
        case 'discussion':
            const subject = (discussions[contents] || {} as any).subject || ''
            return (
                <DiscussionLink
                    discussionID={contents}
                    discussionSubject={subject}
                    selctDiscussion={this.props.selctDiscussion}
                />
            )
        case 'comment':
            return (
                <CommentLink
                    commentID={contents}
                    comments={comments}
                    users={users}
                    repoRoot={repoRoot}
                    discussions={discussions}
                    codeColorScheme={this.props.codeColorScheme}
                    selectFile={this.props.selectFile}
                    selctDiscussion={this.props.selctDiscussion}
                />
            )
        default:
            return <span>@{identifier}:[{contents}]</span>
        }
    }
}

interface Props {
    text: string
    repoRoot: string
    comments: {[commentID: string]: IComment}
    users: {[userID: string]: IUser}
    discussions: {[userID: string]: IDiscussion}
    codeColorScheme?: string | undefined
    selectFile: (payload: {filename: string}) => void
    selectDiscussion: (payload: {discussionID: string}) => void
    classes: any
}

const styles = () => createStyles({
    embeddedImage: {
        maxWidth: '100%',
        display: 'block',
    },
    wrapper: {
        '& code': {
            backgroundColor: '#f5f5f5',
            color: '#d00707',
            padding: '2px 3px',
            borderRadius: 2,
            fontFamily: 'Consolas, Menlo, Monaco, "Courier New", Courier, monospace',
            fontSize: '0.8rem',
        },
        '& pre code': {
            color: 'inherit',
            backgroundColor: 'inherit',
            padding: 'inherit',
            borderRadius: 'unset',
        },
        '& img': {
            display: 'block',
            margin: '30px auto',
        },
    },
})

export default withStyles(styles)(RenderMarkdown)
