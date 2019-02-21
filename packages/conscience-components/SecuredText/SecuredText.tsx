import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Theme, createStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import LinkIcon from '@material-ui/icons/Link'
import { selectCommit } from '../navigation'
import { fetchUpdatedRefEvents } from '../redux/repo/repoActions'
import { IGlobalState } from '../redux'
import { URI, ITimelineEvent, IUpdatedRefEvent } from 'conscience-lib/common'
import timelineUtils from 'conscience-lib/utils/timeline'
import { uriToString } from 'conscience-lib/utils'
import moment from 'moment'
import isEqual from 'lodash/isEqual'

const DATE_FORMAT = 'MMM Do YYYY, h:mm a'

class SecuredText extends React.Component<Props, State>
{
    state = {
        lastVerified: undefined as ITimelineEvent | undefined,
        firstVerified: undefined as ITimelineEvent | undefined,
        lastUpdated: undefined as ITimelineEvent | undefined,
    }

    componentDidMount() {
        this.props.fetchUpdatedRefEvents({ uri: this.props.uri })
        this.parseCommits()
    }

    componentDidUpdate(prevProps: Props) {
        if (!isEqual(this.props.uri, prevProps.uri)) {
            this.props.fetchUpdatedRefEvents({ uri: this.props.uri })
            this.parseCommits()
        }
    }

    parseCommits() {
        const { commits, commitList, updatedRefEventsByCommit } = this.props
        const { filename, commit } = this.props.uri
        if (commit && !filename) {
            const lastVerified = timelineUtils.getLastVerifiedEventCommit(commitList || [], commits || {}, updatedRefEventsByCommit, commit)
            this.setState({ lastVerified })
            return
        }
        let lastVerified = undefined
        let lastUpdated = undefined
        if (filename) {
            lastVerified = timelineUtils.getLastVerifiedEventFile(commitList || [], commits || {}, updatedRefEventsByCommit, filename)
            lastUpdated = timelineUtils.getLastUpdated(commitList || [], commits || {}, filename)
        } else {
            lastVerified = timelineUtils.getLastVerifiedEvent(commitList || [], commits || {}, updatedRefEventsByCommit)
        }
        const firstVerified = timelineUtils.getFirstVerifiedEvent(commitList || [], commits || {}, updatedRefEventsByCommit, filename)
        this.setState({ lastVerified, firstVerified, lastUpdated })
    }

    selectCommit(commit: string) {
        selectCommit({ ...this.props.uri, commit })
    }

    render() {
        const { lastVerified, firstVerified, lastUpdated } = this.state
        if (firstVerified === undefined &&
            lastVerified === undefined &&
            lastUpdated === undefined) {
            return null
        }
        const { uri, classes } = this.props
        return (
            <div className={classnames(classes.securedContainer, classes.root)}>
                <div className={classes.iconContainer}>
                    <LinkIcon />
                </div>
                <div>
                    {lastUpdated !== undefined &&
                        <Typography>
                            <span>Last updated </span>
                            <a href="#" className={classes.link} onClick={() => this.selectCommit(lastUpdated.commit)}>
                                {moment(lastUpdated.time).format(DATE_FORMAT)}
                            </a>
                        </Typography>
                    }
                    {lastVerified !== undefined &&
                        <Typography>
                            {uri.commit !== undefined &&
                                <span>This commit secured </span>
                            }
                            {uri.commit === undefined &&
                                <span>Last secured </span>
                            }
                            <a href="#" className={classes.link} onClick={() => this.selectCommit(lastVerified.commit)}>
                                {moment(lastVerified.verified).format(DATE_FORMAT)}
                            </a>
                        </Typography>
                    }
                    {firstVerified !== undefined &&
                        <Typography>
                            <span>First secured </span>
                            <a href="#" className={classes.link} onClick={() => this.selectCommit(firstVerified.commit)}>
                                {moment(firstVerified.verified).format(DATE_FORMAT)}
                            </a>
                        </Typography>
                    }
                </div>
            </div>
        )
    }
}

interface State {
    lastVerified: ITimelineEvent | undefined
    firstVerified: ITimelineEvent | undefined
    lastUpdated: ITimelineEvent | undefined
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    uri: URI
    classes?: any
}

interface StateProps {
    commits: { [hash: string]: ITimelineEvent }
    commitList: string[]
    updatedRefEventsByCommit: { [commit: string]: IUpdatedRefEvent }
}

interface DispatchProps {
    fetchUpdatedRefEvents: typeof fetchUpdatedRefEvents
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

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const commitList = state.repo.commitListsByURI[uriToString(ownProps.uri)] || []
    return {
        commits: state.repo.commits || {},
        commitList,
        updatedRefEventsByCommit: state.repo.updatedRefEventsByCommit,
    }
}

const mapDispatchToProps = {
    fetchUpdatedRefEvents
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(SecuredText))
