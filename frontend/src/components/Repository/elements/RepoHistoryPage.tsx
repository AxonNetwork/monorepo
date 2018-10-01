import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import Timeline from './Timeline/Timeline'
import CommitView from './CommitView'
import { IGlobalState } from 'redux/store'
import { selectCommit, getDiff, revertFiles } from 'redux/repository/repoActions'
import { ISelectCommitAction, IGetDiffAction, IRevertFilesAction } from 'redux/repository/repoActions'
import { ITimelineEvent } from 'common'
import autobind from 'utils/autobind'

@autobind
class RepoHistoryPage extends React.Component<Props>
{
    render() {
        const { repoRoot, selectCommit, getDiff, revertFiles, commits, commitList, selectedCommit, classes } = this.props
        return (
            <div className={classes.timelinePage}>
                {selectedCommit &&
                    <CommitView
                        commit={commits[ selectedCommit ]}
                        repoRoot={repoRoot}
                        getDiff={getDiff}
                        selectCommit={selectCommit}
                    />
                }
                {selectedCommit === undefined &&
                    <div className={classes.timeline}>
                        <Timeline
                            repoRoot={repoRoot}
                            commits={commits}
                            commitList={commitList}
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
    commits: {[commit: string]: ITimelineEvent}
    commitList: string[]
    selectedCommit: string | undefined
    getDiff: (payload: IGetDiffAction['payload']) => IGetDiffAction
    revertFiles: (payload: IRevertFilesAction['payload']) => IRevertFilesAction
    selectCommit: (payload: ISelectCommitAction['payload']) => ISelectCommitAction
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
        commits: repo.commits || {},
        commitList: repo.commitList || [],
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
