import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import Button from '@material-ui/core/Button'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

import path from 'path'

import File from './FileList/File'
import Timeline from './Timeline/Timeline'
import DiffViewer from './DiffViewer/DiffViewer'
import Thread from './Discussion/Thread'
import { IRepoFile, ITimelineEvent } from 'common'

export interface FileInfoProps {
    file: IRepoFile
    timeline: ITimelineEvent[]
    folderPath: string
    selectFile: Function
    getDiff: Function
    revertFiles: Function
    classes: any
}

class FileInfo extends React.Component<FileInfoProps> {
    goUpOneDir = () => {
        const dir = path.dirname(this.props.file.path)
        this.props.selectFile({file: dir, isFolder: true})
    }

    render() {
        const {classes, file} = this.props

        return (
            <React.Fragment>
                <Button className={classes.button} onClick={this.goUpOneDir} color="secondary">
                    <ArrowBackIcon />
                    Back
                </Button>
                <Table className={classes.table}>
                    <TableBody>
                        <File file={file} />
                    </TableBody>
                </Table>
                <div className={classes.infoContainer}>
                    <div className={classes.timeline}>
                        {file.diff.length > 0 &&
                            <DiffViewer
                                diff={file.diff}
                                type={file.type}/>
                        }
                        <Timeline
                            folderPath={this.props.folderPath}
                            timeline={this.props.timeline}
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
    button: {
        textTransform: 'none',
        fontSize: '12pt',
        padding: '5px 16px',
        minHeight: 0,
        height: '32px',
    },
    table: {
        borderTop: '1px solid rgba(224, 224, 224, 1)',
    },
})

export default withStyles(styles)(FileInfo)
