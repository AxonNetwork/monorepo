import path from 'path'
import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import EditIcon from '@material-ui/icons/Edit'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import { selectFile } from 'redux/repository/repoActions'
import Breadcrumbs from './FileList/Breadcrumbs'
import { IRepoFile } from 'common'
import autobind from 'utils/autobind'
import SecuredText from './FileInfo/SecuredText'
import CreateDiscussion from './Discussion/CreateDiscussion'
import FileViewer from './FileViewer/FileViewer'
import { FileMode } from 'redux/repository/repoReducer'
const shell = (window as any).require('electron').shell


@autobind
class FileInfo extends React.Component<Props>
{
    render() {
        const { classes, file } = this.props
        if (!file) {
            return <div>Loading...</div>
        }

        // @@TODO: filetype standardization
        const extensions = [ '.md', '.markdown', '.mdown', '.txt' ]
        const canQuickEdit = extensions.includes(path.extname(this.props.file.name).toLowerCase())

        return (
            <React.Fragment>
                <div className={classes.headerContainer}>
                    <div className={classes.headerLeft}>
                        <Breadcrumbs
                            repoRoot={this.props.repoRoot}
                            selectedFolder={file.name}
                            classes={{ root: classes.breadcrumbs }}
                        />
                    </div>
                    <SecuredText
                        lastUpdated={this.props.file.modified}
                        classes={{ root: classes.securedText }}
                        file={file.name}
                    />
                </div>

                <div className={classes.infoContainer}>

                    <div className={classes.fileViewerContainer}>
                        <div className={classes.fileViewerToolbar}>
                            {canQuickEdit &&
                            <Button mini color="secondary" aria-label="Quick edit" className={classes.toolbarButton} onClick={this.onClickQuickEdit}>
                                <EditIcon /> Quick edit
                            </Button>
                            }
                            <Button mini color="secondary" aria-label="Open" className={classes.toolbarButton} onClick={this.onClickOpen}>
                                <OpenInNewIcon /> Open
                            </Button>
                        </div>
                        <FileViewer filename={file.name} repoRoot={this.props.repoRoot} />
                    </div>

                    <div className={classes.startDiscussionSectionWrapper}>
                        <Typography variant="headline">Start a discussion about this file</Typography>
                        <div className={classes.startDiscussionFormWrapper}>
                            <CreateDiscussion
                                repoRoot={this.props.repoRoot}
                                attachedTo={file.name}
                                commentWrapperClasses={{ comment: classes.createDiscussionComment }}
                            />
                        </div>
                    </div>

                    {/* <div className={classes.timeline}>
                        <Timeline
                            repoRoot={this.props.repoRoot}
                            commits={this.props.commits}
                            commitList={this.props.commitList}
                            getDiff={this.props.getDiff}
                            revertFiles={this.props.revertFiles}
                        />
                    </div>*/}

                </div>
            </React.Fragment>
        )
    }

    onClickQuickEdit() {
        this.props.selectFile({ selectedFile: { file: this.props.file.name, isFolder: false, mode: FileMode.Edit } })
    }

    onClickOpen() {
        shell.openItem(path.join(this.props.repoRoot, this.props.file.name))
    }
}

interface Props {
    file: IRepoFile
    repoRoot: string

    selectFile: typeof selectFile

    classes: any
}

const styles = (theme: Theme) => createStyles({
    headerContainer: {
        display: 'flex',
    },
    headerLeft: {
        flexGrow: 1,
    },
    breadcrumbs: {
    },
    securedText: {
        textAlign: 'right',
        marginTop: 0,
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'center',
    },
    fileViewerContainer: {
        padding: 40,
        fontSize: '1rem',
        maxWidth: 960,
        alignSelf: 'center',
    },
    timeline: {
        flexGrow: 1,
        width: 0,
        marginRight: 32,
    },
    thread: {
        marginTop: theme.spacing.unit * 2,
        flexGrow: 1,
        width: 0,
        marginLeft: 32,
        border: '1px solid',
        borderColor: theme.palette.grey[300],
        height: '100%',
    },
    table: {
        marginTop: theme.spacing.unit,
        borderTop: '1px solid rgba(224, 224, 224, 1)',
    },
    startDiscussionSectionWrapper: {
        marginTop: 40,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    },
    startDiscussionFormWrapper: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
    },
    createDiscussionComment: {
        maxWidth: 720,
        flexGrow: 1,
    },
    fileViewerToolbar: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    toolbarButton: {
        margin: 0,
        padding: '0 8px',
    },
})

const mapDispatchToProps = {
    selectFile,
}

export default connect(
    null,
    mapDispatchToProps,
)(withStyles(styles)(FileInfo))

