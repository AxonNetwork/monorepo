import isEqual from 'lodash/isEqual'
import React from 'react'
import classnames from 'classnames'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import SettingsIcon from '@material-ui/icons/Settings'
import EditIcon from '@material-ui/icons/Edit'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import { selectFile } from 'conscience-components/navigation'
import { URI, URIType, FileMode } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'
import { FileViewerComponent } from 'conscience-lib/plugins'
import { getFileContents } from '../env-specific'
import path from 'path'


@autobind
class FileViewer extends React.Component<Props, State>
{
    state = {
        hovering: false,
        viewerName: undefined,
        viewerPickerOpen: false,
        fileContents: '',
        error: undefined,
    }

    render() {
        const { fileContents } = this.state
        const { classes } = this.props
        if (!this.props.uri.filename) {
            return null
        }

        const viewers = filetypes.getViewers(this.props.uri.filename)
        if (viewers.length === 0) {
            return (
                <div>We don't have a viewer for this kind of file yet.</div>
            )
        }

        const viewerName = this.state.viewerName || viewers[0].name
        let Viewer: FileViewerComponent | undefined
        for (let v of viewers) {
            if (v.name === viewerName) {
                Viewer = v.viewer
                break
            }
        }
        if (Viewer === undefined) {
            Viewer = viewers[0].viewer
        }

        const canQuickEdit = this.props.showButtons && true
        const isLocal = this.props.showButtons && this.props.uri.type === URIType.Local

        return (
            <div className={classes.root}>
                <div className={classes.toolbar}>
                    {canQuickEdit &&
                        <Button color="secondary" onClick={this.onClickQuickEdit}>
                            <EditIcon /> Quick Edit
                        </Button>
                    }
                    {isLocal &&
                        <Button color="secondary" onClick={this.onClickOpenFile}>
                            <OpenInNewIcon /> Open
                        </Button>
                    }
                </div>
                <div className={classes.viewerContainer}>
                    <div onMouseEnter={() => this.onHoverViewer(true)} onMouseLeave={() => this.onHoverViewer(false)}>
                        <Viewer
                            uri={this.props.uri}
                            fileContents={fileContents}
                            classes={classes}
                        />
                    </div>
                    {this.props.showViewerPicker &&
                        <div className={classnames(classes.viewerPicker, { [classes.viewerPickerVisible]: this.state.hovering })}>
                            <Select
                                value={viewerName}
                                renderValue={() => <SettingsIcon className={classes.viewerPickerIcon} />}
                                input={<Input disableUnderline={true} />}
                                onChange={this.onChangeViewer}
                                onMouseEnter={() => this.onHoverViewer(true)}
                                onMouseLeave={() => this.onHoverViewer(false)}
                                className={classes.viewerPickerSelect}
                                IconComponent={() => null}
                                classes={{
                                    select: classes.viewerPickerMenu,
                                }}
                            >
                                {viewers.map(viewer => (
                                    <MenuItem value={viewer.name}>
                                        {viewer.humanName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                    }
                </div>
            </div>
        )
    }

    onClickQuickEdit() {
        selectFile(this.props.uri, FileMode.Edit)
    }

    onClickOpenFile() {
        const uri = this.props.uri
        if (uri.type !== URIType.Local) {
            return
        }
        try {
            const shell = (window as any).require('electron').shell
            const { repoRoot = "", filename = "" } = uri
            shell.openItem(path.join(repoRoot, filename))
        } catch (err) {
            console.error("err opening file ~> ", err)
        }
    }

    onClickOpenViewerPicker() {
        this.setState({ viewerPickerOpen: !this.state.viewerPickerOpen })
    }

    onHoverViewer(hovering: boolean) {
        this.setState({ hovering })
    }

    onChangeViewer(evt: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({
            viewerName: evt.target.value,
            viewerPickerOpen: false,
        })
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
            this.setState({ fileContents: '' })
            return
        }

        // Don't handle binary files, only text
        if (!filetypes.isTextFile(this.props.uri.filename)) {
            this.setState({ fileContents: '' })
            return
        }

        try {
            const fileContents = await getFileContents(this.props.uri)
            this.setState({ fileContents })
        } catch (error) {
            this.setState({ fileContents: '', error })
        }
    }
}


interface Props {
    uri: URI
    showViewerPicker: boolean
    showButtons?: boolean
    classes?: any
}

interface State {
    hovering: boolean
    viewerName: string | undefined
    viewerPickerOpen: boolean,
    fileContents: string
    error: Error | undefined
}

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
    },
    toolbar: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    viewerContainer: {
        position: 'relative'
    },
    viewerPicker: {
        width: 'fit-content',
        position: 'absolute',
        top: 0,
        right: 0,
        opacity: 0,
        transition: theme.transitions.create('opacity', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    viewerPickerVisible: {
        opacity: 1,
        transition: theme.transitions.create('opacity', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    viewerPickerIcon: {
        fill: theme.palette.secondary.main,
    },
    viewerPickerSelect: {
        width: 'fit-content',
    },
    viewerPickerMenu: {
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

export default withStyles(styles)(FileViewer)
