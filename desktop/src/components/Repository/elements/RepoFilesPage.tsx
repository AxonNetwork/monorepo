import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import FileList from './FileList/FileList'
import FileInfo from './FileInfo'
import MergeConflictResolver from './MergeConflictResolver/MergeConflictResolver'
import MarkdownEditor from 'components/Repository/elements/MarkdownEditor'
import { IRepo } from 'common'
import { IGlobalState } from 'redux/store'
import { IGetDiffAction, IRevertFilesAction, ISelectFileAction, ISelectCommitAction,
    selectFile, selectCommit, navigateRepoPage, getDiff, revertFiles } from 'redux/repository/repoActions'
import { RepoPage, FileMode } from 'redux/repository/repoReducer'
import autobind from 'utils/autobind'


@autobind
class RepoFilesPage extends React.Component<Props>
{
    selectCommit(commit: string) {
        this.props.navigateRepoPage({ repoPage: RepoPage.History })
        this.props.selectCommit({ selectedCommit: commit })
    }

    render() {
        const { repo, selectedFile, classes } = this.props
        if (repo === undefined) {
            return null
        }

        const files = repo.files || {}

        if (selectedFile !== undefined && selectedFile.file !== undefined && !selectedFile.isFolder) {
            switch(selectedFile.mode) {
                case FileMode.Edit: {
                    return (
                        <MarkdownEditor
                            repoRoot={repo.path}
                            filename={selectedFile.file}
                            defaultContents={selectedFile.defaultEditorContents}
                        />
                    )
                }

                case FileMode.ResolveConflict: {
                    return (
                        <MergeConflictResolver
                            repoRoot={repo.path}
                            filename={selectedFile.file}
                        />

                    )
                }

                case FileMode.View:
                default: {
                    const relPath = selectedFile.file.replace(repo.path + '/', '')
                    return (
                        <div className={classes.fileInfoContainer}>
                            <FileInfo
                                file={files[relPath]}
                                repoRoot={repo.path}
                            />
                        </div>
                    )
                }

            }
        } else {
            const selectedFolder = selectedFile !== undefined ? selectedFile.file : undefined
            return (
                <div className={classes.fileListContainer}>
                    <div className={classes.fileList}>
                        <FileList
                            repoRoot={repo.path}
                            files={files}
                            selectedFolder={selectedFolder}
                        />
                    </div>
                </div>
            )
        }
    }
}

interface Props {
    repo: IRepo | undefined
    selectedFile: ISelectFileAction['payload']['selectedFile'] // { file: string, isFolder: boolean, editing: boolean } | undefined
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