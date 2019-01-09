import urljoin from 'url-join'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import FileLink from './FileLink'
import DiscussionLink from './DiscussionLink'
import CommentLink from './CommentLink'
import CodeViewer from '../CodeViewer'
import shortcodes from './remark-references'
import { IRepo, IComment, IUser, IDiscussion, FileMode }  from 'conscience-lib/common'
import { autobind }  from 'conscience-lib/utils'


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
                        image: this.renderImg,
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

    renderImg(node: any) {
        if (node.src.startsWith('http://') || node.src.startsWith('https://')) {
            return <img src={node.src} />
        } else {
            return <img src={urljoin(this.props.directEmbedPrefix, this.props.dirname, node.src)} />
        }
    }

    parseShortcodes(node: { identifier: string, contents: string }) {
        const { identifier, contents } = node
        const { repo, comments, users, discussions } = this.props

        switch (identifier) {
        case 'image':
            return <img src={urljoin(this.props.directEmbedPrefix, contents)} className={this.props.classes.embeddedImage} />
        case 'file':
            return (
                <FileLink
                    filename={contents}
                    repo={repo}
                    comments={comments}
                    users={users}
                    discussions={discussions}
                    codeColorScheme={this.props.codeColorScheme}
                    selectFile={this.props.selectFile}
                    selectDiscussion={this.props.selectDiscussion}
                />
            )
        case 'discussion':
            const subject = (discussions[contents] || {} as any).subject || ''
            return (
                <DiscussionLink
                    discussionID={contents}
                    discussionSubject={subject}
                    selectDiscussion={this.props.selectDiscussion}
                />
            )
        case 'comment':
            return (
                <CommentLink
                    commentID={contents}
                    comments={comments}
                    users={users}
                    repo={repo}
                    discussions={discussions}
                    codeColorScheme={this.props.codeColorScheme}
                    selectFile={this.props.selectFile}
                    selectDiscussion={this.props.selectDiscussion}
                />
            )
        default:
            return <span>@{identifier}:[{contents}]</span>
        }
    }
}

interface Props {
    text: string
    repo: IRepo
    comments: {[commentID: string]: IComment}
    users: {[userID: string]: IUser}
    discussions: {[userID: string]: IDiscussion}
    directEmbedPrefix: string
    dirname: string
    codeColorScheme?: string | undefined
    selectFile: (payload: {filename: string | undefined, mode: FileMode}) => void
    selectDiscussion: (payload: {discussionID: string | undefined}) => void
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
        '& blockquote': {
            borderLeft: '2px solid #dedede',
            marginLeft: 4,
            paddingLeft: '1em',
            color: '#848484',
            fontStyle: 'italic',
        },
    },
})

export default withStyles(styles)(RenderMarkdown)
