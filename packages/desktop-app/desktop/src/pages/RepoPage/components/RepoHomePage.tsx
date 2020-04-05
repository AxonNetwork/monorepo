import isEqual from 'lodash/isEqual'
import classnames from 'classnames'
import union from 'lodash/union'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import Tooltip from '@material-ui/core/Tooltip'
import EditIcon from '@material-ui/icons/Edit'
import Button from '@material-ui/core/Button'
import SecuredText from 'conscience-components/SecuredText'
import SharedUsers from 'conscience-components/SharedUsers'
// import FileViewer from 'conscience-components/FileViewer'
import DiscussionList from 'conscience-components/DiscussionList'
import RenderMarkdown from 'conscience-components/RenderMarkdown/RenderMarkdown'
import { H6 } from 'conscience-components/Typography/Headers'
import Timeline from 'conscience-components/Timeline'
import { selectFile } from 'conscience-components/navigation'
import { IGlobalState } from 'conscience-components/redux'
import { getURIFromParams, getRepoID } from 'conscience-components/env-specific'
import { IRepoMetadata, FileMode, IUser, URI } from 'conscience-lib/common'
import { autobind, uriToString } from 'conscience-lib/utils'
import { getFileContents } from 'conscience-components/env-specific'


@autobind
class RepoHomePage extends React.Component<Props, State>
{
    state = {
        readmeContents: null,
        firstLoad: true,
        hovering: false,
    }

    onHoverViewer = (hovering: boolean) => {
        this.setState({ hovering })
    }

    onClickQuickEdit = () => {
        selectFile({ ...this.props.uri!, filename: 'README.md', commit: 'working' }, FileMode.Edit)
    }

    render() {
        const { classes } = this.props
        if (!this.props.uri) {
            return null
        } else if (this.state.firstLoad) {
            return null
        }

        return (
            <div className={classes.main}>

                <div className={classes.readmeContainer}
                            onMouseEnter={() => this.onHoverViewer(true)}
                            onMouseLeave={() => this.onHoverViewer(false)}
                >
                    <div className={classnames(
                        classes.buttons,
                        classes.buttonsAutoHide,
                        { [classes.buttonsAutoHideVisible]: this.state.hovering },
                    )}>
                    <Tooltip title="Quick edit">
                        <Button color="secondary"
                            onClick={this.onClickQuickEdit}
                        >
                            <EditIcon />
                        </Button>
                    </Tooltip>
                    </div>

                    {/*<FileViewer
                        uri={{ ...this.props.uri, commit: 'working', filename: 'README.md' }}
                        canEdit
                        autoHideToolbar={true}
                        fallback={(
                            <div className={classes.readmeContainerNoReadme}>
                                <div className={classes.readmeContainerNoReadmeContents} onClick={this.onClickEditReadme}>
                                    <div className={classes.noReadmeText}>
                                        Click here to add a welcome message and instructions to this repository.
                                    </div>

                                    <AddCircleOutlineIcon className={classes.noReadmeAddIcon} />
                                </div>
                            </div>
                        )}
                    />*/}

                    {this.state.readmeContents === null &&
                        <div className={classes.readmeContainerNoReadme}>
                            <div className={classes.readmeContainerNoReadmeContents} onClick={this.onClickEditReadme}>
                                <div className={classes.noReadmeText}>
                                    Click here to add a welcome message and instructions to this repository.
                                </div>

                                <AddCircleOutlineIcon className={classes.noReadmeAddIcon} />
                            </div>
                        </div>
                    }
                    {this.state.readmeContents !== null &&
                        <Card>
                            <CardContent classes={{ root: classes.readmeContent }}>
                                <RenderMarkdown
                                    uri={{ ...this.props.uri, commit: 'working', filename: 'README.md' }}
                                    text={this.state.readmeContents || ''}
                                    dirname={'.'}
                                />
                            </CardContent>
                        </Card>
                    }
                </div>
                <div className={classes.sidebarComponents}>
                    {this.props.metadata && this.props.metadata.firstVerifiedCommit &&
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

    componentDidMount() {
        this.updateReadmeContents()
    }

    componentDidUpdate(prevProps: Props) {
        if (!isEqual(this.props.uri, prevProps.uri)) {
            this.updateReadmeContents()
        }
    }

    async updateReadmeContents() {
        try {
            const readmeContents = (await getFileContents({ ...this.props.uri, filename: 'README.md', commit: 'working' } as URI)) as string
            this.setState({ readmeContents, firstLoad: false })
        } catch (error) {
            this.setState({ readmeContents: null, firstLoad: false })
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
    metadata?: IRepoMetadata | null
    hasReadme: boolean
    classes: any
}

interface State {
    readmeContents: string|null
    firstLoad: boolean
    hovering: boolean
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
            flexBasis: 'auto',
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
    readmeContent: {
        padding: 48,
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
    buttons: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    buttonsAutoHide: {
        width: 'fit-content',
        position: 'absolute',
        right: 0,
        padding: 4,
        opacity: 0,
        transition: theme.transitions.create('opacity', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    buttonsAutoHideVisible: {
        opacity: 1,
        transition: theme.transitions.create('opacity', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
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
    const metadata = state.repo.metadataByURI[uriStr]
    const hasReadme = (state.repo.filesByURI[uriStr] || {})['README.md'] !== undefined
    return {
        uri,
        sharedUsers,
        metadata,
        hasReadme,
    }
}

const mapDispatchToProps = {}

const RepoHomePageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoHomePage))

export default RepoHomePageContainer
