import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import TablePagination from '@material-ui/core/TablePagination'
import TimelineEvent from '../TimelineEvent'
import { ITimelineEvent, URI } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import { IGlobalState } from 'conscience-components/redux'
import { getRepo } from 'conscience-components/env-specific'


@autobind
class Timeline extends React.Component<Props, State>
{
    constructor(props: Props) {
        super(props)
        const page = props.page || 0
        const rowsPerPage = props.defaultRowsPerPage || 10
        this.state = { page, rowsPerPage }
    }

    onChangePage(_: any, page: number) {
        this.setState({ page })
    }

    onChangeRowsPerPage(evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        const rowsPerPage = parseInt(evt.target.value, 10)
        this.setState({ rowsPerPage: rowsPerPage })
    }

    render() {
        const { hidePagination, classes } = this.props
        const { page, rowsPerPage } = this.state

        if (!this.props.commits || !this.props.commitList) {
            return (
                <div className={classes.progressContainer}>
                    <CircularProgress color="secondary" />
                </div>
            )
        }

        const commitList = this.props.commitList || []
        const commits = this.props.commits || {}

        const timelinePage = commitList.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map(c => commits[c])
        return (
            <div>
                {!hidePagination && commitList.length > this.state.rowsPerPage &&
                    <TablePagination
                        component="div"
                        count={commitList.length}
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
                    {timelinePage.map(event => (
                        <TimelineEvent key={event.commit} uri={{ ...this.props.uri, commit: event.commit }} />
                    ))}
                </div>
            </div>
        )
    }
}

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    uri: URI
    page?: number
    defaultRowsPerPage?: number
    hidePagination?: boolean
}

interface StateProps {
    commits: { [commit: string]: ITimelineEvent } | undefined
    commitList: string[] | undefined
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
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const repo = getRepo(ownProps.uri, state)
    const { commits, commitList } = repo
    return {
        commits,
        commitList,
    }
}

export default connect(mapStateToProps, null)(withStyles(styles)(Timeline))

