import isEqual from 'lodash/isEqual'
import path from 'path'
import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import RenderMarkdown from 'conscience-components/RenderMarkdown/RenderMarkdown'
import autobind from 'conscience-lib/utils/autobind'
import { URI } from 'conscience-lib/common'
import { getFileContents } from 'conscience-components/env-specific'


@autobind
class MarkdownViewerPlugin extends React.Component<Props, State>
{
    state = {
        fileContents: '',
    }

    render() {
        const { classes } = this.props
        const { fileContents } = this.state

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

    componentDidMount() {
        this.updateFileContents()
    }

    componentDidUpdate(prevProps: Props) {
        if (!isEqual(prevProps.uri, this.props.uri)) {
            this.updateFileContents()
        }
    }

    async updateFileContents() {
        if (!this.props.uri.filename) {
            this.setState({ fileContents: null })
            return
        }

        try {
            const fileContents = (await getFileContents(this.props.uri)) as string
            this.setState({ fileContents })
        } catch (error) {
            this.setState({ fileContents: null })
        }
    }
}

type Props = OwnProps & { classes: any }

interface OwnProps {
    uri: URI
}

interface State {
    fileContents: string|null
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
    pluginType: 'file editor',
    name: 'markdown-viewer',
    humanName: 'Default Markdown viewer',
    editor: withStyles(styles)(MarkdownViewerPlugin),
    widthMode: 'breakpoints',
}
