import React from 'react'
import classnames from 'classnames'
import { Theme, createStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import LinkIcon from '@material-ui/icons/Link'
import { ITimelineEvent } from 'common'
import moment from 'moment'

function SecuredText(props: Props) {
    if (props.lastVerified === undefined || props.firstVerified === undefined) {
        return null
    }
    const { lastVerified, firstVerified, classes } = props
    return(
        <div className={classnames(classes.securedContainer, classes.root)}>
            <div className={classes.iconContainer}>
                <LinkIcon />
            </div>
            <div>
                <Typography>
                    Last updated {moment(props.lastUpdated).format('MMM do YYYY, h:mm a')}
                </Typography>
                <Typography>
                    <span>Current version secured on </span>
                    <a href="#" className={classes.link} onClick={() => props.selectCommit(lastVerified.commit)}>
                        {moment(props.lastVerified.verified).format('MMM do YYYY, h:mm a')}
                    </a>
                </Typography>
                <Typography>
                    <span>First version secured on </span>
                    <a href="#" className={classes.link} onClick={() => props.selectCommit(firstVerified.commit)}>
                        {moment(props.firstVerified.verified).format('MMM do YYYY, h:mm a')}
                    </a>
                </Typography>
            </div>
        </div>
    )
}

interface Props{
    lastUpdated?: number
    lastVerified?: ITimelineEvent
    firstVerified?: ITimelineEvent
    selectCommit: Function
    classes: any
}

const styles = (theme: Theme) => createStyles({
    root: {},
    securedContainer: {
        display: 'flex',
        marginTop: theme.spacing.unit,
    },
    iconContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: theme.spacing.unit,
    },
    link: {
        color: theme.palette.secondary.main,
    },
})

export default withStyles(styles)(SecuredText)