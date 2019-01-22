import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import FileViewer from 'conscience-components/FileViewer'
import Breadcrumbs from 'conscience-components/Breadcrumbs'
import { H5 } from 'conscience-components/Typography/Headers'
import FileList from 'conscience-components/FileList'
import SecuredText from 'conscience-components/SecuredText'
import CreateDiscussion from 'conscience-components/CreateDiscussion'
import { IGlobalState } from 'conscience-components/redux'
import { IRepo, URIType } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoFilesPage extends React.Component<Props>
{
    render() {
        const { repo, classes } = this.props
        if (repo.files === undefined) {
            return (
                <div className={classes.progressContainer}>
                    <CircularProgress color="secondary" />
                </div>
            )
        }

        const { repoID, commit, filename } = this.props.match.params
        const file = repo.files[filename || '']

        if (!filename || !file) {
            return (
                <div className={classes.fileListContainer}>
                    <FileList
                        uri={{ type: URIType.Network, repoID, commit, filename }}
                        files={repo.files}
                        fileExtensionsHidden={this.props.fileExtensionsHidden}
                    />
                </div>
            )
        }

        return (
            <div>
                <div className={classes.fileInfo}>
                    <Breadcrumbs
                        uri={{ type: URIType.Network, repoID, commit, filename }}
                        classes={{ root: classes.breadcrumbs }}
                    />
                    <SecuredText uri={{ type: URIType.Network, repoID, commit, filename }} />
                </div>
                <div className={classes.fileViewerContainer}>
                    <div className={classes.fileViewer}>
                        <FileViewer
                            uri={{ type: URIType.Network, repoID, commit, filename }}
                            showViewerPicker={true}
                        />
                    </div>

                    <div className={classes.createDiscussion}>
                        <H5>Start a discussion on {filename}</H5>
                        <CreateDiscussion
                            uri={{ type: URIType.Network, repoID, commit, filename }}
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
