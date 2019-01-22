import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { autobind } from 'conscience-lib/utils'
import { IUser } from 'conscience-lib/common'
import jdenticon from 'jdenticon'
import { selectUser } from 'conscience-components/navigation'


@autobind
class UserAvatar extends React.Component<Props>
{
    render() {
        const { user, userPictureSize, noTooltip, classes } = this.props
        let seedText = this.props.seedText || "unknown"
        if (user && user.userID) {
            seedText = user.userID
        }
        let avatar
        if (user && user.picture) {
            avatar = (
                <Avatar
                    classes={this.props.classes}
                    className={this.props.className}
                    src={user.picture[userPictureSize || '128x128']}
                />
            )
        } else {
            const svg = jdenticon.toSvg(seedText, 200)
            avatar = (
                <Avatar
                    classes={this.props.classes}
                    className={this.props.className}
                >
                    <div
                        dangerouslySetInnerHTML={{ __html: svg }}
                        className={classes.identicon}
                    />
                </Avatar>
            )
        }
        const name = user !== undefined ? user.name : seedText
        if (!noTooltip) {
            avatar = (
                <Tooltip title={name}>
                    {avatar}
                </Tooltip>
            )

        }

        return (
            <IconButton
                onClick={this.selectUser}
                className={classes.iconButton}
            >
                {avatar}
            </IconButton>
        )
    }

    selectUser() {
        const user = this.props.user
        if (user && user.username) {
            selectUser(user.username)
        }
    }
}

type Props = OwnProps & { classes: any }

interface OwnProps {
    user?: IUser
    userPictureSize?: '512x512' | '256x256' | '128x128'
    seedText?: string
    noTooltip?: boolean
    className?: string
    classes: any
}

const styles = () => createStyles({
    root: {}, // pass-through
    iconButton: {
        padding: 0
    },
    identicon: {
        paddingTop: 5,
        '& svg': {
            width: '100%',
            height: '100%',
        }
    }
})

export default withStyles(styles)(UserAvatar)
