import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import TablePagination from '@material-ui/core/TablePagination'
import TimelineEvent from './TimelineEvent'
import { IUser, ITimelineEvent } from 'conscience-lib/common'
import { autobind, removeEmail, extractEmail } from 'conscience-lib/utils'


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
                {commitList.length > this.state.rowsPerPage &&
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
                {timelinePage.map((event) => {
                    const email = extractEmail(event.user) || ''
                    const user = this.props.users[ this.props.usersByEmail[email] || '' ] || {}
                    const username = user.name || removeEmail(event.user)
                    const userPicture = user.picture
                    return (
                        <div key={event.commit} onClick={() => this.selectCommit(event.commit)} className={classes.timelineEvent}>
                            <TimelineEvent
                                event={event}
                                username={username}
                                userPicture={userPicture}
                            />
                        </div>
                    )
                })}
                </div>
            </div>
        )
    }
}

interface Props {
    repoID: string
    page: number
    // timeline: ITimelineEvent[]
    commits: {[commit: string]: ITimelineEvent} | undefined
    commitList: string[] | undefined
    users: {[userID: string]: IUser}
    usersByEmail: {[email: string]: string}
    selectCommit?: (payload: {selectedCommit: string}) => void
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

export default withStyles(styles)(Timeline)

