import path from 'path'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import FileLink from './FileLink'
import DiscussionLink from './DiscussionLink'
import shortcodes from './remark-references'
import autobind from 'utils/autobind'


@autobind
class RenderMarkdown extends React.Component<Props>
{
    render() {
        return (
            <Typography>
                <ReactMarkdown
                    source={this.props.text}
                    plugins={[ shortcodes ]}
                    renderers={{ shortcode: this.parseShortcodes }}
                />
            </Typography>
        )
    }

    parseShortcodes(node: { identifier: string, contents: string }) {
        const { identifier, contents } = node

        switch (identifier) {
        case 'image':
            return <img src={'file://' + path.join(this.props.basePath, contents)} className={this.props.classes.embeddedImage} />
        case 'file':
            return <FileLink fileRef={contents} />
        case 'discussion':
            return <DiscussionLink discussionID={parseInt(contents, 10)} />
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
    },
})

export default withStyles(styles)(RenderMarkdown)
