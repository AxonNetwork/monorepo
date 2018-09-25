import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import path from 'path'

import FileList from './FileList/FileList'
import Checkpoint from './Checkpoint'
import FileInfo from './FileInfo'

class RepoFilesPage extends Component
{

    render() {
        const { classes, repo, selectedFile } = this.props
        const files = repo.files || {}
        const filesChanged = Object.keys(files).some((name) => {
            const file = files[name]
            return (file.status === "*modified" || file.status === "*added")
        })

        if (selectedFile !== undefined && !selectedFile.isFolder) {
            const relPath = selectedFile.file.replace(repo.folderPath+'/', '')
            let timeline = []
            if (this.props.repo.timeline !== undefined) {
                timeline = this.props.repo.timeline.filter(e => e.files.indexOf(relPath) > -1)
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
            return (
                <div className={classes.fileListContainer}>
                    <div className={classes.fileList}>
                        <FileList
                            folderPath={this.props.repo.folderPath}
                            files={files}
                            selectedFile={selectedFile}
                            selectFile={this.props.selectFile}
                        />
                    </div>
                    {filesChanged > 0 &&
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

RepoFilesPage.propTypes = {
    repo: PropTypes.object.isRequired,
    checkpointRepo: PropTypes.func.isRequired,
    selectedFile: PropTypes.object,
    selectFile: PropTypes.func.isRequired,
    unselectFile: PropTypes.func.isRequired,
    getDiff: PropTypes.func.isRequired,
    revertFiles: PropTypes.func.isRequired,
}

const styles = theme => ({
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

export default withStyles(styles)(RepoFilesPage)
