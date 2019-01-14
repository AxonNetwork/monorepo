import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import SecuredText from './connected/SecuredText'
import FileViewer from './connected/FileViewer'
import CreateDiscussion from './connected/CreateDiscussion'
import Breadcrumbs from 'conscience-components/Breadcrumbs'
import FileList from 'conscience-components/FileList'
import { IGlobalState } from 'redux/store'
import { IRepo, FileMode } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoFilesPage extends React.Component<Props>
{
    selectFile(payload: { filename: string | undefined, mode: FileMode }) {
        const repoID = this.props.match.params.repoID
        const { filename, mode } = payload
        if (filename === undefined) {
            this.props.history.push(`/repo/${repoID}/files`)
        } else if (mode === FileMode.View) {
            this.props.history.push(`/repo/${repoID}/files/${filename}`)
        } else {
            this.props.history.push(`/repo/${repoID}/edit/${filename}`)
        }
    }

    render() {
        const { repo, classes } = this.props
        const files = repo.files
        if (files === undefined) {
            return (
                <div className={classes.progressContainer}>
                    <CircularProgress color="secondary" />
                </div>
            )
        }

        const selected = this.props.match.params.filename || ''
        const repoID = this.props.match.params.repoID || ''
        const file = files[selected]
        if (file !== undefined) {
            return (
                <div>
                    <div className={classes.fileInfo}>
                        <Breadcrumbs
                            repoRoot={repo.repoID}
                            selectedFolder={selected}
                            selectFile={this.selectFile}
                            classes={{ root: classes.breadcrumbs }}
                        />
                        <SecuredText
                            repoID={repo.repoID}
                            history={this.props.history}
                            lastUpdated={file.modified}
                            filename={file.name}
                        />
                    </div>
                    <div className={classes.fileViewerContainer}>
                        <div className={classes.fileViewer}>
                            <FileViewer filename={selected} repoID={repoID} showViewerPicker={true} />
                        </div>
                        <div className={classes.createDiscussion}>
                            <Typography variant="h5">Start a discussion on {selected}</Typography>
                            <CreateDiscussion
                                repoID={repo.repoID}
                                attachedTo={selected}
                                history={this.props.history}
                            />
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div className={classes.fileListContainer}>
                <FileList
                    repoRoot={repo.repoID}
                    files={files}
                    selectFile={this.selectFile}
                    selectedFolder={selected}
                    fileExtensionsHidden={this.props.fileExtensionsHidden}
                />
            </div>
        )
    }
}

interface MatchParams {
    repoID: string
    filename: string | undefined
}

interface Props extends RouteComponentProps<MatchParams> {
    repo: IRepo
    fileExtensionsHidden: boolean
    classes: any
}

const styles = (theme: Theme) => createStyles({
    progressContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 256,
    },
    fileInfo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        marginBottom: 16,
    },
    fileViewerContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fileViewer: {
        maxWidth: 960,
    },
    createDiscussion: {
        textAlign: 'center',
        marginTop: 32,
        maxWidth: 700,
    },
    fileListContainer: {
        marginTop: 16,
    },
})

const mapStateToProps = (state: IGlobalState, props: Props) => {
    const repoID = props.match.params.repoID
    const repo = state.repo.repos[repoID]
    return {
        repo,
        fileExtensionsHidden: state.user.userSettings.fileExtensionsHidden || false,
    }
}

const mapDispatchToProps = {}

const RepoFilesPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoFilesPage))

export default RepoFilesPageContainer
