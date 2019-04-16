import isEqual from 'lodash/isEqual'
import path from 'path'
import React from 'react'
import { connect } from 'react-redux'
import values from 'lodash/values'
import debounce from 'lodash/debounce'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import FormControl from '@material-ui/core/FormControl'
import SearchIcon from '@material-ui/icons/Search'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import Tooltip from '@material-ui/core/Tooltip'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder'
import BackupIcon from '@material-ui/icons/Backup'
import FolderIcon from '@material-ui/icons/Folder'
import { makeTree, sortFiles } from './fileListUtils'
import File from './File'
import Breadcrumbs from '../Breadcrumbs'
import { IRepoFile, FileMode, URI } from 'conscience-lib/common'
import { autobind, repoUriToString } from 'conscience-lib/utils'
import LargeProgressSpinner from 'conscience-components/LargeProgressSpinner'
import { selectFile } from 'conscience-components/navigation'
import { createFolder } from 'conscience-components/env-specific'
import { IGlobalState } from 'conscience-components/redux'
import NewFileDialog from './NewFileDialog'



@autobind
class FileList extends React.Component<Props, State>
{
    state = {
        newFileDialogOpen: false,
        newFolderDialogOpen: false,
        tree: null,
        quickNavOpen: false,
        quickNavQuery: '',
        quickNavFileList: [],
    }

    _inputQuickNav: HTMLInputElement | null = null
    _inputNewFolderName: HTMLInputElement | null = null

    componentDidMount() {
        if (this.props.files) {
            this.setState({ tree: makeTree(this.props.files) })
        }

        document.addEventListener('keydown', this.onKeyDown, false)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyDown, false)
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if (this.props.files && this.props.files !== prevProps.files) {
            this.setState({ tree: makeTree(this.props.files) })
        }

        if (!isEqual(this.props.uri, prevProps.uri)) {
            this.setState({ quickNavOpen: false, quickNavQuery: '' })
        }

        if (this.state.quickNavQuery !== prevState.quickNavQuery) {
            if (this.state.quickNavQuery !== '') {
                this.recalculateQuickNavFileList(this.state.quickNavQuery)
            } else {
                this.setState({ quickNavFileList: [] })
            }
        }
    }

    onKeyDown(evt: KeyboardEvent) {
        if (!evt.metaKey && !evt.ctrlKey && !evt.altKey && !evt.shiftKey) {
            if (!this.state.quickNavOpen && evt.key === '/') {
                evt.stopPropagation()
                this.setState({ quickNavOpen: true, quickNavQuery: '', quickNavFileList: [] }, () => {
                    this._inputQuickNav!.focus()
                })
            } else if (this.state.quickNavOpen && evt.key === 'Escape') {
                evt.stopPropagation()
                this.setState({ quickNavOpen: false, quickNavQuery: '', quickNavFileList: [] })
            }
        }
    }

    render() {
        let { classes } = this.props

        if (!this.state.tree) {
            return <LargeProgressSpinner />
        }

        let currentTree = this.state.tree as any
        if (this.props.uri.filename) {
            const parts = this.props.uri.filename.split('/')
            for (let part of parts) {
                currentTree = currentTree.files[part]
            }
        }

        let files: IRepoFile[]
        let showFullPaths: boolean
        if (this.state.quickNavQuery !== '') {
            files = this.state.quickNavFileList
            showFullPaths = true
        } else {
            files = values(currentTree.files)
            showFullPaths = false
        }

        const entries = sortFiles(files)
            .filter(file => file.name !== ".gitattributes")

        return (
            <React.Fragment>
                <div className={classes.toolbar}>
                    <Breadcrumbs uri={this.props.uri} classes={{ root: classes.breadcrumb }} />

                    {this.props.canEditFiles &&
                        <Tooltip title="New file">
                            <Button mini color="secondary" aria-label="New file" onClick={this.onClickNewFile}>
                                <ControlPointIcon />
                            </Button>
                        </Tooltip>
                    }
                    {this.props.canEditFiles &&
                        <Tooltip title="New folder">
                            <Button mini color="secondary" aria-label="New file" onClick={this.onClickNewFolder}>
                                <CreateNewFolderIcon />
                            </Button>
                        </Tooltip>
                    }
                </div>

                {Object.keys(this.props.files).length === 0 &&
                    <Typography className={classes.emptyRepoMessage}>
                        This is the file list view.  Right now, it's empty because nobody has committed any files to the repository.<br /><br />
                        Add some files and then commit them using the <BackupIcon /> button above.<br />
                        Open this folder on your computer by using the <FolderIcon /> button.
                    </Typography>
                }
                {Object.keys(this.props.files).length > 0 &&
                    <Card className={classes.fileListCard}>
                        <CardContent className={classes.fileListCardContent}>
                            {this.state.quickNavOpen &&
                                <FormControl fullWidth className={classes.quickNavSearchBar}>
                                    <Input
                                        inputRef={x => this._inputQuickNav = x}
                                        onChange={this.onQuickNavSearchChange}
                                        value={this.state.quickNavQuery}
                                        startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
                                    />
                                </FormControl>
                            }

                            <Table>
                                <TableBody>
                                    {entries.map(file => (
                                        <File
                                            uri={{ ...this.props.uri, filename: file.name }}
                                            file={file}
                                            key={file.name}
                                            fileExtensionsHidden={this.props.fileExtensionsHidden}
                                            canEditFiles={this.props.canEditFiles}
                                            showFullPaths={showFullPaths}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                }

                <NewFileDialog
                    open={this.state.newFileDialogOpen}
                    onClickCancel={this.closeNewFileDialog}
                    onClickCreate={this.createNewFile}
                />

                <Dialog
                    maxWidth={false}
                    open={this.state.newFolderDialogOpen}
                    onClose={this.closeNewFolderDialog}
                >
                    <DialogTitle>Create new folder</DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.createNewFolder}>
                            <TextField
                                label="Folder name"
                                fullWidth
                                autoFocus
                                inputRef={x => this._inputNewFolderName = x}
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" variant="contained" onClick={this.createNewFolder}>Create</Button>
                        <Button color="secondary" variant="outlined" onClick={this.closeNewFolderDialog}>Cancel</Button>
                    </DialogActions>
                </Dialog>

            </React.Fragment>
        )
    }

    onQuickNavSearchChange(evt: React.ChangeEvent<HTMLInputElement>) {
        if (evt.target.value === '/') {
            return
        }
        this.setState({ quickNavQuery: evt.target.value })
    }

    recalculateQuickNavFileList = debounce((quickNavQuery: string) => {
        const quickNavFileList = sortFiles(
            values(this.props.files).filter(e => e.name.toLowerCase().includes(quickNavQuery.toLowerCase()))
        )
        this.setState({ quickNavFileList })
    }, 300)

    onClickNewFile     = () => this.setState({ newFileDialogOpen: true })
    closeNewFileDialog = () => this.setState({ newFileDialogOpen: false })
    createNewFile(filename: string) {
        this.closeNewFileDialog()

        if (filename.trim().length === 0) {
            return
        }

        const basepath = this.props.uri.filename || '.'
        const fullpath = path.join(basepath, filename)

        selectFile({ ...this.props.uri, filename: fullpath }, FileMode.EditNew)
    }

    onClickNewFolder     = () => this.setState({ newFolderDialogOpen: true })
    closeNewFolderDialog = () => this.setState({ newFolderDialogOpen: false })
    async createNewFolder(evt?: React.FormEvent) {
        if (evt) {
            evt.preventDefault()
        }

        if (!this._inputNewFolderName) {
            return
        }

        const filename = this._inputNewFolderName.value

        this.closeNewFolderDialog()

        if (filename.trim().length === 0) {
            return
        }

        const basepath = this.props.uri.filename || '.'
        const fullpath = path.join(basepath, filename)
        const folderURI = { ...this.props.uri, filename: fullpath }

        try {
            await createFolder(folderURI)
        } catch (err) {
            // ignore "this folder already exists", rethrow anything else
            if (err.toString().indexOf('EEXIST') === -1) {
                throw err
            }
        }

        selectFile(folderURI, FileMode.View)
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return !isEqual(this.props.uri, nextProps.uri) ||
            this.props.files !== nextProps.files ||
            this.props.fileExtensionsHidden !== nextProps.fileExtensionsHidden ||
            this.props.canEditFiles !== nextProps.canEditFiles ||
            this.state.tree !== nextState.tree ||
            this.state.newFileDialogOpen !== nextState.newFileDialogOpen ||
            this.state.newFolderDialogOpen !== nextState.newFolderDialogOpen ||
            this.state.quickNavOpen !== nextState.quickNavOpen ||
            this.state.quickNavQuery !== nextState.quickNavQuery ||
            this.state.quickNavFileList !== nextState.quickNavFileList
    }
}

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    uri: URI
    canEditFiles?: boolean
}

interface StateProps {
    files: { [name: string]: IRepoFile }
    fileExtensionsHidden: boolean | undefined
}

interface State {
    newFileDialogOpen: boolean
    newFolderDialogOpen: boolean
    tree: any
    quickNavOpen: boolean
    quickNavQuery: string
    quickNavFileList: IRepoFile[]
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
    quickNavSearchBar: {
        padding: '0 8px',
        marginBottom: 10,

        '& svg': {
            color: 'rgba(0, 0, 0, 0.54)',
        },
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    return {
        files: state.repo.filesByURI[repoUriToString(ownProps.uri)],
        fileExtensionsHidden: state.user.userSettings.fileExtensionsHidden || false,
    }
}

const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(FileList))
