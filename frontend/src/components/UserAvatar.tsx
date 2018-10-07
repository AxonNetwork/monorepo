import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { strToColor } from 'utils'
import autobind from 'utils/autobind'


@autobind
class UserAvatar extends React.Component<Props>
{
    render() {
        const { username } = this.props
        const userInitials = (username || '').split(' ').map(x => x.substring(0, 1)).map(x => x.toUpperCase()).join('')
        const color = strToColor(username || '')
        return (
            <Avatar className={this.props.className} style={{ backgroundColor: color }}>{userInitials}</Avatar>
        )
    }
}

interface Props {
    username: string | undefined
    className?: string
}

const styles = () => createStyles({
})

export default withStyles(styles)(UserAvatar)
