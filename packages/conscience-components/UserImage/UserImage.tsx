import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { IUser } from 'conscience-lib/common'
import jdenticon from 'jdenticon'
jdenticon.config = { backColor: '#fafafaff' }

function UserImage(props: Props) {
    const { user, userPictureSize, classes } = props
    if (user && user.picture) {
        return (
            <img
                src={user.picture[userPictureSize || '128x128']}
                className={classes.root}
            />
        )
    }
    let seed = "unknown"
    if (user && user.userID) {
        seed = user.userID
    }
    const svg = jdenticon.toSvg(seed, 200)
    return (
        <div
            dangerouslySetInnerHTML={{ __html: svg }}
            className={classes.root}
        />
    )
}

interface Props {
    user?: IUser
    userPictureSize?: '512x512' | '256x256' | '128x128'
    classes: any
}


const styles = (theme: Theme) => createStyles({
    root: {
        "& svg": {
            width: '100%',
            height: '100%',
        }
    }
})

export default withStyles(styles)(UserImage)
