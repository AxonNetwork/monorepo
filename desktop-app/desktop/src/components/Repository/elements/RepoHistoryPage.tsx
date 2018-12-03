import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import BackupIcon from '@material-ui/icons/Backup'
import Typography from '@material-ui/core/Typography'
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
                    <Typography>Loading...</Typography>
                </div>
            )
        }

        if (!repo.commitList || repo.commitList.length === 0) {
            return (
                <div className={classes.timelinePage}>
                    <Typography className={classes.noHistoryMessage}>
                        This is the history view.  Right now, it's empty because nobody has committed any files to the repository.<br/><br/>Add some files and then commit them using the <BackupIcon /> button above.
                    </Typography>
                </div>
            )
        }

        const { selectCommit, getDiff, selectedCommit } = this.props
        return (
            <div className={classes.timelinePage}>
                {selectedCommit &&
                    <CommitView
                        repoID={repo.repoID}
                        repoRoot={repo.path}
                        commit={(repo.commits || {})[ selectedCommit ]}
                        getDiff={getDiff}
                        selectCommit={selectCommit}
                    />
                }
                {selectedCommit === undefined &&
                    <Timeline
                        repoID={repo.repoID}
                        page={this.props.timelinePage}
                        repoRoot={repo.path}
                        commits={repo.commits}
                        commitList={repo.commitList}
                        selectCommit={selectCommit}
                    />
                }
            </div>
        )
    }
}

interface Props {
    repo: IRepo | undefined
    timelinePage: number
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
    noHistoryMessage: {
        fontSize: '1.1rem',
        color: '#9c9c9c',
        maxWidth: 640,
        margin: '0 auto',
        background: '#f1f1f1',
        padding: 20,
        borderRadius: 10,
        border: '3px solid #9c9c9c',
        marginTop: 30,
        textAlign: 'center',
        lineHeight: '2rem',

        '& svg': {
            verticalAlign: 'text-bottom',
            margin: '0 5px',
        },
    },
})

const mapStateToProps = (state: IGlobalState) => {
    const selectedRepo = state.repository.selectedRepo || ''
    const repo = state.repository.repos[selectedRepo]
    const selectedCommit = state.repository.selectedCommit
    return {
        repo,
        selectedCommit,
        timelinePage: state.repository.timelinePage[ (repo || {}).repoID || '' ] || 0,
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
