import React from 'react'
import moment from 'moment'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import LinkIcon from '@material-ui/icons/Link'
import DiffViewer from '../DiffViewer'
import UserAvatar from '../UserAvatar'
import SecuredText from '../SecuredText'
import { IRepo, ITimelineEvent, IUser } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'

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
        this.props.selectCommit({ selectedCommit: undefined })
    }

    render() {
        const { repo, classes } = this.props
        const commit = this.props.commit || {} as ITimelineEvent
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
                    <div>
                        <SecuredText
                            commits={repo.commits || {}}
                            commitList={repo.commitList || []}
                            commit={commit.commit}
                            selectCommit={this.props.selectCommit}
                            classes={{ root: classes.securedText }}
                        />
                    </div>
                </div>

                {Object.keys(diffs).map(filename => (
                    <DiffViewer
                        key={filename}
                        diff={diffs[filename]}
                        type="text"
                        codeColorScheme={this.props.codeColorScheme}
                    />
                ))}
            </div>
        )
    }
}

interface Props {
    repo: IRepo
    user: IUser
    commit: ITimelineEvent | undefined
    codeColorScheme?: string | undefined
    getDiff: (payload: { repoID: string, repoRoot: string | undefined, commit: string}) => void
    selectCommit: (payload: {selectedCommit: string | undefined}) => void
    classes: any
}

const styles = (theme: Theme)=> createStyles({
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
