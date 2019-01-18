import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import classnames from 'classnames'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import SecuredText from './connected/SecuredText'
import FileViewer from './connected/FileViewer'
import Timeline from './connected/Timeline'
import DiscussionList from './connected/DiscussionList'
import UserAvatar from 'conscience-components/UserAvatar'
import { H6 } from 'conscience-components/Typography/Headers'
import { IGlobalState } from 'redux/store'
import { IRepo, IUser } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import { union } from 'lodash'


@autobind class RepoHomePage extends React.Component<Props>
{
    render() {
        const { repo, sharedUsers, classes } = this.props
        const repoHash = this.props.match.params.repoHash

        const readmeExists = (repo.files || {})['README.md']

        return (
            <div className={classes.main}>
                <div className={classnames(classes.readmeContainer, { [classes.readmeContainerNoReadme]: !readmeExists })}>
                    {readmeExists &&
                        <div>
                            <FileViewer
                                repoHash={repoHash}
                                filename={'README.md'}
                                showViewerPicker={false}
                            />
                            <IconButton
                                onClick={this.onClickEditReadme}
                                className={classes.editReadmeButton}
                            >
                                <EditIcon />
                            </IconButton>
                        </div>
                    }
                    {!readmeExists &&
                        <div className={classes.readmeContainerNoReadmeContents} onClick={this.onClickEditReadme}>
                            <Typography className={classes.noReadmeText}>
                                Add a welcome message and instructions to this repository using the Conscience Desktop App.
                            </Typography>

                            <AddCircleOutlineIcon className={classes.noReadmeAddIcon} />
                        </div>
                    }
                </div>
                <div className={classes.sidebarComponents}>
                    {(repo.commitList || []).length > 0 &&
                        <Card className={classes.card}>
                            <CardContent classes={{ root: classes.securedTextCard }}>
                                <SecuredText
                                    repoHash={repoHash}
                                    history={this.props.history}
                                />
                            </CardContent>
                        </Card>
                    }

                    <Card className={classes.card}>
                        <CardContent>
                            <H6>Team</H6>

                            <div className={classes.sharedUsersRow}>
                                {sharedUsers.map((user: IUser | undefined) => {
                                    if (user !== undefined) {
                                        return (
                                            <UserAvatar user={user} selectUser={this.navigateUserPage} />
                                        )
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
                                repoHash={repoHash}
                                repoID={repo.repoID}
                                history={this.props.history}
                                maxLength={2}
                            />
                        </CardContent>
                    </Card>
                    <Card className={classes.card}>
                        <CardContent>
                            <H6>Recent Commits</H6>

                            <Timeline
                                repoHash={repoHash}
                                history={this.props.history}
                                defaultRowsPerPage={2}
                                hidePagination
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    navigateUserPage(payload: { username: string }) {
        const username = payload.username
        this.props.history.push(`/user/${username}`)
    }

    onClickEditReadme() {
        const repoHash = this.props.match.params.repoHash
        this.props.history.push(`/repo/${repoHash}/edit/README.md`)
    }
}

interface MatchParams {
    repoHash: string
}

interface Props extends RouteComponentProps<MatchParams> {
    repo: IRepo
    sharedUsers: IUser[]
    classes: any
}

const styles = (theme: Theme) => createStyles({
    main: {
        display: 'flex',
    },
    readmeContainer: {
        position: 'relative',
        flexGrow: 1,
        flexBasis: 640,
        marginRight: 16,
        minWidth: 0,
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
    const repoRoot = state.repo.reposByHash[ownProps.match.params.repoHash]
    const repo = state.repo.repos[repoRoot]
    const { admins = [], pushers = [], pullers = [] } = state.repo.repoPermissions[repo.repoID] || {}
    const sharedUsers = union(admins, pushers, pullers)
        .map(username => state.user.usersByUsername[username])
        .map(id => state.user.users[id])
    return {
        repo,
        sharedUsers,
    }
}

const mapDispatchToProps = {}

const RepoHomePageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoHomePage))

export default RepoHomePageContainer
