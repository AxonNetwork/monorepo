import isEqual from 'lodash/isEqual'
import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import autobind from 'conscience-lib/utils/autobind'
import { URI, FileMode } from 'conscience-lib/common'
import LargeProgressSpinner from 'conscience-components/LargeProgressSpinner'
import SmartTextarea from 'conscience-components/SmartTextarea'
import * as filetypes from 'conscience-lib/utils/fileTypes'
import { getFileContents, saveFileContents } from 'conscience-components/env-specific'
import { selectFile } from 'conscience-components/navigation'


@autobind
class TextEditorPlugin extends React.Component<Props, State>
{
    state = {
        fileContents: null,
    }

    render() {
        const { fileContents } = this.state
        if (fileContents === null) {
            return <LargeProgressSpinner />
        }

        const { classes } = this.props
        return (
            <SmartTextarea
                uri={this.props.uri}
                value={fileContents}
                rows={1}
                rowsMax={false}
                variant="outlined"
                onChange={this.onChange}
                InputProps={{
                    margin: 'none',
                    classes: {
                        root: classes.textareaTextFieldRoot,
                        inputMultiline: classes.textareaTextFieldRoot,
                    },
                }}
                classes={{ root: classes.textareaRoot }}
                textFieldClasses={{ root: classes.textareaTextFieldRoot }}
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
    textareaRoot: {
        height: 'calc(100vh - 240px)',

        '& textarea': {
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '0.9rem',
        },
    },
    textareaTextFieldRoot: {
        height: '100%',
    },
})

export default {
    pluginType: 'file editor',
    name: 'text-editor',
    humanName: 'Text editor',
    editor: withStyles(styles)(TextEditorPlugin),
    showSaveButton: true,
}
