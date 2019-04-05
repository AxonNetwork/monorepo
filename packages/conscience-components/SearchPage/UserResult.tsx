import React from 'react'
import { Link } from 'react-router-dom'
import ContentLoader from 'react-content-loader'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import UserAvatar from 'conscience-components/UserAvatar'
import { getUserURL } from 'conscience-components/navigation'
import { IUser } from 'conscience-lib/common'


class UserResult extends React.Component<Props>
{
    render() {
        const { user, classes } = this.props

        return (
            <Link to={user && user.username ? getUserURL(user.username) : ''} className={classes.userLink}>
                <ListItem button={!!user}>
                    {!user &&
                        <div style={{width: 200, height: 64}}>
                            <UserResultLoader />
                        </div>
                    }
                    {user &&
                        <React.Fragment>
                            <ListItemAvatar>
                                <UserAvatar user={user} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={user.name}
                                secondary={
                                    <React.Fragment>
                                        <div><em>{user.username}</em></div>
                                        <div>{(user.profile || {} as any).university}</div>
                                    </React.Fragment>
                                }
                            />
                        </React.Fragment>
                    }
                </ListItem>
            </Link>
        )
    }
}

const UserResultLoader = () => (
    <ContentLoader
        height={64}
        width={200}
        speed={2}
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
        style={{ width: '100%', height: '100%' }}
    >
        <rect x="70" y="4" rx="4" ry="4" width="148.59" height="6.4" />
        <rect x="70" y="24" rx="3" ry="3" width="107.95" height="6.4" />
        <circle cx="30" cy="30" r="30" />
        <rect x="71" y="43" rx="4" ry="4" width="148.59" height="6.4" />
    </ContentLoader>
)

interface Props {
    user: IUser | undefined
    classes?: any
}

const styles = (theme: Theme) => createStyles({
    userLink: {
        textDecoration: 'none',
    },
})

export default withStyles(styles)(UserResult)
