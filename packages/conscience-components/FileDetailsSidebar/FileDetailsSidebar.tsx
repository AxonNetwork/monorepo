import path from 'path'
import classnames from 'classnames'
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import bytes from 'bytes'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import IconButton from '@material-ui/core/IconButton'
import Drawer from '@material-ui/core/Drawer'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import SecuredText from 'conscience-components/SecuredText'
import { IRepoFile, URI, URIType, FileMode } from 'conscience-lib/common'
import { selectFile, getCommitURL } from 'conscience-components/navigation'
import { autobind, repoUriToString } from 'conscience-lib/utils'
import { IGlobalState } from 'conscience-components/redux'
import { H6 } from 'conscience-components/Typography/Headers'
import * as fileTypes from 'conscience-lib/utils/fileTypes'
import { showFileDetailsSidebar } from 'conscience-components/redux/ui/uiActions'
import FileIcon from 'conscience-components/FileList/FileIcon'
import FileMetadata from './FileMetadata'
import Scrollbar from 'conscience-components/Scrollbar'

@autobind
class FileDetailsSidebar extends React.Component<Props>
{
    render() {
        let { open, uri, file, classes } = this.props
        if (!file || !uri) {
            return null
        }

        let filetype = file.type === 'folder' ? 'Folder' : fileTypes.getHumanReadableType(file.name)
        let commitHash: JSX.Element
        if (uri.commit === 'working' || uri.commit === 'HEAD') {
            commitHash = <span>Current version</span>
        } else {
            commitHash = (
                <span>
                    Version <Link to={getCommitURL(uri)}>{(uri.commit || '').slice(0, 6)}</Link> <span className={classes.deemphasize}>(this is an older version of this file)</span>
                </span>
            )
        }

        return (
            <Drawer
                variant="permanent"
                anchor="right"
                PaperProps={{ elevation: 4 }}
                classes={{
                    paper: classnames(classes.root, open && classes.open),
                }}
                open={open}
            >
                <Scrollbar>
                    <div className={classes.contentRoot}>
                        <div className={classes.header}>
                            <FileIcon
                                filename={file.name}
                                isFolder={file.type === 'folder'}
                                status={file.status}
                                ListItemIconClasses={{ root: classes.fileListItemIcon }}
                            />

                            <div style={{ flexGrow: 1 }}>
                                <H6 className={classes.headerText}>{path.basename(file.name)}</H6>
                                <div className={classes.commitHash}>{commitHash}</div>
                            </div>

                            <IconButton onClick={this.close} className={classes.closeButton}>
                                <CloseIcon />
                            </IconButton>
                        </div>

                        <div className={classes.bodyFirstLine}>
                            <div className={classes.bodyFirstLineStats}>
                                <Typography>
                                    <div className={classes.filetype}>{filetype}</div>
                                    <div>{bytes(file.size)}</div>
                                </Typography>
                            </div>

                            <div>
                                <Tooltip title="Open">
                                    <IconButton onClick={this.openFile}>
                                        <OpenInBrowserIcon />
                                    </IconButton>
                                </Tooltip>

                                {this.props.uri && this.props.uri.type === URIType.Local &&
                                    <Tooltip title="Open with another app on your computer">
                                        <IconButton onClick={this.openWithSystemEditor}>
                                            <OpenInNewIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
                            </div>
                        </div>

                        <SecuredText uri={uri} classes={{ iconContainer: classes.securedTextIcon }} />

                        <FileMetadata uri={uri} classes={{ root: classes.fileMetadata }} />
                    </div>
                </Scrollbar>
            </Drawer>
        )
    }

    openFile() {
        if (!this.props.uri) {
            return
        }
        selectFile(this.props.uri, FileMode.Edit)
    }

    openWithSystemEditor() {
        if (!this.props.uri) {
            return
        } else if (this.props.uri.type === URIType.Network) {
            return
        }

        try {
            const shell = (window as any).require('electron').shell
            const { repoRoot = '', filename = '' } = this.props.uri
            shell.openItem(path.join(repoRoot, filename))
        } catch (err) {
            console.error("err opening file ~> ", err)
        }
    }

    close() {
        this.props.showFileDetailsSidebar({ open: false })
    }
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
}

interface StateProps {
    uri: URI|undefined
    open: boolean
    file: IRepoFile|undefined
}

interface DispatchProps {
    showFileDetailsSidebar: typeof showFileDetailsSidebar
}

const styles = (theme: Theme) => createStyles({
    root: {
        width: 0,
        marginLeft: 20,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        // overflowY: 'hidden',
    },
    contentRoot: {
        padding: 20,
        // overflowX: 'hidden',
        // overflowY: 'auto',
        height: '100vh',
    },
    open: {
        width: 400,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    header: {
        marginBottom: 24,
        borderBottom: '1px solid #e2e2e2',
        paddingBottom: 10,
        display: 'flex',
    },
    headerText: {
        flexGrow: 1,
        // padding: '8px 0',
    },
    bodyFirstLine: {
        display: 'flex',
    },
    bodyFirstLineStats: {
        flexGrow: 1,
    },
    closeButton: {
        height: 'fit-content',
    },

    commitHash: {
        color: '#a9a9a9',
        fontSize: '0.8rem',
    },
    filetype: {},
    deemphasize: {
        color: '#a9a9a9',
    },

    fileMetadata: {
        marginTop: 30,
    },
    securedTextIcon: {
        display: 'none',
    },
    fileListItemIcon: {
        // verticalAlign: 'text-bottom',
        marginTop: 3,
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const uri = state.ui.fileDetailsSidebarURI
    return {
        file: uri ? (state.repo.filesByURI[repoUriToString(uri)] || {})[uri.filename || ''] : undefined,
        uri: uri,
        open: state.ui.fileDetailsSidebarOpen,
    }
}

const mapDispatchToProps = {
    showFileDetailsSidebar,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(FileDetailsSidebar))
