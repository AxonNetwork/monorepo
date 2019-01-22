import React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import classnames from 'classnames'
import { Theme, createStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import LinkIcon from '@material-ui/icons/Link'
import { IRepoState } from 'conscience-components/redux/repo/repoReducer'
import { selectCommit } from 'conscience-components/navigation'
import { URI, URIType, IRepo, ITimelineEvent } from 'conscience-lib/common'
import timelineUtils from 'conscience-lib/utils/timeline'
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
        this.parseCommits()
    }

    componentDidUpdate(prevProps: Props) {
        if (!isEqual(this.props.uri, prevProps.uri)) {
            this.parseCommits()
        }
    }

    parseCommits() {
        const { uri, commitList, commits } = this.props
        const { filename, commit } = uri
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

    selectCommit(commit: string) {
        const uri = {
            ...this.props.uri,
            commit
        }
        selectCommit(this.props.history, uri)
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

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps extends RouteComponentProps<{}> {
    uri: URI
}

interface StateProps {
    commits: { [commitHash: string]: ITimelineEvent }
    commitList: string[]
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

type IPartialState = { repo: IRepoState }

const mapStateToProps = (state: IPartialState, ownProps: OwnProps) => {
    let repo = undefined as IRepo | undefined
    if (ownProps.uri.type === URIType.Local) {
        repo = state.repo.repos[ownProps.uri.repoRoot]
    } else if (ownProps.uri.type === URIType.Network) {
        repo = state.repo.repos[ownProps.uri.repoID]
    }

    return {
        commits: (repo || { commits: {} }).commits || {},
        commitList: (repo || { commitList: [] }).commitList || [],
    }
}

const mapDispatchToProps = {}

export default withRouter(connect<StateProps, {}, OwnProps, IPartialState>(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(SecuredText)))

