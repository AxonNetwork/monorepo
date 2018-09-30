import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import Timeline from './Timeline/Timeline'
import { IGlobalState } from 'redux/store'
import { selectCommit, getDiff, revertFiles } from 'redux/repository/repoActions'
import { ISelectCommitAction, IGetDiffAction, IRevertFilesAction } from 'redux/repository/repoActions'
import { ITimelineEvent } from 'common'
import autobind from 'utils/autobind'

@autobind
class RepoHistoryPage extends React.Component<Props>
{
    render() {
        const { repoRoot, timeline, selectCommit, getDiff, revertFiles, classes } = this.props
        return (
            <div className={classes.timelinePage}>
                {this.props.selectedCommit &&
                    <div>you selected commit {this.props.selectedCommit}, nice work</div>
                }
                {this.props.selectedCommit === undefined &&
                    <div className={classes.timeline}>
                        <Timeline
                            repoRoot={repoRoot}
                            timeline={timeline}
                            getDiff={getDiff}
                            revertFiles={revertFiles}
                            selectCommit={selectCommit}
                        />
                    </div>
                }
            </div>
        )
    }
}

interface Props {
    repoRoot: string
    timeline: ITimelineEvent[]
    selectedCommit: string|undefined
    getDiff: (payload: IGetDiffAction['payload']) => IGetDiffAction
    revertFiles: (payload: IRevertFilesAction['payload']) => IRevertFilesAction
    selectCommit?: (payload: ISelectCommitAction['payload']) => ISelectCommitAction
    classes: any
}

const styles = (theme: Theme) => createStyles({
    timelinePage: {
        overflowY: 'auto',
    },
    timeline: {
        flexGrow: 1,
        marginRight: 32,
    },
    thread: {
        marginTop: theme.spacing.unit * 4,
        flexGrow: 1,
        marginLeft: 32,
        border: '1px solid',
        borderColor: theme.palette.grey[300],
        maxHeight: '90%',
    },

})

const mapStateToProps = (state: IGlobalState) => {
    const selectedRepo = state.repository.selectedRepo || ''
    const repo = state.repository.repos[selectedRepo] || {}
    const selectedCommit = state.repository.selectedCommit
    return {
        repoRoot: repo.path,
        timeline: repo.timeline || [],
        selectedCommit,
    }
}

const mapDispatchToProps = {
    getDiff,
    revertFiles,
    selectCommit,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(RepoHistoryPage))
