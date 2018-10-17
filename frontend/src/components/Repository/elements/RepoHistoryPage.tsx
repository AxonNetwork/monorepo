import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import Timeline from './Timeline/Timeline'
import CommitView from './CommitView'
import { IRepo } from 'common'
import { IGlobalState } from 'redux/store'
import { selectCommit, getDiff, revertFiles } from 'redux/repository/repoActions'
import autobind from 'utils/autobind'

@autobind
class RepoHistoryPage extends React.Component<Props>
{
    render() {
        const { classes, repo } = this.props
        if (repo === undefined) {
            return (
                <div className={classes.timelinePage}>
                    Loading...
                </div>
            )
        }

        const { selectCommit, getDiff, revertFiles, selectedCommit } = this.props
        return (
            <div className={classes.timelinePage}>
                {selectedCommit &&
                    <CommitView
                        repoID={repo.repoID}
                        repoRoot={repo.path}
                        commit={(repo.commits||{})[ selectedCommit ]}
                        getDiff={getDiff}
                        selectCommit={selectCommit}
                    />
                }
                {selectedCommit === undefined &&
                    <Timeline
                        repoRoot={repo.path}
                        commits={repo.commits}
                        commitList={repo.commitList}
                        getDiff={getDiff}
                        revertFiles={revertFiles}
                        selectCommit={selectCommit}
                    />
                }
            </div>
        )
    }
}

interface Props {
    repo: IRepo | undefined
    selectedCommit: string | undefined
    getDiff: typeof getDiff
    revertFiles: typeof revertFiles
    selectCommit: typeof selectCommit
    classes: any
}

const styles = (theme: Theme) => createStyles({
    timelinePage: {
        overflowY: 'auto',
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
    const repo = state.repository.repos[selectedRepo]
    const selectedCommit = state.repository.selectedCommit
    return {
        repo,
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
    mapDispatchToProps,
)(withStyles(styles)(RepoHistoryPage))
