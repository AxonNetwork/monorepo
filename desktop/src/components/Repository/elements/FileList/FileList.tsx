import path from 'path'
import React from 'react'
import { connect } from 'react-redux'
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
import { filterSubfolder, mergeFolders, sortFolders } from './fileListUtils'
import File from './File'
import Breadcrumbs from './Breadcrumbs'
import { selectFile } from 'redux/repository/repoActions'
import { IRepoFile } from 'common'
import autobind from 'utils/autobind'

const shell = (window as any).require('electron').shell


@autobind
class FileList extends React.Component<Props, State>
{
    state = { newFileDialogOpen: false }

    _inputNewFileName: HTMLInputElement | null = null

    render() {
        let { classes, files, selectedFolder } = this.props
        if (selectedFolder !== undefined) {
            files = filterSubfolder(files, selectedFolder)
        }
        files = mergeFolders(files, selectedFolder)
        const names = sortFolders(files)
        return (
            <React.Fragment>
                <div className={classes.toolbar}>
                    <Breadcrumbs repoRoot={this.props.repoRoot} selectedFolder={selectedFolder} classes={{ root: classes.breadcrumb }} />

                    <Button mini color="secondary" aria-label="New file" onClick={this.onClickNewFile}>
                        <ControlPointIcon /> New file
                    </Button>
                </div>

                {names.length === 0 &&
                    <div className={classes.emptyRepoText}>
                        <Typography>There's nothing here yet.</Typography>
                        <Typography>
                            <span>Start by adding files to your </span>
                            <a href="#"
                                onClick={() => shell.openItem(this.props.repoRoot)}
                                className={classes.link}
                            >
                                Repository Folder
                            </a>
                        </Typography>
                    </div>
                }
                {names.length > 0 &&
                    <Card className={classes.fileListCard}>
                        <CardContent className={classes.fileListCardContent}>
                            <Table>
                                <TableBody>
                                    {names.map((name) => {
                                        const file = files[name]
                                        return (
                                            <File
                                                file={file}
                                                repoRoot={this.props.repoRoot}
                                                key={name}
                                                selectFile={this.props.selectFile}
                                                classes={{ tableRow: classes.tableRow, tableCell: classes.tableCell }}
                                            />
                                        )
                                    })}
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

        const basepath = this.props.selectedFolder || '.'
        const fullpath = path.join(basepath, filename)

        this.props.selectFile({ selectedFile: { file: fullpath, isFolder: false, editing: true } })
    }

    onClickCancelNewFile() {
        if (this._inputNewFileName) {
            this._inputNewFileName.value = ''
        }
        this.setState({ newFileDialogOpen: false })
    }
}

interface Props {
    repoRoot: string
    files: {[name: string]: IRepoFile}
    selectedFolder: string | undefined

    selectFile: typeof selectFile

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
    tableRow: {
        height: 36,
    },
    tableCell: {
        borderBottom: 'none',
    },
    emptyRepoText: {
        marginTop: theme.spacing.unit * 2,
        '& p': {
            marginTop: theme.spacing.unit * 2,
        },
    },
    link: {
        color: theme.palette.secondary.main,
    },
})

const mapDispatchToProps = {
    selectFile,
}

export default connect(
    null,
    mapDispatchToProps,
)(withStyles(styles)(FileList))



