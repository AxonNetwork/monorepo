import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles } from '@material-ui/core/styles'
import TablePagination from '@material-ui/core/TablePagination'
import LargeProgressSpinner from '../LargeProgressSpinner'
import TimelineEvent from '../TimelineEvent'
import TimelineEventLoader from '../ContentLoaders/TimelineEventLoader'
import { IGlobalState } from 'conscience-components/redux'
import { URI } from 'conscience-lib/common'
import { autobind, uriToString } from 'conscience-lib/utils'


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

        if (!this.props.commitList) {
            return (
                <div>
                    {Array(rowsPerPage).fill(0).map(i => (
                        <TimelineEventLoader />
                    ))}
                </div>
            )
        }

        const commitList = this.props.commitList || []

        const timelinePage = commitList.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
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
                    {timelinePage.map(commitHash => (
                        <TimelineEvent key={commitHash} uri={{ ...this.props.uri, commit: commitHash }} />
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
    const uriStr = uriToString(ownProps.uri)
    return {
        commitList: state.repo.commitListsByURI[uriStr],
    }
}

export default connect(mapStateToProps, null)(withStyles(styles)(Timeline))

