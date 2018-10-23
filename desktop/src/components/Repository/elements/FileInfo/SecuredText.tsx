import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Theme, createStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import LinkIcon from '@material-ui/icons/Link'
import { ITimelineEvent } from 'common'
import moment from 'moment'
import { selectCommit } from 'redux/repository/repoActions'

function SecuredText(props: Props) {
    if (props.lastVerified === undefined || props.firstVerified === undefined) {
        return null
    }
    const { lastVerified, firstVerified, lastUpdated, selectCommit, classes } = props
    return (
        <div className={classnames(classes.securedContainer, classes.root)}>
            <div className={classes.iconContainer}>
                <LinkIcon />
            </div>
            <div>
                <Typography>
                    Last updated {moment(lastUpdated).format('MMM do YYYY, h:mm a')}
                </Typography>
                <Typography>
                    <span>Current version secured on </span>
                    <a href="#" className={classes.link} onClick={() => selectCommit({ selectedCommit: lastVerified.commit })}>
                        {moment(lastVerified.verified).format('MMM do YYYY, h:mm a')}
                    </a>
                </Typography>
                <Typography>
                    <span>First version secured on </span>
                    <a href="#" className={classes.link} onClick={() => selectCommit({ selectedCommit: firstVerified.commit })}>
                        {moment(firstVerified.verified).format('MMM do YYYY, h:mm a')}
                    </a>
                </Typography>
            </div>
        </div>
    )
}

interface Props{
    lastUpdated?: Date
    lastVerified?: ITimelineEvent
    firstVerified?: ITimelineEvent
    selectCommit: typeof selectCommit
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

const mapDispatchToProps = {
    selectCommit,
}

export default connect(
    null,
    mapDispatchToProps,
)(withStyles(styles)(SecuredText))

