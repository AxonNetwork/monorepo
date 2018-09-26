import React from 'react'
import TablePagination from '@material-ui/core/TablePagination'
import TimelineEvent from './TimelineEvent'

import { ITimelineEvent } from '../../../../common'
import autobind from 'utils/autobind'

export interface TimelineProps {
    folderPath: string
    timeline: ITimelineEvent[]
    getDiff: Function
    revertFiles: Function
    selectEvent?: Function
}

export interface TimelineState {
    page: number
    rowsPerPage: number
}

@autobind
class Timeline extends React.Component<TimelineProps, TimelineState>
{
    state = {
        page: 0,
        rowsPerPage: 10,
    }

    selectEvent(version: number) {
        if (!!this.props.selectEvent) {
            this.props.selectEvent(version)
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
        const { timeline, folderPath, getDiff, revertFiles } = this.props
        const timelinePage = (timeline || []).slice(page * rowsPerPage, (page + 1) * rowsPerPage)
        return (
            <div>
                <div>
                {
                    timelinePage.map((event) => {
                        return (
                            <div key={event.commit} onClick={() => this.selectEvent(event.version)}>
                                <TimelineEvent
                                    folderPath={folderPath}
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

export default Timeline
