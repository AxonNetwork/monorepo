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
import { fetchUserDataByUsername } from 'conscience-components/redux/user/userActions'
import { IGlobalState } from 'conscience-components/redux'
import { selectOrg } from 'conscience-components/navigation'
import { IUser, IOrganization, URI, URIType } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import isEqual from 'lodash/isEqual'


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

        const repoURIList = (this.props.repoList || []).map(repoID => ({ type: URIType.Network, repoID } as URI))

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
                        <UserProfile user={user} />

                        <Divider />

                        <div className={classes.orgs}>
                            <H6>Organizations</H6>

                            {(user.orgs || []).map(orgID => {
                                const org = orgs[orgID]
                                if (org === undefined) {
                                    return null
                                }
                                return (
                                    <IconButton
                                        onClick={() => selectOrg(orgID)}
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

                            <RepositoryCards repoList={repoURIList} />
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.match.params.username !== prevProps.match.params.username) {
            const username = this.props.match.params.username
            this.props.fetchUserDataByUsername({ usernames: [username] })
        }
        if (this.props.user && !isEqual(this.props.user, prevProps.user)) {
            const userID = this.props.user.userID
            this.props.getRepoList({ userID })
        }
    }

    componentWillMount() {
        const username = this.props.match.params.username || ''
        this.props.fetchUserDataByUsername({ usernames: [username] })
        if (this.props.user) {
            const userID = this.props.user.userID
            this.props.getRepoList({ userID })
        }
    }
}

type Props = OwnProps & DispatchProps & RouteComponentProps<MatchParams> & { classes: any }

interface OwnProps {
    repoList: string[] | undefined
    user: IUser | undefined
    orgs: { [orgID: string]: IOrganization }
}

interface DispatchProps {
    getRepoList: typeof getRepoList
    fetchUserDataByUsername: typeof fetchUserDataByUsername
}

interface MatchParams {
    username: string
}


const styles = (theme: Theme) => createStyles({
    container: {
        display: 'flex',
        justifyContent: 'center',
    },
    main: {
        // width: 1024,
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
    const selectedUserID = state.user.usersByUsername[username] || ''
    const user = state.user.users[selectedUserID]
    const repoList = state.repo.repoListByUserID[selectedUserID]
    return {
        repoList: repoList,
        user,
        orgs: state.org.orgs,
    }
}

const mapDispatchToProps = {
    getRepoList,
    fetchUserDataByUsername,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(UserPage))
