import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TablePagination from '@material-ui/core/TablePagination'
import { parseCSV } from 'utils/csv'
import autobind from 'utils/autobind'


@autobind
class DataViewer extends React.Component<Props, State>
{
    state = {
        page: 0,
        rowsPerPage: 10,
    }

    onChangePage(_: any, page: number){
       this.setState({ page })
    }

    onChangeRowsPerPage(evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        const rowsPerPage = parseInt(evt.target.value)
        this.setState({ rowsPerPage })
    }

    render() {
        const { fileType, contents, classes } = this.props
        const { page, rowsPerPage } = this.state
        let data = []
        switch(fileType){
            case "csv":
                data = parseCSV(contents)
                break
            default:
                return <div></div>
        }
        const dataPage = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
        return (
            <div>
                <Table>
                    <TableBody>
                    {
                    dataPage.map(row => {
                        return(
                            <TableRow>
                            {
                            row.map(cell => (
                                <TableCell>{cell}</TableCell>
                            ))
                            }
                            </TableRow>
                        )
                    })
                    }
                    </TableBody>
                </Table>
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
            </div>
        )
    }
}

interface Props {
    fileType: string
    contents: string
    classes: any
}

interface State {
    page: number
    rowsPerPage: number
}

const styles = () => createStyles({})

export default withStyles(styles)(DataViewer)

