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
import { autobind } from 'conscience-lib/utils'
import { directEmbedPrefix } from 'conscience-components/env-specific'
import { URI } from 'conscience-lib/common'


@autobind
class RenderMarkdown extends React.Component<Props>
{
    render() {
        return (
            <Typography className={this.props.classes.wrapper}>
                <ReactMarkdown
                    source={this.props.text}
                    plugins={[shortcodes]}
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
                fileContents={node.value}
                language={node.language}
            />
        )
    }

    renderImg(node: any) {
        if (node.src.startsWith('http://') || node.src.startsWith('https://')) {
            return <img src={node.src} />
        } else {
            // images with local relative paths
            return <img src={urljoin(directEmbedPrefix(this.props.uri), this.props.dirname || '', node.src)} />
        }
    }

    parseShortcodes(node: { identifier: string; contents: string }) {
        const { identifier, contents } = node

        switch (identifier) {
            case 'image':
                return (
                    <img src={urljoin(directEmbedPrefix(this.props.uri), contents)} />
                )
            case 'file':
                return (
                    <FileLink uri={this.props.uri} />
                )
            case 'discussion':
                return (
                    <DiscussionLink uri={this.props.uri} discussionID={contents} />
                )
            case 'comment':
                return (
                    <CommentLink uri={this.props.uri} commentID={contents} />
                )
            default:
                return (
                    <span>
                        @{identifier}:[{contents}]
                    </span>
                )
        }
    }
}

interface Props {
    uri: URI
    text: string
    dirname?: string

    classes?: any
}

const styles = () => createStyles({
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
            maxWidth: '100%',
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
