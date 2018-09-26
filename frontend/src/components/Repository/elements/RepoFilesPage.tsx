import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import FileList from './FileList/FileList'
import Checkpoint from './Checkpoint'
import FileInfo from './FileInfo'
import { IRepo, ITimelineEvent } from 'common'
import { IGlobalState } from 'redux/store'
import { checkpointRepo, selectFile, getDiff, revertFiles } from 'redux/repository/repoActions'

export interface RepoFilesPageProps {
    repo: IRepo
    selectedFile: {
        file: string
        isFolder: boolean
    }
    checkpointRepo: Function
    selectFile: Function
    getDiff: Function
    revertFiles: Function
    classes: any
}

class RepoFilesPage extends React.Component<RepoFilesPageProps>
{

    render() {
        const { repo, selectedFile, classes } = this.props
        const files = repo.files || {}
        const filesChanged = Object.keys(files).some((name) => {
            const file = files[name]
            return (file.status === '*modified' || file.status === '*added')
        })

        if (selectedFile !== undefined && selectedFile.file !== undefined && !selectedFile.isFolder) {
            const relPath = selectedFile.file.replace(repo.folderPath + '/', '')
            let timeline: Array<ITimelineEvent> = []
            if (repo.timeline !== undefined) {
                timeline = repo.timeline.filter(e => e.files.indexOf(relPath) > -1)
            }
            return (
                <FileInfo
                    file={files[relPath]}
                    folderPath={this.props.repo.folderPath}
                    timeline={timeline}
                    selectFile={this.props.selectFile}
                    getDiff={this.props.getDiff}
                    revertFiles={this.props.revertFiles}
                />
            )
        } else {
            const selectedFolder = (selectedFile !== undefined) ? selectedFile.file : undefined
            return (
                <div className={classes.fileListContainer}>
                    <div className={classes.fileList}>
                        <FileList
                            folderPath={this.props.repo.folderPath}
                            files={files}
                            selectedFolder={selectedFolder}
                            selectFile={this.props.selectFile}
                        />
                    </div>
                    {filesChanged &&
                        <div className={classes.checkpoint}>
                            <Checkpoint
                                checkpointRepo={this.props.checkpointRepo}
                                folderPath={this.props.repo.folderPath}
                                repoID={this.props.repo.repoID}
                            />
                        </div>
                    }
                </div>
            )
        }
    }
}

const styles = createStyles({
    fileListContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        paddingBottom: 120,
    },
    fileList: {
        flexGrow: 1,
        overflowX: 'hidden',
        overflowY: 'auto',
    },
    checkpoint: {
        alignSelf: 'flex-end',
        width: '100%',
    },
})

const mapStateToProps=(state: IGlobalState) => {
    const selected = state.repository.selectedRepo || ""
    const repo = state.repository.repos[selected]
    const selectedFile = state.repository.selectedFile
    return {
        repo: repo,
        selectedFile: selectedFile,
    }
}

const mapDispatchToProps = {
    checkpointRepo,
    selectFile,
    getDiff,
    revertFiles,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(RepoFilesPage))