import React from 'react'
import TablePagination from '@material-ui/core/TablePagination'
import TimelineEvent from './TimelineEvent'

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
        const { page, rowsPerPage } = this.state
        const { timeline, repoRoot, getDiff, revertFiles } = this.props
        const timelinePage = (timeline || []).slice(page * rowsPerPage, (page + 1) * rowsPerPage)
        return (
            <div>
                <div>
                {
                    timelinePage.map((event) => {
                        return (
                            <div key={event.commit} onClick={() => this.selectCommit(event.commit)}>
                                <TimelineEvent
                                    repoRoot={repoRoot}
                                    event={event}
                                    getDiff={getDiff}
                                    revertFiles={revertFiles}
                                />
                            </div>
                        )
                    })
                }
                </div>

                {timeline.length > this.state.rowsPerPage &&
                    <TablePagination
                        component="div"
                        count={timeline.length}
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
    timeline: ITimelineEvent[]
    getDiff: (payload: IGetDiffAction['payload']) => IGetDiffAction
    revertFiles: (payload: IRevertFilesAction['payload']) => IRevertFilesAction
    selectCommit?: (payload: ISelectCommitAction['payload']) => ISelectCommitAction
}

interface State {
    page: number
    rowsPerPage: number
}

export default Timeline
