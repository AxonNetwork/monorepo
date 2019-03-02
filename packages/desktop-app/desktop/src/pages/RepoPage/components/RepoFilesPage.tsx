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
import { fetchRepoFiles } from 'conscience-components/redux/repo/repoActions'
import { IGlobalState } from 'conscience-components/redux'
import { getURIFromParams } from 'conscience-components/env-specific'
import { IRepoFile, URI } from 'conscience-lib/common'
import { autobind, uriToString } from 'conscience-lib/utils'
import isEqual from 'lodash/isEqual'


@autobind
class RepoFilesPage extends React.Component<Props>
{

    componentDidMount() {
        if (this.props.uri !== undefined) {
            this.props.fetchRepoFiles({ uri: this.props.uri })
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.uri !== undefined && !isEqual(this.props.uri, prevProps.uri)) {
            this.props.fetchRepoFiles({ uri: this.props.uri })
        }
    }

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
                        showViewerPicker={true}
                        showButtons
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
    fetchRepoFiles: typeof fetchRepoFiles
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
        // [theme.breakpoints.up(1090)]: {
        alignItems: 'center',
        // },
    },
    // fileViewer: {
    //     [theme.breakpoints.up(1280)]: {
    //         width: 960,
    //         // width: '100%',
    //     },
    //     [theme.breakpoints.down(1280)]: {
    //         maxWidth: '100%',
    //     },
    // },
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
    const files = state.repo.filesByURI[uriToString(uri)]
    return {
        uri,
        files,
    }
}

const mapDispatchToProps = {
    fetchRepoFiles,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoFilesPage))