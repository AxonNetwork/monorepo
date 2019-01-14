import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { autobind, strToColor } from 'conscience-lib/utils'
import { IUser } from 'conscience-lib/common'


@autobind
class UserAvatar extends React.Component<Props>
{
    render() {
        const { username, userPicture, onClick, classes } = this.props
        let avatar
        if (!userPicture) {
            const userInitials = (username || '').split(' ').map(x => x.substring(0, 1)).map(x => x.toUpperCase()).join('')
            const color = strToColor(username || '')
            avatar = (
                <Avatar
                    classes={this.props.classes}
                    className={this.props.className}
                    style={{ backgroundColor: color }}
                >
                    {userInitials}
                </Avatar>
            )
        } else {
            avatar = (
                <Avatar
                    classes={this.props.classes}
                    className={this.props.className}
                    src={userPicture[this.props.userPictureSize || '128x128']}
                />
            )
        }

        if (onClick === undefined) {
            return avatar
        } else {
            return (
                <IconButton
                    onClick={onClick}
                    className={classes.iconButton}
                >
                    {avatar}
                </IconButton>
            )
        }
    }
}

interface Props {
    username: string | undefined
    userPicture: IUser['picture'] | undefined
    userPictureSize?: '512x512' | '256x256' | '128x128'
    onClick?: () => void
    className?: string
    classes: any
}

const styles = () => createStyles({
    root: {}, // pass-through
    iconButton: {
        padding: 0
    }
})

export default withStyles(styles)(UserAvatar)
