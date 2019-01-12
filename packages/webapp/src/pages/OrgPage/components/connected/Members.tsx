import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Members from 'conscience-components/Members'
import { IGlobalState } from 'redux/store'
import { IUser } from 'conscience-lib/common'


class ConnectedMembers extends React.Component<Props>
{
    render() {
        return (
            <Members
                userList={this.props.userList}
                adminList={this.props.adminList}
                users={this.props.users}
                currentUser={this.props.currentUser}
                addMember={this.props.addMember}
                removeMember={this.props.removeMember}
            />
        )
    }
}

type Props = OwnProps & StateProps

interface OwnProps {
    userList: string[]
    adminList?: string[]
    addMember: (payload: { email: string }) => void
    removeMember: (payload: { userID: string }) => void
}

interface StateProps {
    users: { [userID: string]: IUser }
    currentUser: string
}

const styles = (theme: Theme) => createStyles({
    progressContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 256,
    },
})

const mapStateToProps = (state: IGlobalState) => {
    return {
        users: state.user.users,
        currentUser: state.user.currentUser || '',
    }
}

const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(ConnectedMembers))
