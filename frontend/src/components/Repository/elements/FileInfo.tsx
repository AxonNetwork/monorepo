import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'

import Breadcrumbs from './FileList/Breadcrumbs'
import File from './FileList/File'
import Timeline from './Timeline/Timeline'
import DiffViewer from './DiffViewer/DiffViewer'
import Thread from './Discussion/Thread'
import { IRepoFile, ITimelineEvent } from 'common'
import autobind from 'utils/autobind'
import { IGetDiffAction, IRevertFilesAction, ISelectFileAction } from 'redux/repository/repoActions'


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
                <Table className={classes.table}>
                    <TableBody>
                        <File file={file} />
                    </TableBody>
                </Table>
                <div className={classes.infoContainer}>
                    <div className={classes.timeline}>
                        {(file.diff || '').length > 0 &&
                            <DiffViewer
                                diff={file.diff}
                                type={file.type}/>
                        }
                        <Timeline
                            repoRoot={this.props.repoRoot}
                            commits={this.props.commits}
                            commitList={this.props.commitList}
                            getDiff={this.props.getDiff}
                            revertFiles={this.props.revertFiles}
                        />
                    </div>
                    <div className={classes.thread}>
                        <Thread
                            title={file.name}
                            type="file"
                            subject={file.name}
                        />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

interface Props {
    file: IRepoFile
    commits: {[commit: string]: ITimelineEvent} | undefined
    commitList: string[]
    repoRoot: string
    getDiff: (payload: IGetDiffAction['payload']) => IGetDiffAction
    revertFiles: (payload: IRevertFilesAction['payload']) => IRevertFilesAction
    selectFile: (payload: ISelectFileAction['payload']) => ISelectFileAction
    classes: any
}

const styles = (theme: Theme) => createStyles({
    infoContainer: {
        display: 'flex',
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
})

export default withStyles(styles)(FileInfo)
