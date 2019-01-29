import path from 'path'
import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import RenderMarkdown from 'conscience-components/RenderMarkdown/RenderMarkdown'
import autobind from 'conscience-lib/utils/autobind'
import { URI } from 'conscience-lib/common'


@autobind
class MarkdownViewerPlugin extends React.Component<Props>
{
    render() {
        const { fileContents, classes } = this.props

        return (
            <Card>
                <CardContent classes={{ root: classes.mdRoot }}>
                    <RenderMarkdown
                        uri={this.props.uri}
                        text={fileContents || ''}
                        dirname={path.dirname(this.props.uri.filename || '')}
                    />
                </CardContent>
            </Card>
        )
    }
}

type Props = OwnProps & { classes: any }

interface OwnProps {
    uri: URI
    fileContents?: string
}

const styles = () => createStyles({
    mdRoot: {
        padding: 48,
    },
    textViewerMode: {
        textAlign: 'right',

        '& a': {
            textDecoration: 'none',
        },
    },
})

export default {
    pluginType: 'file viewer',
    name: 'markdown-viewer',
    humanName: 'Default Markdown viewer',
    viewer: withStyles(styles)(MarkdownViewerPlugin),
}
