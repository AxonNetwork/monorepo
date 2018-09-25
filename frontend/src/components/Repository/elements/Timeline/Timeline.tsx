import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TablePagination from '@material-ui/core/TablePagination'
import TimelineEvent from './TimelineEvent'
import { PropTypes_TimelineEvent } from '../../../../lib/prop-types'

class Timeline extends Component
{
    state = {
        page: 0,
        rowsPerPage: 10,
    }

    constructor(props) {
        super(props)
        this.selectEvent = this.selectEvent.bind(this)
        this.onChangePage = this.onChangePage.bind(this)
        this.onChangeRowsPerPage = this.onChangeRowsPerPage.bind(this)
    }

    selectEvent(version) {
        if (!!this.props.selectEvent) {
            this.props.selectEvent(version)
        }
    }

    onChangePage(evt, page) {
        this.setState({ page })
    }

    onChangeRowsPerPage(evt) {
        this.setState({ rowsPerPage: evt.target.value })
    }

    render() {
        const { page, rowsPerPage } = this.state
        const timeline = (this.props.timeline || []).slice(page * rowsPerPage, (page + 1) * rowsPerPage)
        return (
            <div>
                <div>
                {
                    timeline.map((event, i) => {
                        console.log('commit ~>', event.commit)
                        return (
                            <div key={event.commit} onClick={() => this.selectEvent(event.version)}>
                                <TimelineEvent
                                    folderPath={this.props.folderPath}
                                    event={event}
                                    getDiff={this.props.getDiff}
                                    revertFiles={this.props.revertFiles}
                                />
                            </div>
                        )
                    })
                }
                </div>

                <TablePagination
                    component="div"
                    count={this.props.timeline.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{ 'aria-label': 'Previous Page' }}
                    nextIconButtonProps={{ 'aria-label': 'Next Page' }}
                    onChangePage={this.onChangePage}
                    onChangeRowsPerPage={this.onChangeRowsPerPage}
                />
            </div>
        )
    }
}

Timeline.propTypes = {
    folderPath: PropTypes.string.isRequired,
    timeline: PropTypes.arrayOf(PropTypes_TimelineEvent).isRequired,
    getDiff: PropTypes.func.isRequired,
    revertFiles: PropTypes.func.isRequired,
    selectEvent: PropTypes.func,
    classes: PropTypes.object.isRequired
}

const styles = theme => ({

})

export default withStyles(styles)(Timeline)
