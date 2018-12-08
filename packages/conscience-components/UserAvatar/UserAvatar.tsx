import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { autobind, strToColor } from 'conscience-lib/utils'


@autobind
class UserAvatar extends React.Component<Props>
{
    render() {
        const { username, userPicture } = this.props
        if (!userPicture) {
            const userInitials = (username || '').split(' ').map(x => x.substring(0, 1)).map(x => x.toUpperCase()).join('')
            const color = strToColor(username || '')
            return (
                <Avatar className={this.props.className} style={{ backgroundColor: color }}>{userInitials}</Avatar>
            )
        } else {
            return (
                <Avatar className={this.props.className} src={userPicture} />
            )
        }
    }
}

interface Props {
    username: string | undefined
    userPicture: string | undefined
    className?: string
}

const styles = () => createStyles({
})

export default withStyles(styles)(UserAvatar)
