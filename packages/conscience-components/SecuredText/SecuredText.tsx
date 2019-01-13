import React from 'react'
import classnames from 'classnames'
import { Theme, createStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import LinkIcon from '@material-ui/icons/Link'
import { ITimelineEvent } from 'conscience-lib/common'
import timelineUtils from 'conscience-lib/utils/timeline'
import moment from 'moment'

const DATE_FORMAT = 'MMM Do YYYY, h:mm a'

class SecuredText extends React.Component<Props, State>
{
    state = {
        lastVerified: undefined as ITimelineEvent | undefined,
        firstVerified: undefined as ITimelineEvent | undefined,
        lastUpdated: undefined as ITimelineEvent | undefined,
    }

    componentDidMount() {
        this.parseCommits()
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.commit !== prevProps.commit ||
            this.props.filename !== prevProps.filename ||
            this.props.commitList.length !== prevProps.commitList.length) {
            this.parseCommits()
        }
    }

    parseCommits() {
        const { commit, filename, commitList, commits } = this.props
        if (commit) {
            const lastVerified = timelineUtils.getLastVerifiedEventCommit(commitList || [], commits || {}, commit)
            this.setState({ lastVerified })
            return
        }
        let lastVerified = undefined
        let lastUpdated = undefined
        if (filename) {
            lastVerified = timelineUtils.getLastVerifiedEventFile(commitList || [], commits || {}, filename)
            lastUpdated = timelineUtils.getLastUpdated(commitList || [], commits || {}, filename)
        } else {
            lastVerified = timelineUtils.getLastVerifiedEvent(commitList || [], commits || {})
        }
        const firstVerified = timelineUtils.getFirstVerifiedEvent(commitList || [], commits || {}, filename)
        this.setState({ lastVerified, firstVerified, lastUpdated })
    }

    render() {
        const { lastVerified, firstVerified, lastUpdated } = this.state
        if (firstVerified === undefined &&
            lastVerified === undefined &&
            lastUpdated === undefined) {
            return null
        }
        const { commit, selectCommit, classes } = this.props
        return (
            <div className={classnames(classes.securedContainer, classes.root)}>
                <div className={classes.iconContainer}>
                    <LinkIcon />
                </div>
                <div>
                    {lastUpdated !== undefined &&
                        <Typography>
                            <span>Last updated </span>
                            <a href="#" className={classes.link} onClick={() => selectCommit({ selectedCommit: lastUpdated.commit })}>
                                {moment(lastUpdated.time).format(DATE_FORMAT)}
                            </a>
                        </Typography>
                    }
                    {lastVerified !== undefined &&
                        <Typography>
                            {commit !== undefined &&
                                <span>This commit secured </span>
                            }
                            {commit === undefined &&
                                <span>Last secured </span>
                            }
                            <a href="#" className={classes.link} onClick={() => selectCommit({ selectedCommit: lastVerified.commit })}>
                                {moment(lastVerified.verified).format(DATE_FORMAT)}
                            </a>
                        </Typography>
                    }
                    {firstVerified !== undefined &&
                        <Typography>
                            <span>First secured </span>
                            <a href="#" className={classes.link} onClick={() => selectCommit({ selectedCommit: firstVerified.commit })}>
                                {moment(firstVerified.verified).format(DATE_FORMAT)}
                            </a>
                        </Typography>
                    }
                </div>
            </div>
        )
    }
}

interface Props {
    commits: { [commitHash: string]: ITimelineEvent }
    commitList: string[]
    commit?: string
    filename?: string
    selectCommit: (payload: { selectedCommit: string }) => void
    classes: any
}

interface State {
    lastVerified: ITimelineEvent | undefined
    firstVerified: ITimelineEvent | undefined
    lastUpdated: ITimelineEvent | undefined
}

const styles = (theme: Theme) => createStyles({
    root: {},
    securedContainer: {
        display: 'flex',
        flexShrink: 0,
        alignItems: 'center',
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

