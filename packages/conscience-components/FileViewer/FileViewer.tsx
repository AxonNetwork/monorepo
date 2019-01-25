import isEqual from 'lodash/isEqual'
import React from 'react'
import classnames from 'classnames'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Input from '@material-ui/core/Input'
import SettingsIcon from '@material-ui/icons/Settings'
import { URI } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'
import { FileViewerComponent } from 'conscience-lib/plugins'
import { getFileContents } from '../env-specific'

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

        return (
            <div className={classes.root}>
                <div onMouseOver={() => this.onHoverViewer(true)} onMouseOut={() => this.onHoverViewer(false)}>
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
                            onMouseOver={() => this.onHoverViewer(true)}
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
        )
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
    viewerPicker: {
        width: 'fit-content',
        position: 'absolute',
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
