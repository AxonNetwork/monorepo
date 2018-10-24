import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Theme, createStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import LinkIcon from '@material-ui/icons/Link'
import { ITimelineEvent } from 'common'
import moment from 'moment'
import { selectCommit } from 'redux/repository/repoActions'
import { IGlobalState } from 'redux/store'
import timelineUtils from 'utils/timeline'

const DATE_FORMAT = 'MMM Do YYYY, h:mm a'

function SecuredText(props: Props) {
    if (props.firstVerified === undefined && props.lastVerified === undefined) {
        return null
    }
    const { lastVerified, firstVerified, lastUpdated, selectCommit, commit, classes } = props
    return (
        <div className={classnames(classes.securedContainer, classes.root)}>
            <div className={classes.iconContainer}>
                <LinkIcon />
            </div>
            <div>
                {lastUpdated &&
                    <Typography>
                        Last updated {moment(lastUpdated).format(DATE_FORMAT)}
                    </Typography>
                }
                {lastVerified &&
                    <Typography>
                        {commit !== undefined &&
                            <span>This commit secured on </span>
                        }
                        {commit === undefined &&
                            <span>Current version secured on </span>
                        }
                        <a href="#" className={classes.link} onClick={() => selectCommit({ selectedCommit: lastVerified.commit })}>
                            {moment(lastVerified.verified).format(DATE_FORMAT)}
                        </a>
                    </Typography>
                }
                {firstVerified &&
                    <Typography>
                        <span>First version secured on </span>
                        <a href="#" className={classes.link} onClick={() => selectCommit({ selectedCommit: firstVerified.commit })}>
                            {moment(firstVerified.verified).format(DATE_FORMAT)}
                        </a>
                    </Typography>
                }
            </div>
        </div>
    )
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    commit?: string
    file?: string
}

interface StateProps {
    lastUpdated?: Date
    lastVerified?: ITimelineEvent
    firstVerified?: ITimelineEvent
}

interface DispatchProps {
    selectCommit: typeof selectCommit
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

const mapStateToProps = (state: IGlobalState, props: OwnProps) => {
    const selectedRepo = state.repository.selectedRepo || ""
    const repo = state.repository.repos[selectedRepo]
    if(repo === undefined){
        return {}
    }
    if(props.commit){
        const lastVerified = timelineUtils.getLastVerifiedEventCommit(repo.commitList ||[], repo.commits || {}, props.commit)
        return {
            lastVerified
        }
    }
    const filename = props.file
    let lastVerified = undefined
    if(filename){
        lastVerified = timelineUtils.getLastVerifiedEventFile(repo.commitList || [], repo.commits || {}, filename)
    }else{
        lastVerified = timelineUtils.getLastVerifiedEvent(repo.commitList || [], repo.commits || {})
    }
    const firstVerified = timelineUtils.getFirstVerifiedEvent(repo.commitList || [], repo.commits || {}, filename)
    return {
        lastVerified,
        firstVerified,
    }
}

const mapDispatchToProps = {
    selectCommit,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(SecuredText))

