import path from 'path'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { withRouter } from 'react-router-dom'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from '@material-ui/core/TextField'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import BackupIcon from '@material-ui/icons/Backup'
import FolderIcon from '@material-ui/icons/Folder'
import { filterSubfolder, mergeFolders, sortFolders } from './fileListUtils'
import File from './File'
import Breadcrumbs from '../Breadcrumbs'
import { IRepoFile, FileMode, URI } from 'conscience-lib/common'
import autobind from 'conscience-lib/utils/autobind'
import { selectFile } from 'conscience-components/navigation'


@autobind
class FileList extends React.Component<Props, State>
{
    state = { newFileDialogOpen: false }

    _inputNewFileName: HTMLInputElement | null = null

    render() {
        let { classes, files } = this.props
        if (this.props.uri.filename !== undefined) {
            files = filterSubfolder(files, this.props.uri.filename)
        }
        files = mergeFolders(files, this.props.uri.filename)
        const names = sortFolders(files)
        return (
            <React.Fragment>
                <div className={classes.toolbar}>
                    <Breadcrumbs uri={this.props.uri} classes={{ root: classes.breadcrumb }} />

                    {this.props.canEditFiles &&
                        <Button mini color="secondary" aria-label="New file" onClick={this.onClickNewFile}>
                            <ControlPointIcon /> New file
                        </Button>
                    }
                </div>

                {names.length === 0 &&
                    <Typography className={classes.emptyRepoMessage}>
                        This is the file list view.  Right now, it's empty because nobody has committed any files to the repository.<br /><br />
                        Add some files and then commit them using the <BackupIcon /> button above.<br />
                        Open this folder on your computer by using the <FolderIcon /> button.
                    </Typography>
                }
                {names.length > 0 &&
                    <Card className={classes.fileListCard}>
                        <CardContent className={classes.fileListCardContent}>
                            <Table>
                                <TableBody>
                                    {names.map(filename => (
                                        <File
                                            uri={{ ...this.props.uri, filename }}
                                            file={files[filename]}
                                            key={filename}
                                            fileExtensionsHidden={this.props.fileExtensionsHidden}
                                            openFileIcon={this.props.openFileIcon}
                                            canEditFiles={this.props.canEditFiles}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                }

                <Dialog
                    fullWidth
                    open={this.state.newFileDialogOpen}
                >
                    <DialogTitle>Create new file</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            autoFocus
                            inputRef={x => this._inputNewFileName = x}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={this.onClickCreateNewFile}>Create</Button>
                        <Button color="secondary" onClick={this.onClickCancelNewFile}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }

    onClickNewFile() {
        this.setState({ newFileDialogOpen: true })
    }

    onClickCreateNewFile() {
        if (!this._inputNewFileName) {
            return
        }
        const filename = this._inputNewFileName.value.trim()
        if (filename.length === 0) {
            return
        }

        const basepath = this.props.uri.filename || '.'
        const fullpath = path.join(basepath, filename)

        selectFile(this.props.history, { ...this.props.uri, filename: fullpath }, FileMode.Edit)
    }

    onClickCancelNewFile() {
        if (this._inputNewFileName) {
            this._inputNewFileName.value = ''
        }
        this.setState({ newFileDialogOpen: false })
    }
}

type Props = OwnProps & RouteComponentProps<{}>

interface OwnProps {
    uri: URI
    // repoRoot: string
    files: { [name: string]: IRepoFile }
    // selectedFolder: string | undefined
    fileExtensionsHidden: boolean | undefined
    openFileIcon?: boolean
    canEditFiles?: boolean

    classes: any
}

interface State {
    newFileDialogOpen: boolean
}

const styles = (theme: Theme) => createStyles({
    fileListCard: {
        margin: '15px 5px 5px 5px',
        padding: 0,
    },
    fileListCardContent: {
        cursor: 'pointer',

        '&:last-child': {
            padding: 0,
            margin: '10px 0',
        },
    },
    button: {
        textTransform: 'none',
        fontSize: '12pt',
        padding: '5px 16px',
        minHeight: 0,
        height: 32,
    },
    toolbar: {
        display: 'flex',
    },
    breadcrumb: {
        flexGrow: 1,
    },
    emptyRepoMessage: {
        fontSize: '1.1rem',
        color: '#9c9c9c',
        maxWidth: 640,
        margin: '0 auto',
        background: '#f1f1f1',
        padding: 20,
        borderRadius: 10,
        border: '3px solid #9c9c9c',
        marginTop: 30,
        textAlign: 'center',
        lineHeight: '2rem',

        '& svg': {
            verticalAlign: 'text-bottom',
            margin: '0 5px',
        },
    },
    link: {
        color: theme.palette.secondary.main,
    },
})

export default withStyles(styles)(withRouter(FileList))
