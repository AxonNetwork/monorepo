import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import autobind from 'conscience-lib/utils/autobind'


@autobind
class TimelinePagination extends React.Component<Props, State>
{
    state = {
        anchorEl: null
    }

    render() {
        const { page, rowsPerPage = 10, isEnd = false, disabled, classes } = this.props
        return (
            <div className={classes.root}>
                <Typography className={classes.text}>
                    Commits per page:
            	</Typography>
                <Button
                    onClick={this.openMenu}
                    disabled={disabled}
                    classes={{ root: classes.button, label: classes.buttonLabel }}
                >
                    {rowsPerPage}
                </Button>
                <IconButton
                    onClick={() => this.props.onChangePage(this.props.page - 1)}
                    disabled={disabled || page === 0}
                    classes={{ root: classes.iconButton }}
                >
                    <ChevronLeftIcon />
                </IconButton>
                <IconButton
                    onClick={() => this.props.onChangePage(this.props.page + 1)}
                    disabled={disabled || isEnd}
                    classes={{ root: classes.iconButton }}
                >
                    <ChevronRightIcon />
                </IconButton>
                <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={() => this.changeRowsPerPage(10)}>10</MenuItem>
                    <MenuItem onClick={() => this.changeRowsPerPage(25)}>25</MenuItem>
                    <MenuItem onClick={() => this.changeRowsPerPage(50)}>50</MenuItem>
                    <MenuItem onClick={() => this.changeRowsPerPage(100)}>100</MenuItem>
                </Menu>
            </div>
        )
    }

    openMenu(event: React.MouseEvent<HTMLElement>) {
        this.setState({ anchorEl: event.currentTarget })
    }

    changeRowsPerPage(val: number) {
        this.props.onChangeRowsPerPage(val)
        this.handleClose()
    }

    handleClose() {
        this.setState({ anchorEl: null })
    }
}

interface State {
    anchorEl: HTMLElement | null
}

interface Props {
    page: number
    rowsPerPage: number | undefined
    isEnd?: boolean
    disabled?: boolean
    onChangePage: (page: number) => void
    onChangeRowsPerPage: (rowsPerPage: number) => void
    classes: any
}

const styles = () => createStyles({
    root: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: '0.85rem',
    },
    button: {
        minWidth: 'auto',
    },
    buttonLabel: {
        width: 'auto',
        fontWeight: 'normal',
    },
    iconButton: {
        padding: 4
    }
})

export default withStyles(styles)(TimelinePagination)
