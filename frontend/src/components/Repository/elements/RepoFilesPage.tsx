import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import FileList from './FileList/FileList'
import Checkpoint from './Checkpoint'
import FileInfo from './FileInfo'
import { IRepo } from 'common'
import { IGlobalState } from 'redux/store'
import { ICheckpointRepoAction, IGetDiffAction, IRevertFilesAction, ISelectFileAction, ISelectCommitAction,
    checkpointRepo, selectFile, selectCommit, navigateRepoPage, getDiff, revertFiles } from 'redux/repository/repoActions'
import { RepoPage } from 'redux/repository/repoReducer'

import { getFirstVerifiedEvent, getLastVerifiedEvent } from 'utils/timeline'
import autobind from 'utils/autobind'


@autobind
class RepoFilesPage extends React.Component<Props>
{
    selectCommit(commit: string){
        this.props.navigateRepoPage({ repoPage: RepoPage.History })
        this.props.selectCommit({ selectedCommit: commit })
    }

    render() {
        const { repo, selectedFile, classes } = this.props
        if (repo === undefined) {
            return null
        }

        const files = repo.files || {}
        const filesChanged = Object.keys(files).some((name) => {
            const file = files[name]
            return (file.status === 'M' || file.status === '?')
        })

        if (selectedFile !== undefined && selectedFile.file !== undefined && !selectedFile.isFolder) {
            const relPath = selectedFile.file.replace(repo.path + '/', '')
            const lastVerified = getLastVerifiedEvent(repo.commitList||[], repo.commits||{})
            const firstVerified = getFirstVerifiedEvent(repo.commitList||[], repo.commits||{}, relPath)
            return (
                <div className={classes.fileInfoContainer}>
                    <FileInfo
                        file={files[relPath]}
                        repoRoot={repo.path}
                        firstVerified={firstVerified}
                        lastVerified={lastVerified}
                        selectFile={this.props.selectFile}
                        selectCommit={this.selectCommit}
                        getDiff={this.props.getDiff}
                        revertFiles={this.props.revertFiles}
                    />
                </div>
            )
        } else {
            const selectedFolder = selectedFile !== undefined ? selectedFile.file : undefined
            return (
                <div className={classes.fileListContainer}>
                    <div className={classes.fileList}>
                        <FileList
                            repoRoot={repo.path}
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
    checkpointRepo: (payload: ICheckpointRepoAction['payload']) => ICheckpointRepoAction
    getDiff: (payload: IGetDiffAction['payload']) => IGetDiffAction
    revertFiles: (payload: IRevertFilesAction['payload']) => IRevertFilesAction
    selectFile: (payload: ISelectFileAction['payload']) => ISelectFileAction
    selectCommit: (payload: ISelectCommitAction['payload']) => ISelectCommitAction
    navigateRepoPage: typeof navigateRepoPage
    classes: any
}


const styles = createStyles({
    fileListContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    fileInfoContainer: {
        overflowY: 'auto',
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

    let repo: IRepo | undefined = undefined
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
    selectCommit,
    navigateRepoPage,
    getDiff,
    revertFiles,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoFilesPage))