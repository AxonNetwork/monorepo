import path from 'path'
import isEqual from 'lodash/isEqual'
import React from 'react'
import classnames from 'classnames'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import Input from '@material-ui/core/Input'
import SettingsIcon from '@material-ui/icons/Settings'
import EditIcon from '@material-ui/icons/Edit'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import { URI, URIType, FileMode } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'
import { FileViewerComponent, WidthMode } from 'conscience-lib/plugins/types'
import { getFileContents } from '../env-specific'
import { selectFile } from '../navigation'

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
        const { classes, showViewerPicker } = this.props
        if (!this.props.uri.filename) {
            return null
        }

        if (this.state.error !== undefined && this.props.fallback !== undefined) {
            return this.props.fallback
        }

        const viewers = filetypes.getViewers(this.props.uri.filename)
        if (viewers.length === 0) {
            return (
                <div>We don't have a viewer for this kind of file yet.</div>
            )
        }

        const viewerName = this.state.viewerName || viewers[0].name
        let Viewer: FileViewerComponent = viewers[0].viewer
        let widthMode: WidthMode = 'unset'
        for (let v of viewers) {
            if (v.name === viewerName) {
                Viewer = v.viewer
                widthMode = v.widthMode
                break
            }
        }

        // Override plugin default widthMode if explicitly specified in props
        if (this.props.widthMode) {
            widthMode = this.props.widthMode
        }

        let widthClass = ''
        if (widthMode === 'full') {
            widthClass = classes.rootFullWidth
        } else if (widthMode === 'breakpoints') {
            widthClass = classes.rootRegularWidth
        } else if (widthMode === 'unset') {
            widthClass = ''
        }

        const canQuickEdit = this.props.canEdit &&
            this.props.uri.type === URIType.Local &&
            filetypes.getEditors(this.props.uri.filename).length > 0
        const canOpen = this.props.canOpen && this.props.uri.type === URIType.Local
        const showButtons = showViewerPicker || canQuickEdit || canOpen

        return (
            <div className={classnames(classes.root, widthClass)}>
                <div onMouseEnter={() => this.onHoverViewer(true)} onMouseLeave={() => this.onHoverViewer(false)} className={classes.wrapper}>
                    <Viewer
                        uri={this.props.uri}
                        fileContents={fileContents}
                        classes={classes}
                    />
                </div>
                {showButtons &&
                    <div className={classnames(classes.buttons, { [classes.buttonsVisible]: this.state.hovering })}>
                        {canQuickEdit &&
                            <Button color="secondary"
                                onClick={this.onClickQuickEdit}
                                onMouseEnter={() => this.onHoverViewer(true)}
                                onMouseLeave={() => this.onHoverViewer(false)}
                            >
                                <EditIcon /> Quick Edit
                            </Button>
                        }
                        {canOpen &&
                            <Button color="secondary"
                                onMouseEnter={() => this.onHoverViewer(true)}
                                onMouseLeave={() => this.onHoverViewer(false)}
                                onClick={this.onClickOpenFile}
                            >
                                <OpenInNewIcon /> Open
                            </Button>
                        }
                        {showViewerPicker &&
                            <Select
                                value={viewerName}
                                renderValue={() => (
                                    <Button color="secondary"
                                        onMouseEnter={() => this.onHoverViewer(true)}
                                        onMouseLeave={() => this.onHoverViewer(false)}
                                    >
                                        <SettingsIcon className={classes.viewerPickerIcon} /> Viewer
                                    </Button>
                                )}
                                input={<Input disableUnderline={true} />}
                                onChange={this.onChangeViewer}
                                onMouseEnter={() => this.onHoverViewer(true)}
                                onMouseLeave={() => this.onHoverViewer(false)}
                                className={classes.viewerPickerSelect}
                                IconComponent={() => null}
                                classes={{ select: classes.viewerPickerMenu }}
                            >
                                {viewers.map(viewer => (
                                    <MenuItem value={viewer.name}>
                                        {viewer.humanName}
                                    </MenuItem>
                                ))}
                            </Select>
                        }
                    </div>
                }
            </div>
        )
    }

    onClickQuickEdit = () => {
        selectFile(this.props.uri, FileMode.Edit)
    }

    onClickOpenFile = () => {
        const uri = this.props.uri
        console.log('uri', uri)
        if (uri.type !== URIType.Local) {
            return
        }
        try {
            const shell = (window as any).require('electron').shell
            const { repoRoot = '', filename = '' } = uri
            shell.openItem(path.join(repoRoot, filename))
        } catch (err) {
            console.error("err opening file ~> ", err)
        }
    }

    onClickOpenViewerPicker = () => {
        this.setState({ viewerPickerOpen: !this.state.viewerPickerOpen })
    }

    onHoverViewer = (hovering: boolean) => {
        this.setState({ hovering })
    }

    onChangeViewer = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({
            viewerName: evt.target.value,
            viewerPickerOpen: false,
        })
    }

    componentDidMount = () => {
        this.updateFileContents()
    }

    componentDidUpdate = (prevProps: Props) => {
        if (!isEqual(prevProps.uri, this.props.uri)) {
            this.updateFileContents()
        }
    }

    updateFileContents = async () => {
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
            const fileContents = (await getFileContents(this.props.uri)).toString()
            this.setState({ fileContents })
        } catch (error) {
            this.setState({ fileContents: '', error })
        }
    }
}


interface Props {
    uri: URI
    fallback?: any
    widthMode?: WidthMode
    showViewerPicker?: boolean
    canEdit?: boolean
    canOpen?: boolean
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
    rootRegularWidth: {
        [theme.breakpoints.up(960)]: {
            width: 960,
            maxWidth: '100%',
        },
        [theme.breakpoints.down(960)]: {
            width: '100%',
        },
    },
    rootFullWidth: {
        width: '100%',
    },
    buttons: {
        width: 'fit-content',
        position: 'absolute',
        right: 0,
        padding: 4,
        opacity: 0,
        transition: theme.transitions.create('opacity', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    buttonsVisible: {
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
