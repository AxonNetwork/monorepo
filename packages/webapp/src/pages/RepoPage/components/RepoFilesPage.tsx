import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import FileViewer from 'conscience-components/FileViewer'
import Breadcrumbs from 'conscience-components/Breadcrumbs'
import { H5 } from 'conscience-components/Typography/Headers'
import FileList from 'conscience-components/FileList'
import SecuredText from 'conscience-components/SecuredText'
import CreateDiscussion from 'conscience-components/CreateDiscussion'
import { IGlobalState } from 'conscience-components/redux'
import { IRepoFile, URI, URIType } from 'conscience-lib/common'
import { autobind, uriToString } from 'conscience-lib/utils'


@autobind
class RepoFilesPage extends React.Component<Props>
{
    render() {
        const { files, classes } = this.props
        if (!this.props.uri) {
            return null
        }

        const { repoID, commit, filename } = this.props.match.params
        const file = (files || {})[filename || '']
        const fileURI = { ...this.props.uri, repoID, commit, filename }

        if (!filename || !file || file.type === 'folder') {
            return (
                <div className={classes.fileListContainer}>
                    <FileList uri={fileURI} />
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
    repoID: string
    commit: string
    filename?: string
}

interface Props extends RouteComponentProps<MatchParams> {
    uri: URI
    files: { [name: string]: IRepoFile } | undefined
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
        justifyContent: 'center',
        [theme.breakpoints.up(1090)]: {
            alignItems: 'center',
        },
    },
    // fileViewer: {
    //     maxWidth: 960,
    // },
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
    const uri = { type: URIType.Network, repoID } as URI
    const files = state.repo.filesByURI[uriToString(uri)]
    return {
        uri,
        files,
    }
}

const mapDispatchToProps = {}

const RepoFilesPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoFilesPage))

export default RepoFilesPageContainer
