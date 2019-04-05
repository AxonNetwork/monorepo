import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TablePagination from '@material-ui/core/TablePagination'
import { parseCSV, autobind } from 'conscience-lib/utils'


@autobind
class DataViewer extends React.Component<Props, State>
{
    state = {
        page: 0,
        rowsPerPage: 10,
    }

    onChangePage(_: any, page: number) {
        this.setState({ page })
    }

    onChangeRowsPerPage(evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        const rowsPerPage = parseInt(evt.target.value)
        this.setState({ rowsPerPage })
    }

    render() {
        const { fileFormat, fileContents, classes } = this.props
        const { page, rowsPerPage } = this.state

        let data = []
        switch (fileFormat) {
            case 'csv':
                data = parseCSV(fileContents)
                break
            default:
                return <div></div>
        }

        const headerRow = data.length > 0 ? data[0] : null
        const dataPage = data.length > 1 ? data.slice((page * rowsPerPage) + 1, (page + 1) * rowsPerPage) : null

        return (
            <div>
                <TablePagination
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{ classes: { root: classes.paginationButton }, 'aria-label': 'Previous Page' }}
                    nextIconButtonProps={{ classes: { root: classes.paginationButton }, 'aria-label': 'Next Page' }}
                    onChangePage={this.onChangePage}
                    onChangeRowsPerPage={this.onChangeRowsPerPage}
                    classes={{ toolbar: classes.paginationToolbar, caption: classes.paginationText }}
                />
                <Table>
                    {headerRow &&
                        <TableHead>
                            <TableRow>
                                {headerRow.map(cell => (
                                    <TableCell>{cell}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                    }
                    {dataPage &&
                        <TableBody>
                            {dataPage.map(row => (
                                <TableRow>
                                    {row.map(cell => (
                                        <TableCell>{cell}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    }
                </Table>
            </div>
        )
    }
}

interface Props {
    fileFormat: string
    fileContents: string
    classes: any
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

export default withStyles(styles)(DataViewer)

