import union from 'lodash/union'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import SecuredText from 'conscience-components/SecuredText'
import SharedUsers from 'conscience-components/SharedUsers'
import FileViewer from 'conscience-components/FileViewer'
import DiscussionList from 'conscience-components/DiscussionList'
import { H6 } from 'conscience-components/Typography/Headers'
import Timeline from 'conscience-components/Timeline'
import { selectFile } from 'conscience-components/navigation'
import { IGlobalState } from 'conscience-components/redux'
import { getURIFromParams, getRepoID } from 'conscience-components/env-specific'
import { FileMode, IUser, URI } from 'conscience-lib/common'
import { autobind, uriToString } from 'conscience-lib/utils'


@autobind
class RepoHomePage extends React.Component<Props>
{
    render() {
        const { classes } = this.props
        if (!this.props.uri) return null

        return (
            <div className={classes.main}>

                <div className={classes.readmeContainer}>
                    <FileViewer
                        uri={{ ...this.props.uri, commit: 'working', filename: 'README.md' }}
                        showViewerPicker={false}
                        fallback={(
                            <div className={classes.readmeContainerNoReadme}>
                                <div className={classes.readmeContainerNoReadmeContents} onClick={this.onClickEditReadme}>
                                    <div className={classes.noReadmeText}>
                                        Add a welcome message and instructions to this repository using the Conscience desktop app.
                                    </div>

                                    <AddCircleOutlineIcon className={classes.noReadmeAddIcon} />
                                </div>
                            </div>
                        )}
                    />
                </div>
                <div className={classes.sidebarComponents}>
                    {this.props.hasCommits &&
                        <Card className={classes.card}>
                            <CardContent classes={{ root: classes.securedTextCard }}>
                                <SecuredText uri={this.props.uri} />
                            </CardContent>
                        </Card>
                    }

                    <Card className={classes.card}>
                        <CardContent>
                            <H6>Team</H6>

                            <div className={classes.sharedUsersRow}>
                                <SharedUsers uri={this.props.uri} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={classes.card}>
                        <CardContent>
                            <H6>Recent Discussions</H6>

                            <DiscussionList
                                uri={this.props.uri}
                                maxLength={2}
                            />
                        </CardContent>
                    </Card>
                    <Card className={classes.card}>
                        <CardContent>
                            <H6>Recent Commits</H6>

                            <Timeline
                                uri={this.props.uri}
                                defaultRowsPerPage={2}
                                hidePagination
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    onClickEditReadme() {
        if (this.props.uri) {
            selectFile({ ...this.props.uri, commit: 'working', filename: 'README.md' }, FileMode.EditNew)
        }
    }
}

interface MatchParams {
    repoHash?: string
    repoID?: string
}

interface Props extends RouteComponentProps<MatchParams> {
    uri?: URI
    sharedUsers: IUser[]
    hasCommits: boolean
    hasReadme: boolean
    classes: any
}

const styles = (theme: Theme) => createStyles({
    main: {
        display: 'flex',
        [theme.breakpoints.down(1080)]: {
            flexDirection: 'column',
        },
        margin: '32px auto',
        maxWidth: 1440,
    },
    readmeContainer: {
        position: 'relative',
        flexGrow: 1,
        flexBasis: 640,
        minWidth: 0,
        [theme.breakpoints.up(1080)]: {
            marginRight: 16,
        },
        [theme.breakpoints.down(1080)]: {
            marginBottom: 16,
        },
    },
    editReadmeButton: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    readmeContainerNoReadme: {
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        border: '3px solid #c5c5c5',
        padding: 30,
        textAlign: 'center',
        flexBasis: 320,
    },
    readmeContainerNoReadmeContents: {
        cursor: 'pointer',
        position: 'relative',
        top: '15%',
    },
    noReadmeText: {
        fontSize: '1.2rem',
        color: '#a2a2a2',
        fontWeight: 700,
        marginBottom: 20,
    },
    noReadmeAddIcon: {
        fontSize: '5rem',
        color: '#a2a2a2',
    },
    sidebarComponents: {
        flexGrow: 1,
        minWidth: 350,
        flexBasis: 450,
        [theme.breakpoints.up(1080)]: {
            marginLeft: 16,
        },
    },
    card: {
        marginBottom: 16,
    },
    securedTextCard: {
        padding: 16,
    },
    sharedUsersRow: {
        display: 'flex',
        flexDirection: 'row',
        '& button': {
            marginRight: 4,
        },
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: RouteComponentProps<MatchParams>) => {
    const uri = getURIFromParams(ownProps.match.params)
    const repoID = uri !== undefined ? getRepoID(uri) : ''
    const { admins = [], pushers = [], pullers = [] } = state.repo.permissionsByID[repoID] || {}
    const sharedUsers = union(admins, pushers, pullers)
        .map(username => state.user.usersByUsername[username])
        .map(id => state.user.users[id])
    const uriStr = uriToString(uri)
    const hasCommits = (state.repo.commitListsByURI[uriStr] || []).length > 0
    const hasReadme = (state.repo.filesByURI[uriStr] || {})['README.md'] !== undefined
    return {
        uri,
        sharedUsers,
        hasCommits,
        hasReadme,
    }
}

const mapDispatchToProps = {}

const RepoHomePageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoHomePage))

export default RepoHomePageContainer
