import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import DiffViewer from './DiffViewer/DiffViewer'
import CreateDiscussion from './Discussion/CreateDiscussion'
import { createDiscussion } from 'redux/discussion/discussionActions'
import { IGetDiffAction, ISelectCommitAction } from 'redux/repository/repoActions'
import { ITimelineEvent } from 'common'
import autobind from 'utils/autobind'

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
                <Typography>
                    Location: <span className={classes.breadcrumbRoot} onClick={this.onClickBack}>History</span> / <code className={classes.titleCommitHash}>{(commit.commit || '').substring(0, 8)}</code>
                </Typography>
                <Typography variant="headline">
                    {/*Revision <code className={classes.titleCommitHash}>{(commit.commit || '').substring(0, 8)}</code>*/}
                    {commit.message}
                </Typography>
                <div className={classes.commitInfo}>
                    <Typography>{commit.user || commit.email}</Typography>
                    <Typography>{moment(commit.time).calendar()}</Typography>
                </div>

                {Object.keys(diffs).map(filename => (
                    <DiffViewer
                        key={filename}
                        diff={diffs[filename]}
                        type="text"
                    />
                ))}

                <div>
                    <Typography variant="headline">Start a discussion about these changes</Typography>
                    <CreateDiscussion
                        repoID={this.props.repoID}
                        createDiscussion={this.props.createDiscussion}
                    />
                </div>
            </div>
        )
    }
}

interface Props {
    repoID: string
    repoRoot: string
    commit: ITimelineEvent | undefined
    getDiff: (payload: IGetDiffAction['payload']) => IGetDiffAction
    selectCommit: (payload: ISelectCommitAction['payload']) => ISelectCommitAction
    createDiscussion: typeof createDiscussion
    classes: any
}

const styles = () => createStyles({
    file: {
        padding: '30px 12px',
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
        marginBottom: 24,
    },
})

const mapDispatchToProps = {
    createDiscussion,
}

export default connect(
    null,
    mapDispatchToProps,
)(withStyles(styles)(CommitView))
