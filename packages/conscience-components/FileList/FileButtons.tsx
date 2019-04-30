import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import EditIcon from '@material-ui/icons/Edit'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import DashboardIcon from '@material-ui/icons/Dashboard'
import InfoIcon from '@material-ui/icons/Info'
import Tooltip from '@material-ui/core/Tooltip'
import path from 'path'

import { setFilesChunking } from '../redux/repo/repoActions'
import { IGlobalState } from '../redux'
import { IRepoFile, FileMode, URI, LocalURI, URIType } from 'conscience-lib/common'
import autobind from 'conscience-lib/utils/autobind'
import * as filetypes from 'conscience-lib/utils/fileTypes'
import { selectFile } from 'conscience-components/navigation'
import { setFileDetailsSidebarURI, showFileDetailsSidebar } from 'conscience-components/redux/ui/uiActions'


@autobind
class FileButtons extends React.Component<Props, State>
{

    state = {
        chunkingDialogOpen: false
    }

    render() {
        const { file, manualChunking, classes } = this.props
        const isChunked = file.isChunked

        return (
            <div>
                {this.canQuickEdit() &&
                    <Tooltip title="Quick edit">
                        <IconButton onClick={this.openEditor} className={classes.iconButton}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                }
                <Tooltip title="Open this file with another app">
                    <IconButton onClick={this.openItemWithSystemEditor} className={classes.iconButton}>
                        <OpenInNewIcon />
                    </IconButton>
                </Tooltip>
                {manualChunking &&
                    <Tooltip title="Chunk File">
                        <IconButton
                            onClick={this.openChunkingDialog}
                            color={isChunked ? "secondary" : undefined}
                            className={classes.iconButton}
                        >
                            <DashboardIcon />
                        </IconButton>
                    </Tooltip>
                }
                <Tooltip title="More details">
                    <IconButton onClick={this.onClickDetails} className={classes.iconButton}>
                        <InfoIcon />
                    </IconButton>
                </Tooltip>

                <Dialog open={this.state.chunkingDialogOpen} onClose={this.closeChunkingDialog}>
                    <DialogTitle>
                        Chunking {this.props.file.name}: {isChunked ? <span>On</span> : <span>Off</span>}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Large file storage breaks a file into smaller chunks which allows for more efficient storage and easier sharing with your peers. We recommend it for files over 10MB.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={this.toggleChunking}
                            color="secondary"
                            variant="contained"
                            autoFocus
                        >
                            Turn {!isChunked ? <span> On</span> : <span> Off</span>}
                        </Button>
                        <Button
                            onClick={this.closeChunkingDialog}
                            variant="outlined"
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    onClickDetails = (evt: React.MouseEvent) => {
        evt.stopPropagation()
        this.props.setFileDetailsSidebarURI({ uri: this.props.uri })
        this.props.showFileDetailsSidebar({ open: true })
    }

    openItemWithSystemEditor(e: React.MouseEvent<HTMLElement>) {
        if (this.props.uri.type === URIType.Network) {
            throw new Error('network URIs cannot be opened locally')
        }

        e.stopPropagation()
        const shell = (window as any).require('electron').shell
        shell.openItem(path.join(this.props.uri.repoRoot, this.props.file.name))
    }

    openEditor(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation()
        selectFile(this.props.uri, FileMode.Edit)
    }

    canQuickEdit() {
        if (!this.props.canEditFiles || this.props.file.type === 'folder') {
            return false
        }
        return filetypes.isTextFile(this.props.file.name)

        // const editors = filetypes.getEditors(this.props.file.name)
        // return editors.length > 0
    }

    toggleChunking() {
        const uri = this.props.uri as LocalURI
        const shouldChunkByFile = {
            [this.props.file.name]: !this.props.file.isChunked
        }

        this.props.setFilesChunking({ uri, shouldChunkByFile })
        this.closeChunkingDialog()
    }

    openChunkingDialog(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation()
        this.setState({ chunkingDialogOpen: true })
    }

    closeChunkingDialog() {
        this.setState({ chunkingDialogOpen: false })
    }

}

interface State {
    chunkingDialogOpen: boolean
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    uri: URI
    file: IRepoFile
    canEditFiles?: boolean
}

interface StateProps {
    manualChunking: boolean
}

interface DispatchProps {
    setFilesChunking: typeof setFilesChunking
    setFileDetailsSidebarURI: typeof setFileDetailsSidebarURI
    showFileDetailsSidebar: typeof showFileDetailsSidebar
}

const styles = (theme: Theme) => createStyles({
    iconButton: {
        padding: 0,
        width: 36,
        height: 36,
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    return {
        manualChunking: state.user.userSettings.manualChunking || false,
    }
}

const mapDispatchToProps = {
    setFilesChunking,
    setFileDetailsSidebarURI,
    showFileDetailsSidebar,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(FileButtons))
