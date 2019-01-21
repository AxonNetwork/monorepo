import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import FileList from 'conscience-components/FileList'
import Breadcrumbs from 'conscience-components/Breadcrumbs'
import LargeProgressSpinner from 'conscience-components/LargeProgressSpinner'
import { H5 } from 'conscience-components/Typography/Headers'
import SecuredText from './connected/SecuredText'
import FileViewer from './connected/FileViewer'
import CreateDiscussion from './connected/CreateDiscussion'
import { IGlobalState } from 'redux/store'
import { getDiff } from 'conscience-components/redux/repo/repoActions'
import { IRepo, FileMode } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoFilesPage extends React.Component<Props>
{
    render() {
        const { repo, classes } = this.props
        const repoHash = this.props.match.params.repoHash
        if (repo === undefined) { return null }
        const files = repo.files
        if (files === undefined) {
            return <LargeProgressSpinner />
        }

        const selected = this.props.match.params.filename || ''
        const file = files[selected]

        if (file !== undefined) {
            return (
                <div>
                    <div className={classes.fileInfo}>
                        <Breadcrumbs
                            repoRoot={repo.path || ""}
                            selectedFolder={selected}
                            selectFile={this.selectFile}
                        />
                        <SecuredText
                            repoHash={repoHash}
                            history={this.props.history}
                            lastUpdated={file.modified}
                            filename={file.name}
                        />
                    </div>
                    <div className={classes.fileViewerContainer}>
                        <div className={classes.fileViewer}>
                            <FileViewer
                                filename={selected}
                                repoHash={repoHash}
                                showViewerPicker={true}
                            />
                        </div>
                        <div className={classes.createDiscussion}>
                            <H5>Start a discussion on {selected}</H5>
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
                    repoRoot={repo.path || ""}
                    files={repo.files || {}}
                    selectFile={this.selectFile}
                    selectedFolder={selected}
                    fileExtensionsHidden={this.props.fileExtensionsHidden}
                    canEditFiles
                    openFileIcon
                />
            </div>
        )
    }

    selectFile(payload: { filename: string | undefined, mode: FileMode }) {
        const repoHash = this.props.match.params.repoHash
        const { filename, mode } = payload
        if (filename === undefined) {
            this.props.history.push(`/repo/${repoHash}/files`)
        } else if (mode === FileMode.Edit) {
            this.props.history.push(`/repo/${repoHash}/edit/${filename}`)
        } else if (mode === FileMode.ResolveConflict) {
            this.props.history.push(`/repo/${repoHash}/conflict/${filename}`)
        } else {
            this.props.history.push(`/repo/${repoHash}/files/${filename}`)
        }
    }

}

interface MatchParams {
    repoHash: string
    filename: string | undefined
}

interface Props extends RouteComponentProps<MatchParams> {
    repo: IRepo | undefined
    fileExtensionsHidden: boolean
    getDiff: typeof getDiff
    classes: any
}

const styles = (theme: Theme) => createStyles({
    fileInfo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        marginBottom: 16,
    },
    fileListContainer: {
        marginTop: 16
    },
    fileViewerContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        [theme.breakpoints.up(1090)]: {
            alignItems: 'center',
        },
    },
    fileViewer: {
        maxWidth: 960,
    },
    createDiscussion: {
        textAlign: 'center',
        marginTop: 32,
        maxWidth: 700,
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

const mapStateToProps = (state: IGlobalState, ownProps: RouteComponentProps<MatchParams>) => {
    const repoHash = ownProps.match.params.repoHash
    const repoRoot = state.repo.reposByHash[repoHash]
    const repo = state.repo.repos[repoRoot]

    return {
        repo,
        fileExtensionsHidden: state.user.userSettings.fileExtensionsHidden || false,
    }
}

const mapDispatchToProps = {
    getDiff,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoFilesPage))