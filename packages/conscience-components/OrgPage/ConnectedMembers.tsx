import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Members from '../Members'
import { addMemberToOrg, removeMemberFromOrg } from 'conscience-components/redux/org/orgActions'
import { IUser, IOrganization } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class ConnectedMembers extends React.Component<Props>
{
    render() {
        const { org } = this.props
        if (org === undefined) { return null }
        return (
            <Members
                userList={org.members}
                adminList={[org.creator]}
                users={this.props.users}
                currentUser={this.props.currentUser}
                addMember={this.addMember}
                removeMember={this.removeMember}
                selectUser={this.props.selectUser}
            />
        )
    }


    addMember(payload: { email: string }) {
        const email = payload.email
        const orgID = this.props.orgID
        this.props.addMemberToOrg({ email, orgID })
    }

    removeMember(payload: { userID: string }) {
        const userID = payload.userID
        const orgID = this.props.orgID
        this.props.removeMemberFromOrg({ userID, orgID })
    }
}

type Props = OwnProps & StateProps & DispatchProps

interface OwnProps {
    orgID: string
    selectUser: (payload: { username: string }) => void
}

interface StateProps {
    org: IOrganization | undefined
    users: { [userID: string]: IUser }
    currentUser: string
}

interface DispatchProps {
    addMemberToOrg: typeof addMemberToOrg
    removeMemberFromOrg: typeof removeMemberFromOrg
}

const styles = (theme: Theme) => createStyles({})

interface IPartialState {
    org: {
        orgs: { [orgID: string]: IOrganization }
    },
    user: {
        users: { [userID: string]: IUser }
        currentUser: string
    }
}

const mapStateToProps = (state: IPartialState, ownProps: OwnProps) => {
    return {
        org: state.org.orgs[ownProps.orgID],
        users: state.user.users,
        currentUser: state.user.currentUser || '',
    }
}

const mapDispatchToProps = {
    addMemberToOrg,
    removeMemberFromOrg
}

export default connect<StateProps, DispatchProps, OwnProps, IPartialState>(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(ConnectedMembers))
