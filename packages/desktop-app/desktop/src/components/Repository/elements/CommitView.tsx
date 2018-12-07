import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import LinkIcon from '@material-ui/icons/Link'
import DiffViewer from './DiffViewer/DiffViewer'
import CreateDiscussion from './Discussion/CreateDiscussion'
import UserAvatar from 'components/UserAvatar'
import { IGlobalState } from 'redux/store'
import { createDiscussion } from 'redux/discussion/discussionActions'
import { IGetDiffAction, ISelectCommitAction } from 'redux/repository/repoActions'
import { ITimelineEvent, IUser } from 'common'
import { removeEmail, extractEmail } from 'utils'
import autobind from 'utils/autobind'
import SecuredText from './FileInfo/SecuredText';

@autobind
class CommitView extends React.Component<Props>
{
    componentDidMount() {
        if (this.props.commit && this.props.commit.diffs === undefined) {
            this.props.getDiff({ repoRoot: this.props.repoRoot, commit: this.props.commit.commit })
        }
    }

    componentDidUpdate(_: Props) {
        if (this.props.commit && this.props.commit.diffs === undefined) {
            this.props.getDiff({ repoRoot: this.props.repoRoot, commit: this.props.commit.commit })
        }
    }

    onClickBack() {
        this.props.selectCommit({ selectedCommit: undefined })
    }

    render() {
        const { classes } = this.props
        const commit = this.props.commit || {} as ITimelineEvent
        const diffs = commit.diffs || {}
        return (
            <div>
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
                                    <LinkIcon classes={{root: classes.linkIcon}}/>
                                </div>
                            }
                            <UserAvatar className={classes.userAvatar} username={this.props.username} userPicture={this.props.userPicture} />
                            <div>
                                <Typography>{commit.user}</Typography>
                                <Typography>{moment(commit.time).calendar()}</Typography>
                            </div>
                        </div>
                    </div>
                    <div>
                        <SecuredText
                            commit={commit.commit}
                            classes={{ root: classes.securedText }}
                        />
                    </div>
                </div>

                {Object.keys(diffs).map(filename => (
                    <DiffViewer
                        key={filename}
                        diff={diffs[filename]}
                        type="text"
                    />
                ))}

                <div className={classes.startDiscussionSectionWrapper}>
                    <Typography variant="headline">Start a discussion about these changes</Typography>
                    <div className={classes.startDiscussionFormWrapper}>
                        <CreateDiscussion
                            repoRoot={this.props.repoRoot}
                            attachedTo={`Commit: ${commit.commit.substr(0, 8)}`}
                            commentWrapperClasses={{ comment: classes.createDiscussionComment }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    repoID: string
    repoRoot: string
    commit: ITimelineEvent | undefined
    getDiff: (payload: IGetDiffAction['payload']) => IGetDiffAction
    selectCommit: (payload: ISelectCommitAction['payload']) => ISelectCommitAction
}

interface StateProps {
    username: string
    userPicture: string | undefined
}

interface DispatchProps {
    createDiscussion: typeof createDiscussion
}

const styles = (theme: Theme)=> createStyles({
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
    linkIconContainer:{
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
    const commit = (ownProps || {}).commit
    const commitUser = (commit || {} as any).user || ''
    const userEmail = extractEmail(commitUser) || ''
    const userID = state.user.usersByEmail[ userEmail ]
    const user = state.user.users[ userID || '' ] || {} as IUser
    const username = user.name || removeEmail(commitUser)
    const userPicture = user.picture
    return {
        username,
        userPicture,
    }
}

const mapDispatchToProps = {
    createDiscussion,
}

export default connect< StateProps, DispatchProps, OwnProps, IGlobalState >(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(CommitView))
