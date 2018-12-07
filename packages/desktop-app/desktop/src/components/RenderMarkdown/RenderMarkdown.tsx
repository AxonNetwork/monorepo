import path from 'path'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import FileLink from './FileLink'
import DiscussionLink from './DiscussionLink'
import CommentLink from './CommentLink'
import CodeViewer from 'components/Repository/elements/FileViewer/CodeViewer'
import shortcodes from './remark-references'
import autobind from 'utils/autobind'


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
        return <CodeViewer contents={node.value} language={node.language} />
    }

    parseShortcodes(node: { identifier: string, contents: string }) {
        const { identifier, contents } = node

        switch (identifier) {
        case 'image':
            return <img src={'file://' + path.join(this.props.basePath, contents)} className={this.props.classes.embeddedImage} />
        case 'file':
            return <FileLink filename={contents} basePath={this.props.basePath}/>
        case 'discussion':
            return <DiscussionLink discussionID={contents} />
        case 'comment':
            return <CommentLink commentID={contents} />
        default:
            return <span>@{identifier}:[{contents}]</span>
        }
    }
}

interface Props {
    text: string
    classes: any
    basePath: string
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
