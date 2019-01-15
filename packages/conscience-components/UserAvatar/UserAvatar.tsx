import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { autobind } from 'conscience-lib/utils'
import { IUser } from 'conscience-lib/common'
const IDENTICON_URL = process.env.API_URL + '/identicon/'

@autobind
class UserAvatar extends React.Component<Props>
{
    render() {
        const { user, userPictureSize, seedText = 'default', selectUser, classes } = this.props
        let src
        if (!user) {
            src = IDENTICON_URL + seedText
        } else if (!user.picture) {
            src = IDENTICON_URL + user.userID
        } else {
            src = user.picture[userPictureSize || '128x128']
        }
        const avatar = (
            <Avatar
                classes={this.props.classes}
                className={this.props.className}
                src={src}
            />
        )

        if (selectUser === undefined) {
            return avatar
        } else {
            return (
                <IconButton
                    onClick={this.selectUser}
                    className={classes.iconButton}
                >
                    {avatar}
                </IconButton>
            )
        }
    }

    selectUser() {
        const user = this.props.user
        if (user && user.username && this.props.selectUser) {
            this.props.selectUser({ username: user.username })
        }
    }
}

interface Props {
    user?: IUser
    userPictureSize?: '512x512' | '256x256' | '128x128'
    seedText?: string
    selectUser?: (payload: { username: string }) => void
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
