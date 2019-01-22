import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { RouteComponentProps } from 'react-router'
import { withRouter } from 'react-router-dom'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import LinkIcon from '@material-ui/icons/Link'
import DiffViewer from '../DiffViewer'
import UserAvatar from '../UserAvatar'
import SecuredText from '../SecuredText'
import { URI, IRepo, ITimelineEvent, IUser } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import { selectCommit } from 'conscience-components/navigation'
import { IGlobalState } from 'conscience-components/redux'
import { getRepo } from 'conscience-components/env-specific'


@autobind
class CommitView extends React.Component<Props>
{
    componentDidMount() {
        if (this.props.commit && this.props.commit.diffs === undefined) {
            this.props.getDiff({
                repoRoot: this.props.repo.path,
                repoID: this.props.repo.repoID,
                commit: this.props.commit.commit,
            })
        }
    }

    componentDidUpdate(_: Props) {
        if (this.props.commit && this.props.commit.diffs === undefined) {
            this.props.getDiff({
                repoRoot: this.props.repo.path,
                repoID: this.props.repo.repoID,
                commit: this.props.commit.commit,
            })
        }
    }

    onClickBack() {
        selectCommit(this.props.history, { ...this.props.uri, commit: undefined })
    }

    render() {
        const { repo, commit, classes } = this.props
        const diffs = commit.diffs || {}
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
                        <SecuredText
                            commits={repo.commits || {}}
                            commitList={repo.commitList || []}
                            commit={commit.commit}
                            classes={{ root: classes.securedText }}
                        />
                    </div>
                </div>

                {Object.keys(diffs).map(filename => (
                    <DiffViewer
                        key={filename}
                        uri={{ ...this.props.uri, filename }}
                        diff={diffs[filename]}
                    />
                ))}
            </div>
        )
    }
}

type Props = OwnProps & StateProps & RouteComponentProps<{}> & { classes: any }

interface OwnProps {
    uri: URI
}

interface StateProps {
    repo: IRepo
    user: IUser
    commit: ITimelineEvent
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

const mapStateToProps = (state: IGlobalState, props: OwnProps) => {
    const repo = getRepo(props.uri) || {}
    const commit = (repo.commits || {})[props.uri.commit || ''] || {}
    const user = state.user.users[commit.user || ''] || {}
    return {
        repo,
        commit,
        user,
    }
}

export default connect(mapStateToProps, null)(withStyles(styles)(withRouter(CommitView)))
