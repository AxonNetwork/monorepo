import path from 'path'
import urljoin from 'url-join'
import React from 'react'
import { connect } from 'react-redux'
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
import { renderShortcode } from 'conscience-lib/utils/markdownShortcodes'
import { setFileDetailsSidebarURI, showFileDetailsSidebar } from 'conscience-components/redux/ui/uiActions'


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

    renderCode = (node: any) => {
        return (
            <CodeViewer
                fileContents={node.value}
                language={node.language}
            />
        )
    }

    renderImg = (node: any) => {
        if (node.src.startsWith('http://') || node.src.startsWith('https://')) {
            return <img src={node.src} />
        } else {
            // images with local relative paths
            let dirname = path.dirname(this.props.uri.filename || '')
            if (dirname === '.') {
                return <img src={urljoin(directEmbedPrefix(this.props.uri), node.src)} />
            } else {
                return <img src={urljoin(directEmbedPrefix(this.props.uri), dirname, node.src)} />
            }
        }
    }

    parseShortcodes = (node: { identifier: string; contents: string }) => {
        const { identifier, contents } = node

        switch (identifier) {
            case 'image': {
                const parts = contents.split(':')
                let uri = { ...this.props.uri }
                let filename: string
                if (parts.length === 0) {
                    return null
                } else if (parts.length === 1) {
                    uri.commit = 'HEAD'
                    filename = parts[0]
                } else if (parts.length >= 2) {
                    uri.commit = parts[0]
                    filename = parts[1]
                }

                const onClick = () => {
                    this.props.setFileDetailsSidebarURI({ uri: { ...uri, filename } })
                    this.props.showFileDetailsSidebar({ open: true })
                }

                return <img src={urljoin(directEmbedPrefix(uri), filename!)} onClick={onClick} style={{ cursor: 'pointer' }} />
            }

            case 'file': {
                const parts = contents.split(':')
                let uri = { ...this.props.uri }
                if (parts.length === 1) {
                    uri.filename = parts[0]
                } else if (parts.length >= 2) {
                    uri.commit = parts[0]
                    uri.filename = parts[1]
                }
                return <FileLink uri={uri} />
            }

            case 'discussion': {
                return <DiscussionLink uri={this.props.uri} discussionID={contents} />
            }

            case 'comment': {
                return <CommentLink uri={this.props.uri} commentID={contents} />
            }

            default: {
                const rendered = renderShortcode(identifier, contents, this.props.uri)
                if (rendered === null) {
                    return (
                        <span>
                            @{identifier}:[{contents}]
                        </span>
                    )
                } else {
                    return rendered
                }
            }
        }
    }
}

interface Props {
    uri: URI
    text: string
    dirname?: string

    setFileDetailsSidebarURI: typeof setFileDetailsSidebarURI
    showFileDetailsSidebar: typeof showFileDetailsSidebar

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

const mapDispatchToProps = {
    setFileDetailsSidebarURI,
    showFileDetailsSidebar,
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(RenderMarkdown))
