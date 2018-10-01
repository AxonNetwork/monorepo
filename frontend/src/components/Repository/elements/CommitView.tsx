import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import DiffViewer from './DiffViewer/DiffViewer'
import { IGetDiffAction } from 'redux/repository/repoActions'
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

    render() {
        const { classes } = this.props
        const commit = this.props.commit || {} as ITimelineEvent
        const diffs = commit.diffs || {}
        return (
            <div>
                <Typography>
                    Location: <span className={classes.temp}>History</span> / <code className={classes.titleCommitHash}>{(commit.commit || '').substring(0, 8)}</code>
                </Typography>

                <Typography variant="headline">
                    {/*Revision <code className={classes.titleCommitHash}>{(commit.commit || '').substring(0, 8)}</code>*/}
                    {commit.message}
                </Typography>

                {Object.keys(diffs).map(filename => (
                    <div className={classes.file}>
                        <Typography>{filename}</Typography>
                        <DiffViewer
                            key={filename}
                            diff={diffs[filename]}
                            type="text"
                        />
                    </div>
                ))}
            </div>
        )
    }
}

interface Props {
    commit: ITimelineEvent | undefined
    repoRoot: string
    getDiff: (payload: IGetDiffAction['payload']) => IGetDiffAction
    classes: any
}

const styles = () => createStyles({
    file: {
        padding: '30px 12px',
    },
    temp: {
        color: '#fd6314', //theme.palette.secondary.main,
        textDecoration: 'underline',
    },
    titleCommitHash: {
        fontFamily: 'Consolas, Menlo, "Courier New", Courier, monospace',
        color: '#fd6314',
        textDecoration: 'underline',
    },
})

export default withStyles(styles)(CommitView)
