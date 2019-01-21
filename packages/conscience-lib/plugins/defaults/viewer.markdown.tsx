import path from 'path'
import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import RenderMarkdown from 'conscience-components/RenderMarkdown/RenderMarkdown'
import autobind from 'conscience-lib/utils/autobind'
import { URI } from 'conscience-lib/common'


@autobind
class MarkdownViewerPlugin extends React.Component<Props, State>
{
    state = {
        textViewerMode: 'viewer' as IViewerMode,
    }

    render() {
        const { fileContents, classes } = this.props

        return (
            <Card>
                <CardContent classes={{ root: classes.mdRoot }}>
                    <RenderMarkdown
                        repoID={this.props.uri.repoID}
                        text={fileContents || ''}
                        dirname={path.dirname(this.props.filename)}
                        directEmbedPrefix={''}
                    />
                </CardContent>
            </Card>
        )
    }

    onChangeTextViewerMode(mode: IViewerMode) {
        this.setState({ textViewerMode: mode })
    }
}

type Props = OwnProps & { classes: any }

interface OwnProps {
    uri: URI
    filename: string
    fileContents?: string
}

type IViewerMode = 'raw' | 'viewer'

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

export default {
    pluginType: 'file viewer',
    name: 'markdown-viewer',
    humanName: 'Default Markdown viewer',
    viewer: withStyles(styles)(MarkdownViewerPlugin),
}
