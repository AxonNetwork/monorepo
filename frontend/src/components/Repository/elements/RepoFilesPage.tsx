import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import FileList from './FileList/FileList'
import Checkpoint from './Checkpoint'
import FileInfo from './FileInfo'
import { IRepo, ITimelineEvent } from 'common'
import { IGlobalState } from 'redux/store'
import { checkpointRepo, selectFile, getDiff, revertFiles } from 'redux/repository/repoActions'

class RepoFilesPage extends React.Component<Props>
{
    render() {
        const { repo, selectedFile, classes } = this.props
        if (repo === undefined) {
            return null
        }

        const files = repo.files || {}
        const filesChanged = Object.keys(files).some((name) => {
            const file = files[name]
            return (file.status === '*modified' || file.status === '*added')
        })

        if (selectedFile !== undefined && selectedFile.file !== undefined && !selectedFile.isFolder) {
            const relPath = selectedFile.file.replace(repo.path + '/', '')
            let timeline = [] as ITimelineEvent[]
            if (repo.timeline !== undefined) {
                timeline = repo.timeline.filter(e => e.files.indexOf(relPath) > -1)
            }
            return (
                <FileInfo
                    file={files[relPath]}
                    folderPath={repo.path}
                    timeline={timeline}
                    selectFile={this.props.selectFile}
                    getDiff={this.props.getDiff}
                    revertFiles={this.props.revertFiles}
                />
            )
        } else {
            const selectedFolder = selectedFile !== undefined ? selectedFile.file : undefined
            return (
                <div className={classes.fileListContainer}>
                    <div className={classes.fileList}>
                        <FileList
                            folderPath={repo.path}
                            files={files}
                            selectedFolder={selectedFolder}
                            selectFile={this.props.selectFile}
                        />
                    </div>
                    {filesChanged &&
                        <div className={classes.checkpoint}>
                            <Checkpoint
                                checkpointRepo={this.props.checkpointRepo}
                                folderPath={repo.path}
                                repoID={repo.repoID}
                            />
                        </div>
                    }
                </div>
            )
        }
    }
}

interface Props {
    repo: IRepo | undefined
    selectedFile: { file: string, isFolder: boolean } | undefined
    checkpointRepo: Function
    selectFile: Function
    getDiff: Function
    revertFiles: Function
    classes: any
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

const mapStateToProps = (state: IGlobalState) => {
    const selectedFile = state.repository.selectedFile
    const selectedRepo = state.repository.selectedRepo

    let repo: IRepo|undefined = undefined
    if (selectedRepo !== null && selectedRepo !== undefined) {
        repo = state.repository.repos[selectedRepo] || undefined
    }
    return {
        repo,
        selectedFile,
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