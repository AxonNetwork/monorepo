import React from 'react'
import classnames from 'classnames'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import Input from '@material-ui/core/Input'
import SettingsIcon from '@material-ui/icons/Settings'
import { URI } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'
import { FileEditorComponent } from 'conscience-lib/plugins/types'


@autobind
class FileEditor extends React.Component<Props, State>
{
    state = {
        hovering: false,
        editorName: undefined,
        editorPickerOpen: false,
    }

    render() {
        const { classes, showEditorPicker } = this.props
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
        let Editor: FileEditorComponent | undefined
        for (let v of editors) {
            if (v.name === editorName) {
                Editor = v.editor
                break
            }
        }
        if (Editor === undefined) {
            Editor = editors[0].editor
        }

        return (
            <div className={classes.root}>
                <div className={classes.toolbar}>

                    {showEditorPicker &&
                        <div className={classnames(classes.editorPicker, { [classes.editorPickerVisible]: true /*this.state.hovering*/ })}>
                            <Select
                                value={editorName}
                                renderValue={() => (
                                    <Button color="secondary"
                                        onMouseEnter={() => this.onHoverEditor(true)}
                                        onMouseLeave={() => this.onHoverEditor(false)}
                                    >
                                        <SettingsIcon className={classes.editorPickerIcon} /> Editor
                                    </Button>
                                )}
                                input={<Input disableUnderline={true} />}
                                onChange={this.onChangeEditor}
                                onMouseEnter={() => this.onHoverEditor(true)}
                                onMouseLeave={() => this.onHoverEditor(false)}
                                className={classes.editorPickerSelect}
                                IconComponent={() => null}
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
                <div onMouseEnter={() => this.onHoverEditor(true)} onMouseLeave={() => this.onHoverEditor(false)}>
                    <Editor
                        uri={this.props.uri}
                        classes={classes}
                    />
                </div>
            </div>
        )
    }

    onClickOpenEditorPicker() {
        this.setState({ editorPickerOpen: !this.state.editorPickerOpen })
    }

    onHoverEditor(hovering: boolean) {
        this.setState({ hovering })
    }

    onChangeEditor(evt: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({
            editorName: evt.target.value,
            editorPickerOpen: false,
        })
    }

}


interface Props {
    uri: URI
    showEditorPicker?: boolean
    showButtons?: boolean
    classes?: any
}

interface State {
    hovering: boolean
    editorName: string | undefined
    editorPickerOpen: boolean,
}

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
    },
    toolbar: {
        display: 'flex',
    },
    breadcrumbs: {
        flexGrow: 1,
    },
    editorPicker: {
        width: 'fit-content',
        position: 'absolute',
        // right: 0,
        opacity: 0,
        transition: theme.transitions.create('opacity', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    editorPickerVisible: {
        opacity: 1,
        transition: theme.transitions.create('opacity', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
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

export default withStyles(styles)(FileEditor)
