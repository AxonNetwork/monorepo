import React from 'react'
import { connect } from 'react-redux'
import { Theme, withStyles, createStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import UserAvatar from 'components/UserAvatar'
import { IGlobalState } from 'redux/store'
import { IOrganization, IUser } from 'common'

class OrganizationPage extends React.Component<Props>
{
    render(){
        const { org, classes } = this.props
        console.log(org)
        return(
            <div>
                <Typography variant="headline">{org.name}</Typography>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Members</Typography>
                        <div>
                            {(org.members || []).map(userID => {
                                const user = this.props.users[userID] || {}
                                return (
                                    <div className={classes.user}>
                                        <div className={classes.userAvatar}>
                                            <UserAvatar username={user.name} userPicture={user.picture} />
                                        </div>
                                        <div className={classes.userInfo}>
                                            <Typography><strong>{user.name}</strong></Typography>
                                            <Typography>{user.username}</Typography>
                                            {user.userID === org.creator &&
                                                <Typography><em>Creator</em></Typography>
                                            }
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

interface Props {
    org: IOrganization
    users: {[userID: string]: IUser}
    classes: any
}

const styles = (theme: Theme) => createStyles({
    user: {
        display: 'flex',
        marginBottom: theme.spacing.unit*2
    },
    userAvatar : {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: theme.spacing.unit,
    },
    userInfo: {
        flexGrow: 1
    }
})

const mapStateToProps = (state: IGlobalState) => {
    const selectedOrg = state.org.selectedOrg || ""
    const org = state.org.orgs[selectedOrg]
    const users = state.user.users
    return {
        org,
        users,
    }
}

const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(OrganizationPage))