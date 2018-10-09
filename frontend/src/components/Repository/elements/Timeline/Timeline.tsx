import React from 'react'
import TablePagination from '@material-ui/core/TablePagination'
import TimelineEvent from './TimelineEvent'
import { withStyles, createStyles } from '@material-ui/core/styles'

import { ITimelineEvent } from '../../../../common'
import autobind from 'utils/autobind'
import { ISelectCommitAction, IGetDiffAction, IRevertFilesAction } from 'redux/repository/repoActions'


@autobind
class Timeline extends React.Component<Props, State>
{
    state = {
        page: 0,
        rowsPerPage: 10,
    }

    selectCommit(commit: string) {
        if (!!this.props.selectCommit) {
            this.props.selectCommit({ selectedCommit: commit })
        }
    }

    onChangePage(_: any, page: number) {
        this.setState({ page })
    }

    onChangeRowsPerPage(evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        const rowsPerPage = parseInt(evt.target.value)
        this.setState({ rowsPerPage: rowsPerPage })
    }

    render() {
        const { classes } = this.props
        const { page, rowsPerPage } = this.state
        const commitList = this.props.commitList || []
        const commits = this.props.commits || {}

        const timelinePage = commitList.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map(c => commits[c])
        return (
            <div>
                <div>
                {
                    timelinePage.map((event) => {
                        return (
                            <div key={event.commit} onClick={() => this.selectCommit(event.commit)} className={classes.timelineEvent}>
                                <TimelineEvent
                                    repoRoot={this.props.repoRoot}
                                    event={event}
                                    getDiff={this.props.getDiff}
                                    revertFiles={this.props.revertFiles}
                                />
                            </div>
                        )
                    })
                }
                </div>

                {commitList.length > this.state.rowsPerPage &&
                    <TablePagination
                        component="div"
                        count={commitList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{ 'aria-label': 'Previous Page' }}
                        nextIconButtonProps={{ 'aria-label': 'Next Page' }}
                        onChangePage={this.onChangePage}
                        onChangeRowsPerPage={this.onChangeRowsPerPage}
                    />
                }
            </div>
        )
    }
}

interface Props {
    repoRoot: string
    // timeline: ITimelineEvent[]
    commits: {[commit: string]: ITimelineEvent} | undefined
    commitList: string[] | undefined
    getDiff: (payload: IGetDiffAction['payload']) => IGetDiffAction
    revertFiles: (payload: IRevertFilesAction['payload']) => IRevertFilesAction
    selectCommit?: (payload: ISelectCommitAction['payload']) => ISelectCommitAction
    classes: any
}

interface State {
    page: number
    rowsPerPage: number
}

const styles = () => createStyles({
    timelineEvent: {
        cursor: 'pointer',

        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
        },
    },
})


export default withStyles(styles)(Timeline)
