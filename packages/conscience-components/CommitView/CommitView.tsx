import * as parseDiff from 'parse-diff'
import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import LinkIcon from '@material-ui/icons/Link'
import LargeProgressSpinner from 'conscience-components/LargeProgressSpinner'
import DiffViewer from '../DiffViewer'
import UserAvatar from '../UserAvatar'
import SecuredText from '../SecuredText'
import { URI, ITimelineEvent, IUser } from 'conscience-lib/common'
import { autobind, extractEmail } from 'conscience-lib/utils'
import { selectCommit } from 'conscience-components/navigation'
import { IGlobalState } from 'conscience-components/redux'
import { fetchRepoTimelineEvent, getDiff } from 'conscience-components/redux/repo/repoActions'
import isEqual from 'lodash/isEqual'


@autobind
class CommitView extends React.Component<Props>
{
    _didFetchDiff = false

    componentDidMount() {
        if (!this.props.commit) {
            this.props.fetchRepoTimelineEvent({ uri: this.props.uri })
        }
        if (this.props.fileDiffs === undefined && !this._didFetchDiff) {
            this._didFetchDiff = true
            console.log('dispatching getDiff 1')
            this.props.getDiff({
                uri: this.props.uri,
                commit: this.props.uri.commit || '',
            })
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (!isEqual(prevProps.uri, this.props.uri)) {
            this.props.fetchRepoTimelineEvent({ uri: this.props.uri })
        }
        if (this.props.fileDiffs === undefined && !this._didFetchDiff) {
            this._didFetchDiff = true
            console.log('dispatching getDiff 2')
            this.props.getDiff({
                uri: this.props.uri,
                commit: this.props.uri.commit || '',
            })
        }
    }

    onClickBack() {
        selectCommit({ ...this.props.uri, commit: undefined })
    }

    render() {
        const { commit, classes } = this.props
        if (!commit) {
            return <LargeProgressSpinner />
        }

        return (
            <div className={classes.root}>
                <div className={classes.commitHeader}>
                    <div className={classes.commitInfoContainer}>
                        <Typography>
                            Location: <span className={classes.breadcrumbRoot} onClick={this.onClickBack}>History</span> / <code className={classes.titleCommitHash}>{(commit.commit || '').substring(0, 8)}</code>
                        </Typography>
                        <Typography variant="headline">
                            {/*Revision <code className={classes.titleCommitHash}>{(commit.commit || '').substring(0, 8)}</code>*/}
                            {commit.message}
                        </Typography>
                        <div className={classes.commitInfo}>
                            {commit.verified !== undefined &&
                                <div className={classes.linkIconContainer}>
                                    <LinkIcon classes={{ root: classes.linkIcon }} />
                                </div>
                            }
                            <UserAvatar user={this.props.user} className={classes.userAvatar} />
                            <div>
                                <Typography>{commit.user}</Typography>
                                <Typography>{moment(commit.time).calendar()}</Typography>
                            </div>
                        </div>
                    </div>
                    <div>
                        <SecuredText uri={this.props.uri} />
                    </div>
                </div>

                {!this.props.fileDiffs &&
                    <LargeProgressSpinner />
                }
                {this.props.fileDiffs && this.props.fileDiffs.map(fileDiff => (
                    <DiffViewer
                        key={(fileDiff.from || '') + (fileDiff.to || '')}
                        uri={{ ...this.props.uri, filename: fileDiff.to }}
                        fileDiff={fileDiff}
                    />
                ))}
            </div>
        )
    }
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    uri: URI
}

interface StateProps {
    user: IUser | undefined
    commit: ITimelineEvent | undefined
    fileDiffs: parseDiff.File[]
}

interface DispatchProps {
    fetchRepoTimelineEvent: typeof fetchRepoTimelineEvent
    getDiff: typeof getDiff
}

const styles = (theme: Theme) => createStyles({
    root: {
        marginTop: 16,
    },
    commitHeader: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    commitInfoContainer: {
        flexGrow: 1
    },
    securedText: {
        textAlign: 'right'
    },
    file: {
        padding: '30px 12px',
    },
    linkIcon: {
        fontSize: 16,
    },
    linkIconContainer: {
        position: 'absolute',
        top: 0,
        left: 26,
        borderRadius: '50%',
        width: 16,
        height: 16,
        backgroundColor: theme.palette.secondary.main,
        color: 'white',
    },
    breadcrumbRoot: {
        color: '#fd6314', //theme.palette.secondary.main,
        textDecoration: 'underline',
        cursor: 'pointer',
    },
    titleCommitHash: {
        fontFamily: 'Consolas, Menlo, "Courier New", Courier, monospace',
        color: '#fd6314',
        textDecoration: 'underline',
    },
    commitInfo: {
        display: 'flex',
        position: 'relative',
        marginBottom: 24,
    },
    startDiscussionSectionWrapper: {
        marginTop: 40,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    },
    startDiscussionFormWrapper: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
    },
    createDiscussionComment: {
        maxWidth: 720,
        flexGrow: 1,
    },
    userAvatar: {
        width: 30,
        height: 30,
        fontSize: '1rem',
        margin: '5px 7px',
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const commitHash = ownProps.uri.commit || ''
    const commit = state.repo.commits[commitHash]
    const userEmail = commit ? extractEmail(commit.user) : undefined
    const user = userEmail ? state.user.users[state.user.usersByEmail[userEmail] || ''] : undefined
    const fileDiffs = state.repo.diffsByCommitHash[ownProps.uri.commit || '']
    return {
        commit,
        user,
        fileDiffs,
    }
}

const mapDispatchToProps = {
    fetchRepoTimelineEvent,
    getDiff,
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CommitView))
