import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { IUser } from 'conscience-lib/common'
const IDENTICON_URL = process.env.API_URL + '/identicon/'

function UserImage(props: Props) {
    const { user, userPictureSize, classes } = props
    let src
    if (!user) {
        src = IDENTICON_URL + "unknown"
    } else if (!user.picture) {
        src = IDENTICON_URL + user.userID
    } else {
        src = user.picture[userPictureSize || '128x128']
    }
    return <img src={src} className={classes.root} />
}

interface Props {
    user?: IUser
    userPictureSize?: '512x512' | '256x256' | '128x128'
    classes: any
}


const styles = (theme: Theme) => createStyles({
    root: {} // pass-through
})

export default withStyles(styles)(UserImage)
