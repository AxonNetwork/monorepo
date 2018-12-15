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
    state={
        lastVerified: undefined,
        firstVerified: undefined,
    }

    componentDidMount(){
        this.parseCommits()
    }

    componentDidUpdate(prevProps: Props) {
        if(this.props.commit !== prevProps.commit ||
           this.props.filename !== prevProps.filename ||
           this.props.commitList.length !== prevProps.commitList.length){
            this.parseCommits()
        }
    }

    parseCommits(){
        const { commit, filename, commitList, commits } = this.props
        if(commit){
            const lastVerified = timelineUtils.getLastVerifiedEventCommit(commitList ||[], commits || {}, commit)
            this.setState({ lastVerified })
            return
        }
        let lastVerified = undefined
        if(filename){
            lastVerified = timelineUtils.getLastVerifiedEventFile(commitList || [], commits || {}, filename)
        }else{
            lastVerified = timelineUtils.getLastVerifiedEvent(commitList || [], commits || {})
        }
        const firstVerified = timelineUtils.getFirstVerifiedEvent(commitList || [], commits || {}, filename)
        this.setState({ lastVerified, firstVerified })
    }

    render() {
        const { lastVerified, firstVerified } = this.state
        if (firstVerified === undefined && lastVerified === undefined) {
            return null
        }
        const { commit, lastUpdated, selectCommit, classes } = this.props
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
                    {lastVerified !== undefined &&
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
                    {firstVerified !== undefined &&
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
}

interface Props {
    commits: {[commitHash: string]: ITimelineEvent}
    commitList: string[]
    commit?: string
    filename?: string
    lastUpdated?: Date
    selectCommit: (payload: { selectedCommit: string }) => void
    classes: any
}

interface State {
    lastVerified: ITimelineEvent | undefined
    firstVerified: ITimelineEvent | undefined
}

const styles = (theme: Theme) => createStyles({
    root: {},
    securedContainer: {
        display: 'flex',
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

