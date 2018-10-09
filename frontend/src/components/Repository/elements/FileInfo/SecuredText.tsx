import React from 'react'
import { Theme, createStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import LinkIcon from '@material-ui/icons/Link'
import { ITimelineEvent } from 'common'
import moment from 'moment'

function SecuredText(props: Props){
    if(props.lastVerified === undefined || props.firstVerified === undefined){
        return null
    }
    const { lastVerified, firstVerified, classes } = props.classes
    return(
        <div className={classes.securedContainer}>
            <div className={classes.iconContainer}>
                <LinkIcon />
            </div>
            <div>
                <Typography>
                        <a href="#" className={classes.link} onClick={()=>props.selectCommit(lastVerified.commit)}>
                            Blockchain secured
                        </a>
                        <span>
                            {" as of " + moment(props.lastVerified.verified).format("MMM do YYYY, h:mm a")}
                        </span>
                </Typography>
                <Typography>
                    <a href="#" className={classes.link} onClick={()=>props.selectCommit(firstVerified.commit)}>
                        Initially secured
                    </a>
                    <span>
                        {" as of " + moment(props.firstVerified.verified).format("MMM do YYYY, h:mm a")}
                    </span>
                </Typography>
            </div>
        </div>
    )
}

interface Props{
    lastVerified?: ITimelineEvent
    firstVerified?: ITimelineEvent
    selectCommit: Function
    classes: any
}

const styles = (theme: Theme) => createStyles({
    securedContainer:{
        display: 'flex',
        marginTop: theme.spacing.unit,
    },
    iconContainer:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: theme.spacing.unit
    },
    link:{
        color: theme.palette.secondary.main
    }
})

export default withStyles(styles)(SecuredText)