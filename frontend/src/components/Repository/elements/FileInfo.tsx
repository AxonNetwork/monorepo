import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Breadcrumbs from './FileList/Breadcrumbs'
import { IRepoFile, ITimelineEvent } from 'common'
import autobind from 'utils/autobind'
import { IGetDiffAction, IRevertFilesAction, ISelectFileAction } from 'redux/repository/repoActions'
import SecuredText from './FileInfo/SecuredText'
import CreateDiscussion from './Discussion/CreateDiscussion'
import FileViewer from './FileViewer'

@autobind
class FileInfo extends React.Component<Props>
{
    render() {
        const { classes, file } = this.props

        return (
            <React.Fragment>
                <Breadcrumbs
                    repoRoot={this.props.repoRoot}
                    selectedFolder={file.name}
                    selectFile={this.props.selectFile}
                />

                <div className={classes.infoContainer}>
                    <SecuredText
                        firstVerified={this.props.firstVerified}
                        lastVerified={this.props.lastVerified}
                        selectCommit={this.props.selectCommit}
                    />
                    <div className={classes.fileViewerContainer}>
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
}

interface Props {
    file: IRepoFile
    firstVerified?: ITimelineEvent
    lastVerified?: ITimelineEvent
    repoRoot: string
    getDiff: (payload: IGetDiffAction['payload']) => IGetDiffAction
    revertFiles: (payload: IRevertFilesAction['payload']) => IRevertFilesAction
    selectFile: (payload: ISelectFileAction['payload']) => ISelectFileAction
    selectCommit: Function
    classes: any
}

const styles = (theme: Theme) => createStyles({
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
})

export default withStyles(styles)(FileInfo)
