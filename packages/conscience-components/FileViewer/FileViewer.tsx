import isEqual from 'lodash/isEqual'
import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { URI } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'
import { FileViewerComponent } from 'conscience-lib/plugins'
import { getFileContents } from '../env-specific'

@autobind
class FileViewer extends React.Component<Props, State>
{
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
                {this.props.showViewerPicker &&
                    <Select
                        value={viewerName}
                        onChange={this.onChangeViewer}
                        className={classes.viewerPicker}
                    >
                        {viewers.map(viewer => (
                            <MenuItem value={viewer.name}>
                                {viewer.humanName}
                            </MenuItem>
                        ))}
                    </Select>
                }

                <Viewer
                    uri={this.props.uri}
                    fileContents={fileContents}
                    classes={classes}
                />
            </div>
        )
    }

    onChangeViewer(evt: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({ viewerName: evt.target.value })
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
    viewerName: string | undefined
    fileContents: string
    error: Error | undefined
}

const styles = () => createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    viewerPicker: {
        width: 'fit-content',
        // marginBottom: 10,
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
