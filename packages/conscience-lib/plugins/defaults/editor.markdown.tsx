import isEqual from 'lodash/isEqual'
import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import autobind from 'conscience-lib/utils/autobind'
import { URI, FileMode } from 'conscience-lib/common'
import LargeProgressSpinner from 'conscience-components/LargeProgressSpinner'
import MarkdownEditor from 'conscience-components/MarkdownEditor'
import * as filetypes from 'conscience-lib/utils/fileTypes'
import { getFileContents, saveFileContents } from 'conscience-components/env-specific'
import { selectFile } from 'conscience-components/navigation'


@autobind
class MarkdownEditorPlugin extends React.Component<Props>
{
    state = {
        fileContents: null,
    }

    render() {
        const { fileContents } = this.state
        if (fileContents === null) {
            return <LargeProgressSpinner />
        }

        return (
            <MarkdownEditor
                uri={this.props.uri}
                initialContents={fileContents}
                saveFileContents={this.saveFileContents}
            />
        )
    }

    componentDidMount() {
        if (!this.props.isNewFile) {
            this.updateFileContents()
        } else {
            this.setState({ fileContents: '' })
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (!isEqual(prevProps.uri, this.props.uri) && !this.props.isNewFile) {
            this.updateFileContents()
        }
    }

    async updateFileContents() {
        if (!this.props.uri.filename) {
            this.setState({ fileContents: null })
            return
        }

        // Don't handle binary files, only text
        if (!filetypes.isTextFile(this.props.uri.filename)) {
            this.setState({ fileContents: null })
            return
        }

        try {
            const fileContents = await getFileContents(this.props.uri)
            this.setState({ fileContents })
        } catch (error) {
            this.setState({ fileContents: null, error })
        }
    }

    async saveFileContents(fileContents: string) {
        await saveFileContents(this.props.uri, fileContents)
        if (this.props.isNewFile) {
            selectFile(this.props.uri, FileMode.Edit)
        }
    }
}

type Props = OwnProps & { classes: any }

interface OwnProps {
    uri: URI
    isNewFile: boolean
}

const styles = () => createStyles({
})

export default {
    pluginType: 'file editor',
    name: 'markdown-editor',
    humanName: 'Default Markdown editor',
    editor: withStyles(styles)(MarkdownEditorPlugin),
}
