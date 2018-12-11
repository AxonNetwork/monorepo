import React from 'react'
import moment from 'moment'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import LinkIcon from '@material-ui/icons/Link'
import DiffViewer from '../DiffViewer'
import UserAvatar from '../UserAvatar'
// import CreateDiscussion from '../CreateDiscussion'
// import SecuredText from './FileInfo/SecuredText'
import { ITimelineEvent, IUser } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'

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
                            <UserAvatar className={classes.userAvatar} username={this.props.user.name} userPicture={this.props.user.picture} />
                            <div>
                                <Typography>{commit.user}</Typography>
                                <Typography>{moment(commit.time).calendar()}</Typography>
                            </div>
                        </div>
                    </div>
{/*                    <div>
                        <SecuredText
                            commit={commit.commit}
                            classes={{ root: classes.securedText }}
                        />
                    </div>*/}
                </div>

                {Object.keys(diffs).map(filename => (
                    <DiffViewer
                        key={filename}
                        diff={diffs[filename]}
                        type="text"
                        codeColorScheme={this.props.codeColorScheme}
                    />
                ))}
{/*
                <div className={classes.startDiscussionSectionWrapper}>
                    <Typography variant="headline">Start a discussion about these changes</Typography>
                    <div className={classes.startDiscussionFormWrapper}>
                        <CreateDiscussion
                            repoRoot={this.props.repoRoot}
                            attachedTo={`Commit: ${commit.commit.substr(0, 8)}`}
                            commentWrapperClasses={{ comment: classes.createDiscussionComment }}
                        />
                    </div>
                </div>*/}
            </div>
        )
    }
}

interface Props {
    repoID: string
    repoRoot: string
    user: IUser
    commit: ITimelineEvent | undefined
    codeColorScheme?: string | undefined
    getDiff: (payload: {repoRoot: string, commit: string}) => void
    selectCommit: (payload: {selectedCommit: string | undefined}) => void
    classes: any
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

export default withStyles(styles)(CommitView)

// const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
//     const commit = (ownProps || {}).commit
//     const commitUser = (commit || {} as any).user || ''
//     const userEmail = extractEmail(commitUser) || ''
//     const userID = state.user.usersByEmail[ userEmail ]
//     const user = state.user.users[ userID || '' ] || {} as IUser
//     const username = user.name || removeEmail(commitUser)
//     const userPicture = user.picture
//     return {
//         username,
//         userPicture,
//     }
// }

// const mapDispatchToProps = {
//     createDiscussion,
// }

// export default connect< StateProps, DispatchProps, OwnProps, IGlobalState >(
//     mapStateToProps,
//     mapDispatchToProps,
// )(withStyles(styles)(CommitView))
