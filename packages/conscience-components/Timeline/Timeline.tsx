import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles } from '@material-ui/core/styles'
import TablePagination from '@material-ui/core/TablePagination'
import TimelineEvent from '../TimelineEvent'
import TimelineEventLoader from '../ContentLoaders/TimelineEventLoader'
import { fetchRepoTimeline } from 'conscience-components/redux/repo/repoActions'
import { IGlobalState } from 'conscience-components/redux'
import { URI } from 'conscience-lib/common'
import { autobind, uriToString } from 'conscience-lib/utils'
import isEqual from 'lodash/isEqual'


@autobind
class Timeline extends React.Component<Props, State>
{
    constructor(props: Props) {
        super(props)
        const page = props.page || 0
        const rowsPerPage = props.defaultRowsPerPage || 10
        this.state = { page, rowsPerPage }
    }

    async onChangePage(_: any, page: number) {
        await this.setState({ page })
        this.fetchEventsForCurrentPage()
    }

    async onChangeRowsPerPage(evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        const rowsPerPage = parseInt(evt.target.value, 10)
        await this.setState({ rowsPerPage: rowsPerPage })
        this.fetchEventsForCurrentPage()
    }

    componentDidMount() {
        this.fetchEventsForCurrentPage()
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if (!isEqual(prevProps.uri, this.props.uri)) {
            this.fetchEventsForCurrentPage()
        }
    }

    fetchEventsForCurrentPage() {
        const { page, rowsPerPage } = this.state
        const { uri, commitList = [] } = this.props
        const end = (page + 1) * rowsPerPage
        if (commitList.length < end) {
            const lastCommitFetched = commitList[commitList.length - 1]
            const pageSize = end - commitList.length
            this.props.fetchRepoTimeline({ uri, lastCommitFetched, pageSize })
        }
    }

    render() {
        const { commitList = [], timelineLength, hidePagination, classes } = this.props
        const { page, rowsPerPage } = this.state

        const start = page * rowsPerPage
        const end = Math.min((page + 1) * rowsPerPage, timelineLength)
        const loaderCount = end - commitList.length

        const timelinePage = commitList.slice(start, end)

        return (
            <div>
                {!hidePagination && timelineLength > this.state.rowsPerPage &&
                    <TablePagination
                        component="div"
                        count={timelineLength}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{ classes: { root: classes.paginationButton }, 'aria-label': 'Previous Page' }}
                        nextIconButtonProps={{ classes: { root: classes.paginationButton }, 'aria-label': 'Next Page' }}
                        onChangePage={this.onChangePage}
                        onChangeRowsPerPage={this.onChangeRowsPerPage}
                        classes={{ toolbar: classes.paginationToolbar, caption: classes.paginationText }}
                    />
                }

                <div>
                    {timelinePage.map(commitHash => (
                        <TimelineEvent key={commitHash} uri={{ ...this.props.uri, commit: commitHash }} />
                    ))}
                </div>
                {loaderCount > 0 &&
                    <div className={classes.loaders}>
                        {Array(loaderCount).fill(0).map(i => (
                            <TimelineEventLoader />
                        ))}
                    </div>
                }
            </div>
        )
    }
}

type Props = OwnProps & StateProps & Dispatchprops & { classes: any }

interface OwnProps {
    uri: URI
    page?: number
    defaultRowsPerPage?: number
    hidePagination?: boolean
}

interface StateProps {
    commitList: string[] | undefined
    timelineLength: number
}

interface Dispatchprops {
    fetchRepoTimeline: typeof fetchRepoTimeline
}

interface State {
    page: number
    rowsPerPage: number
}

const styles = () => createStyles({
    paginationToolbar: {
        height: 36,
        minHeight: 36,
    },
    paginationButton: {
        padding: 6,
    },
    paginationText: {
        fontSize: '0.85rem',
    },
    loaders: {
        display: 'flex',
        flexDirection: 'column',
    }
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const uriStr = uriToString(ownProps.uri)
    return {
        commitList: state.repo.commitListsByURI[uriStr],
        timelineLength: (state.repo.metadataByURI[uriStr] || { timelineLength: 0 }).timelineLength,
    }
}

const mapDispatchToProps = {
    fetchRepoTimeline
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Timeline))

