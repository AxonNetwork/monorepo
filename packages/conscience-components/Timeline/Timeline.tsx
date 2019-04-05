import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles } from '@material-ui/core/styles'
import TimelinePagination from './TimelinePagination'
import TimelineEvent from '../TimelineEvent'
import TimelineEventLoader from '../ContentLoaders/TimelineEventLoader'
import { fetchRepoTimeline } from '../redux/repo/repoActions'
import { IGlobalState } from '../redux'
import { ITimelineEvent, URI } from 'conscience-lib/common'
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

    async onChangePage(page: number) {
        await this.setState({ page })
        this.fetchEventsForCurrentPage()
    }

    async onChangeRowsPerPage(rowsPerPage: number) {
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
        let end = (page + 1) * rowsPerPage
        if (commitList[commitList.length - 1] == "") {
            end = Math.min(commitList.length - 1, end)
        }
        if (commitList.length < end) {
            const lastCommitFetched = commitList[commitList.length - 1]
            const pageSize = end - commitList.length
            this.props.fetchRepoTimeline({ uri, lastCommitFetched, pageSize })
        }
    }

    render() {
        const { commitList = [], hidePagination, classes } = this.props
        const { page, rowsPerPage } = this.state

        const start = page * rowsPerPage
        let end = (page + 1) * rowsPerPage
        let isEnd = false

        // if end of commitList
        if (commitList[commitList.length - 1] == "") {
            end = Math.min(commitList.length - 1, end)
            if (end === commitList.length - 1) {
                isEnd = true
            }
        }

        const loading = end > commitList.length
        const timelinePage = commitList.slice(start, end)

        return (
            <div>
                {!hidePagination &&
                    <div className={classes.pagination}>
                        <TimelinePagination
                            page={page}
                            rowsPerPage={rowsPerPage}
                            isEnd={isEnd}
                            disabled={loading}
                            onChangePage={this.onChangePage}
                            onChangeRowsPerPage={this.onChangeRowsPerPage}
                        />
                    </div>
                }
                {loading &&
                    <div className={classes.loaders}>
                        {Array(rowsPerPage).fill(0).map(i => (
                            <TimelineEventLoader />
                        ))}
                    </div>
                }
                {!loading &&
                    <div>
                        {timelinePage.map(commitHash => (
                            <TimelineEvent key={commitHash} uri={{ ...this.props.uri, commit: commitHash }} />
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
    commits: { [commitHash: string]: ITimelineEvent }
}

interface Dispatchprops {
    fetchRepoTimeline: typeof fetchRepoTimeline
}

interface State {
    page: number
    rowsPerPage: number
}

const styles = () => createStyles({
    loaders: {
        display: 'flex',
        flexDirection: 'column',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const uriStr = uriToString(ownProps.uri)
    return {
        commitList: state.repo.commitListsByURI[uriStr],
        commits: state.repo.commits,
    }
}

const mapDispatchToProps = {
    fetchRepoTimeline
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Timeline))

