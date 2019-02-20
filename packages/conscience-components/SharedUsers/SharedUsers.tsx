import React from 'react'
import { connect } from 'react-redux'
import UserAvatar from '../UserAvatar'
import { fetchRepoUsersPermissions } from '../redux/repo/repoActions'
import { IGlobalState } from '../redux'
import { getRepoID } from 'conscience-components/env-specific'
import { IUser, IRepoPermissions, URI } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import union from 'lodash/union'
import isEqual from 'lodash/isEqual'


@autobind
class SharedUsers extends React.Component<Props>
{

    componentDidMount() {
        this.props.fetchRepoUsersPermissions({ uri: this.props.uri })
    }

    componentDidUpdate(prevProps: Props) {
        if (!isEqual(prevProps.uri, this.props.uri)) {
            this.props.fetchRepoUsersPermissions({ uri: this.props.uri })
        }
    }

    render() {
        const { permissions, users, usersByUsername } = this.props
        const { admins = [], pushers = [], pullers = [] } = permissions || {}
        const sharedUsers = union(admins, pushers, pullers)
            .map(username => usersByUsername[username])
            .map(id => users[id])
        return (
            <React.Fragment>
                {sharedUsers.map(user => {
                    if (user !== undefined) {
                        return <UserAvatar user={user} />
                    } else {
                        return null
                    }
                })}
            </React.Fragment>
        )
    }
}

type Props = OwnProps & StateProps & DispatchProps

interface OwnProps {
    uri: URI
}

interface StateProps {
    permissions: IRepoPermissions | undefined
    users: { [userID: string]: IUser }
    usersByUsername: { [username: string]: string }
}

interface DispatchProps {
    fetchRepoUsersPermissions: typeof fetchRepoUsersPermissions
}

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const repoID = getRepoID(ownProps.uri)
    return {
        permissions: state.repo.permissionsByID[repoID],
        users: state.user.users,
        usersByUsername: state.user.usersByUsername,
    }

}

const mapDispatchToProps = {
    fetchRepoUsersPermissions,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SharedUsers)
