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
class MarkdownEditorPlugin extends React.Component<Props, State>
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
                value={fileContents}
                onChange={this.onChange}
                autoFocus
            />
        )
    }

    onChange = (value: string) => {
        this.setState({ fileContents: value })
        this.props.setFileModified(true)
    }

    componentDidMount() {
        if (!this.props.isNewFile) {
            this.updateFileContents()
        } else {
            if (this.props.uri.filename === 'README.md') {
                this.setState({ fileContents: defaultREADMEContents })
            } else {
                this.setState({ fileContents: '' })
            }
            this.props.setFileModified(true)
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
            const fileContents = (await getFileContents(this.props.uri)) as string
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

    onClickSave = () => {
        console.log('markdown editor onClickSave', this.state.fileContents)
        if (this.state.fileContents) {
            this.saveFileContents(this.state.fileContents)
        }
    }
}

type Props = OwnProps & { classes: any }

interface OwnProps {
    uri: URI
    isNewFile: boolean
    setFileModified: (modified: boolean) => void
}

interface State {
    fileContents: string|null
}

const styles = () => createStyles({
})

const defaultREADMEContents = `
# Project title

Here is a short description of the project.  You can include a summary of the work, instructions for helping people get started, and info about the people already working on it.

## Subsection 1

Maybe add some more detail here.

## Team

- Person 1 (<email@university.edu>)
- Person 2 (<email@university.edu>)
`.trim()

export default {
    pluginType: 'file editor',
    name: 'markdown-editor',
    humanName: 'Markdown editor',
    editor: withStyles(styles)(MarkdownEditorPlugin),
    showSaveButton: true,
}
