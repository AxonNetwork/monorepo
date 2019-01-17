import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import CircularProgress from '@material-ui/core/CircularProgress'
import Avatar from '@material-ui/core/Avatar'
import UserProfile from 'conscience-components/UserProfile'
import UserImage from 'conscience-components/UserImage'
import RepositoryCards from 'conscience-components/RepositoryCards'
import { H5, H6 } from 'conscience-components/Typography/Headers'
import { getRepoList } from 'conscience-components/redux/repo/repoActions'
import { updateUserProfile } from 'conscience-components/redux/user/userActions'
import { IGlobalState } from 'redux/store'
import { IRepo, IUser, IOrganization, IDiscussion, RepoPage } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class UserPage extends React.Component<Props>
{
    render() {
        const { user, orgs, classes } = this.props
        if (user === undefined) {
            return (
                <div className={classes.progressContainer}>
                    <CircularProgress color="secondary" />
                </div>
            )
        }

        return (
            <div className={classes.container}>
                <main className={classes.main}>
                    <div className={classes.profileSidebar}>
                        <UserImage
                            user={user}
                            userPictureSize="512x512"
                            classes={{ root: classes.userPic }}
                        />
                        <div className={classes.userDetails}>
                            <H5 className={classes.userRealName}>{user.name}</H5>
                            <div className={classes.userUserName}>{user.username}</div>
                        </div>
                        <UserProfile
                            user={user}
                            currentUser={this.props.currentUser}
                            updateUserProfile={this.props.updateUserProfile}
                        />

                        <Divider />

                        <div className={classes.orgs}>
                            <H6>Organizations</H6>

                            {user.orgs.map(orgID => {
                                const org = orgs[orgID]
                                if (org === undefined) {
                                    return null
                                }
                                return (
                                    <IconButton
                                        onClick={() => this.navigateOrgPage(orgID)}
                                        classes={{ root: classes.orgIcon }}
                                        key={orgID}
                                    >
                                        {orgs[orgID].picture !== undefined &&
                                            <Avatar src={orgs[orgID].picture['128x128']} />
                                        }
                                        {orgs[orgID].picture === undefined &&
                                            <Avatar>{orgs[orgID].name}</Avatar>
                                        }
                                    </IconButton>
                                )
                            })}
                        </div>
                    </div>
                    <div className={classes.repoCards}>
                        <div>
                            <H6>Repositories</H6>

                            <Divider className={classes.repoDivider} />

                            <RepositoryCards
                                repoList={this.props.repoList}
                                repos={this.props.repos}
                                discussions={this.props.discussions}
                                discussionsByRepo={this.props.discussionsByRepo}
                                selectRepoAndPage={this.selectRepoAndPage}
                            />
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    componentDidUpdate(prevProps: Props) {
        const username = this.props.match.params.username
        if (username !== prevProps.match.params.username) {
            this.props.getRepoList({ username })
        }
    }

    componentWillMount() {
        const username = this.props.match.params.username
        this.props.getRepoList({ username })
    }

    navigateOrgPage(orgID: string) {
        this.props.history.push(`/org/${orgID}`)
    }

    selectRepoAndPage(payload: { repoID?: string, repoRoot?: string | undefined, repoPage: RepoPage }) {
        const repoID = payload.repoID
        switch (payload.repoPage) {
            case RepoPage.Home:
                this.props.history.push(`/repo/${repoID}`)
                return
            case RepoPage.Files:
                this.props.history.push(`/repo/${repoID}/files`)
                return
            case RepoPage.Discussion:
                this.props.history.push(`/repo/${repoID}/discussion`)
                return
        }
    }
}

interface MatchParams {
    username: string
}

interface Props extends RouteComponentProps<MatchParams> {
    repoList: string[] | undefined
    repos: { [repoID: string]: IRepo }
    user: IUser
    currentUser: string
    orgs: { [orgID: string]: IOrganization }
    discussions: { [discussionID: string]: IDiscussion }
    discussionsByRepo: { [repoID: string]: string[] }
    getRepoList: typeof getRepoList
    updateUserProfile: typeof updateUserProfile
    classes: any
}

const styles = (theme: Theme) => createStyles({
    container: {
        display: 'flex',
        justifyContent: 'center',
    },
    main: {
        width: 1024,
        marginTop: 32,
        display: 'flex',
        flexDirection: 'row',
    },
    progressContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 256,
    },
    profileSidebar: {
        marginRight: 32,
        width: 280,
        flexShrink: 0,
    },
    repoCards: {
        flexGrow: 1,
    },
    userPic: {
        width: '100%',
        borderRadius: 8,
    },
    userDetails: {
        marginTop: 8,
        marginBottom: 8,
    },
    userRealName: {
        fontWeight: 'bold',
    },
    userUserName: {
        fontStyle: 'italic',
    },
    orgs: {
        marginTop: 8,
    },
    orgIcon: {
        padding: 4,
    },
    repoDivider: {
        marginTop: 8,
        marginBottom: 16,
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: RouteComponentProps<MatchParams>) => {
    const username = ownProps.match.params.username
    const selectedUserID = state.user.usersByUsername[username]
    const user = state.user.users[selectedUserID]
    const repoList = state.repo.repoListByUser[username]
    return {
        repoList: repoList,
        repos: state.repo.repos,
        user,
        currentUser: state.user.currentUser || '',
        orgs: state.org.orgs,
        discussions: state.discussion.discussions,
        discussionsByRepo: state.discussion.discussionsByRepo,
    }
}

const mapDispatchToProps = {
    getRepoList,
    updateUserProfile,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(UserPage))
