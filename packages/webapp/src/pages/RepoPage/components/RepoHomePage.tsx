import union from 'lodash/union'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import classnames from 'classnames'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import FileViewer from 'conscience-components/FileViewer'
import UserAvatar from 'conscience-components/UserAvatar'
import { H6 } from 'conscience-components/Typography/Headers'
import SecuredText from 'conscience-components/SecuredText'
import DiscussionList from 'conscience-components/DiscussionList'
import Timeline from 'conscience-components/Timeline'
import { IGlobalState } from 'conscience-components/redux'
import { selectFile } from 'conscience-components/navigation'
import { IUser, URI, URIType, FileMode } from 'conscience-lib/common'
import { autobind, uriToString } from 'conscience-lib/utils'


@autobind
class RepoHomePage extends React.Component<Props>
{
    render() {
        const { uri, sharedUsers, classes } = this.props

        return (
            <div className={classes.main}>
                <div className={classnames(classes.readmeContainer, { [classes.readmeContainerNoReadme]: !this.props.hasReadme })}>
                    {this.props.hasReadme &&
                        <FileViewer
                            uri={{ ...this.props.uri, commit: 'HEAD', filename: 'README.md' }}
                            showViewerPicker={false}
                        />
                    }
                    {!this.props.hasReadme &&
                        <div className={classes.readmeContainerNoReadmeContents}>
                            <div className={classes.noReadmeText}>
                                Add a welcome message and instructions to this repository using the Conscience desktop app.
                            </div>

                            <AddCircleOutlineIcon className={classes.noReadmeAddIcon} />
                        </div>
                    }
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
                                {sharedUsers.map(user => {
                                    if (user !== undefined) {
                                        return <UserAvatar user={user} />
                                    } else {
                                        return null
                                    }
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={classes.card}>
                        <CardContent>
                            <H6>Recent Discussions</H6>

                            <DiscussionList
                                uri={uri}
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
        selectFile({ ...this.props.uri, commit: 'working', filename: 'README.md' }, FileMode.Edit)
    }
}

type Props = StateProps & RouteComponentProps<MatchParams> & { classes: any }

interface MatchParams {
    repoID: string
}

interface StateProps {
    uri: URI
    sharedUsers: IUser[]
    hasCommits: boolean
    hasReadme: boolean
}

const styles = (theme: Theme) => createStyles({
    main: {
        display: 'flex',
        marginTop: 32,
    },
    readmeContainer: {
        position: 'relative',
        flexGrow: 1,
        marginRight: 16,
        minWidth: 0,
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
        marginLeft: 16,
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
    const repoID = ownProps.match.params.repoID
    const uri = { type: URIType.Network, repoID } as URI
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
