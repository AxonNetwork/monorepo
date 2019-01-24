import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import FileList from 'conscience-components/FileList'
import Breadcrumbs from 'conscience-components/Breadcrumbs'
import LargeProgressSpinner from 'conscience-components/LargeProgressSpinner'
import { H5 } from 'conscience-components/Typography/Headers'
import SecuredText from 'conscience-components/SecuredText'
import FileViewer from 'conscience-components/FileViewer'
import CreateDiscussion from 'conscience-components/CreateDiscussion'
import { getDiff } from 'conscience-components/redux/repo/repoActions'
import { IGlobalState } from 'conscience-components/redux'
import { IRepo, URI, URIType } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoFilesPage extends React.Component<Props>
{
    render() {
        const { repo, classes } = this.props
        if (repo === undefined) { return null }
        const files = repo.files
        if (files === undefined) {
            return <LargeProgressSpinner />
        }

        const { commit, filename } = this.props.match.params
        const file = files[filename || '']

        const fileURI = {
            ...this.props.uri,
            commit,
            filename,
        }

        if (!filename || !file) {
            return (
                <div className={classes.fileListContainer}>
                    <FileList
                        uri={fileURI}
                        files={repo.files || {}}
                        fileExtensionsHidden={this.props.fileExtensionsHidden}
                        canEditFiles
                        openFileIcon
                    />
                </div>
            )
        }
        return (
            <div>
                <div className={classes.fileInfo}>
                    <Breadcrumbs uri={fileURI} />
                    <SecuredText uri={fileURI} />
                </div>
                <div className={classes.fileViewerContainer}>
                    <div className={classes.fileViewer}>
                        <FileViewer
                            uri={fileURI}
                            showViewerPicker={true}
                        />
                    </div>
                    <div className={classes.createDiscussion}>
                        <H5>Start a discussion on {filename}</H5>
                        <CreateDiscussion
                            uri={fileURI}
                            attachedTo={filename}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

interface MatchParams {
    repoHash: string
    commit: string
    filename?: string | undefined
}

interface Props extends RouteComponentProps<MatchParams> {
    uri: URI
    repo: IRepo | undefined
    fileExtensionsHidden: boolean
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
    const uri = { type: URIType.Local, repoRoot } as URI

    return {
        uri,
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