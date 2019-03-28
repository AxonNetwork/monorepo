import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import FileList from 'conscience-components/FileList'
import Breadcrumbs from 'conscience-components/Breadcrumbs'
import { H5 } from 'conscience-components/Typography/Headers'
import SecuredText from 'conscience-components/SecuredText'
import FileViewer from 'conscience-components/FileViewer'
import CreateDiscussion from 'conscience-components/CreateDiscussion'
import { IGlobalState } from 'conscience-components/redux'
import { getURIFromParams } from 'conscience-components/env-specific'
import { IRepoFile, URI } from 'conscience-lib/common'
import { autobind, uriToString } from 'conscience-lib/utils'


@autobind
class RepoFilesPage extends React.Component<Props>
{

    render() {
        const { files, classes } = this.props
        if (!this.props.uri) {
            return null
        }

        const { commit, filename } = this.props.match.params
        const file = (files || {})[filename || '']
        const fileURI = { ...this.props.uri, commit, filename }

        if (!filename || !file || file.type === 'folder') {
            return (
                <div className={classes.fileListContainer}>
                    <FileList
                        uri={fileURI}
                        canEditFiles
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
                    <FileViewer
                        uri={fileURI}
                        showViewerPicker
                        canEdit
                        canOpen
                    />
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
    uri?: URI
    files: { [name: string]: IRepoFile } | undefined
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
        alignItems: 'center',
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
    const uri = getURIFromParams(ownProps.match.params)
    const uriStr = uriToString(uri)
    return {
        uri,
        files: state.repo.filesByURI[uriStr],
    }
}

const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoFilesPage))