import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Members from '../Members'
import { addMemberToOrg, removeMemberFromOrg } from 'conscience-components/redux/org/orgActions'
import { IUserState } from 'conscience-components/redux/user/userReducer'
import { IOrgState } from 'conscience-components/redux/org/orgReducer'
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

const mapStateToProps = (state: { user: IUserState, org: IOrgState }, ownProps: OwnProps) => {
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

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(ConnectedMembers))
