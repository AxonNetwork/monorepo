import React from 'react'
import TablePagination from '@material-ui/core/TablePagination'
import TimelineEvent from './TimelineEvent'

import { ITimelineEvent } from '../../../../common'
import autobind from 'utils/autobind'


@autobind
class Timeline extends React.Component<Props, State>
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
        const { timeline, repoRoot, getDiff, revertFiles } = this.props
        const timelinePage = (timeline || []).slice(page * rowsPerPage, (page + 1) * rowsPerPage)
        return (
            <div>
                <div>
                {
                    timelinePage.map((event) => {
                        return (
                            <div key={event.commit} onClick={() => this.selectEvent(event.version)}>
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
    getDiff: Function
    revertFiles: Function
    selectEvent?: Function
}

interface State {
    page: number
    rowsPerPage: number
}

export default Timeline
