import path from 'path'
import omit from 'lodash/omit'
import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import Input from '@material-ui/core/Input'
import CancelIcon from '@material-ui/icons/Cancel'
import SaveIcon from '@material-ui/icons/Save'
import SettingsIcon from '@material-ui/icons/Settings'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import { URI, URIType } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'
import { IFileEditorPlugin, FileEditorComponent } from 'conscience-lib/plugins/types'


@autobind
class FileEditor extends React.Component<Props, State>
{
    state = {
        editorName: undefined,
        editorPickerOpen: false,
        fileModified: false,
    }

    // We have to handle both of these because sometimes components are wrapped in HOCs (like
    // withStyles, withRouter) that offer `innerRef` as a way of getting to the inner component, and
    // sometimes they don't.
    _editor:      FileEditorComponent|null = null
    _editorInner: FileEditorComponent|null = null

    render() {
        const { classes, showToolbar } = this.props
        if (!this.props.uri.filename) {
            return null
        }

        const editors = filetypes.getEditors(this.props.uri.filename)
        if (editors.length === 0) {
            return (
                <div>
                    <div>We don't have a editor for this kind of file yet.</div>
                </div>
            )
        }

        const editorName = this.state.editorName || editors[0].name
        let plugin: IFileEditorPlugin|undefined
        for (let p of editors) {
            if (p.name === editorName) {
                plugin = p
                break
            }
        }
        if (!plugin) {
            plugin = editors[0]
        }
        const Editor = plugin.editor

        const pluginClasses = omit(classes, 'root', 'toolbar', 'editorPicker', 'editorPickerVisible', 'editorPickerIcon', 'editorPickerSelect', 'editorPickerMenu')
        const showOpenWithSystemEditorButton = this.props.uri.type === URIType.Local

        return (
            <div className={classes.root}>
                {showToolbar &&
                    <div className={classes.toolbar}>
                        {plugin.showSaveButton &&
                            <Tooltip title="Save">
                                <Button color="secondary" onClick={this.onClickSave} disabled={!this.state.fileModified}>
                                    <SaveIcon />
                                </Button>
                            </Tooltip>
                        }

                        <Tooltip title="Close">
                            <Button color="secondary" onClick={this.onClickClose}>
                                <CancelIcon />
                            </Button>
                        </Tooltip>

                        {showOpenWithSystemEditorButton &&
                            <Tooltip title="Open with another app on your computer">
                                <Button color="secondary" onClick={this.onClickOpenWithSystemEditor}>
                                    <OpenInNewIcon />
                                </Button>
                            </Tooltip>
                        }

                        {editors.length > 1 &&
                            <div className={classes.editorPicker}>
                                <Select
                                    value={editorName}
                                    renderValue={() => (
                                        <Button color="secondary">
                                            <SettingsIcon className={classes.editorPickerIcon} />
                                        </Button>
                                    )}
                                    input={<Input disableUnderline={true} />}
                                    onChange={this.onChangeEditor}
                                    IconComponent={() => null}
                                    className={classes.editorPickerSelect}
                                    classes={{ select: classes.editorPickerMenu }}
                                >
                                    {editors.map(editor => (
                                        <MenuItem value={editor.name}>
                                            {editor.humanName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                        }
                    </div>
                }

                <Editor
                    uri={this.props.uri}
                    isNewFile={this.props.isNewFile}
                    setFileModified={this.setFileModified}
                    classes={pluginClasses}
                    ref={(x: FileEditorComponent) => this._editor = x}
                    innerRef={x => this._editorInner = x}
                />
            </div>
        )
    }

    onClickOpenEditorPicker = () => {
        this.setState({ editorPickerOpen: !this.state.editorPickerOpen })
    }

    onChangeEditor = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        // TODO: check this.state.fileModified
        this.setState({
            editorName: evt.target.value,
            editorPickerOpen: false,
        })
    }

    setFileModified = (fileModified: boolean) => {
        if (this.state.fileModified !== fileModified) {
            this.setState({ fileModified })
        }
    }

    onClickSave = () => {
        if (this._editor && this._editor.onClickSave) {
            this._editor.onClickSave()
            this.setFileModified(false)

        } else if (this._editorInner && this._editorInner.onClickSave) {
            this._editorInner.onClickSave()
            this.setFileModified(false)
        }
    }

    onClickClose = () => {
        // TODO: check this.state.fileModified
        this.props.history.go(-1)
    }

    onClickOpenWithSystemEditor = () => {
        try {
            const shell = (window as any).require('electron').shell
            const { repoRoot = '', filename = '' } = this.props.uri
            shell.openItem(path.join(repoRoot, filename))
        } catch (err) {
            console.error("err opening file ~> ", err)
        }
    }
}


interface Props extends RouteComponentProps {
    uri: URI
    isNewFile: boolean
    showToolbar?: boolean
    showSaveButton?: boolean
    classes?: any
}

interface State {
    editorName: string | undefined
    editorPickerOpen: boolean,
    fileModified: boolean
}

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'flex-end',
        height: 50,
    },
    breadcrumbs: {
        flexGrow: 1,
    },
    editorPicker: {
        width: 'fit-content',
        position: 'absolute',
    },
    editorPickerIcon: {
        fill: theme.palette.secondary.main,
    },
    editorPickerSelect: {
        width: 'fit-content',
    },
    editorPickerMenu: {
        paddingRight: 4,
        '&:focus': {
            backgroundColor: 'transparent',
        }
    },
    imageEmbed: {
        maxWidth: '100%',
    },
    codeContainer: {
        padding: 30,
    },
    embedRoot: {
        padding: 0,
        paddingBottom: '0 !important',
        minWidth: 680,

        '& embed': {
            width: '100%',
            height: 800,
        },
    },
})

export default withStyles(styles)(withRouter(FileEditor))
