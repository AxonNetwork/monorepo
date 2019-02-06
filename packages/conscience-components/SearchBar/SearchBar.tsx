import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
// import Menu from '@material-ui/core/Menu'
// import MenuItem from '@material-ui/core/MenuItem'
// import Fade from '@material-ui/core/Fade'
import { selectSearch } from 'conscience-components/navigation'
import IconButton from '@material-ui/core/IconButton'
import { IGlobalState } from 'conscience-components/redux'


class SearchBar extends React.Component<Props, State>
{
    state = {
        inputValue: '',
        inputFocused: false,
    }

    // _menuAnchor: HTMLElement | null = null

    render() {
        const { classes } = this.props
        return (
            <div className={classes.root}>
                <Paper className={classnames(classes.searchBarPaper, {[classes.searchBarFocused]: this.state.inputFocused})} elevation={1}>
                    <InputBase
                        placeholder="Search"
                        value={this.state.inputValue}
                        onChange={this.onChangeInput}
                        inputProps={{
                            onFocus: this.onFocusInput,
                            onBlur: this.onBlurInput,
                            onKeyDown: this.onKeyDown,
                        }}
                        className={classes.input}
                    />
                    <IconButton
                        aria-label="Search"
                        onClick={this.onSubmit}
                        classes={{ root: classes.iconButton }}
                    >
                        <SearchIcon className={classes.searchIcon} />
                    </IconButton>
                </Paper>
                {/*<Menu
                    id="fade-menu"
                    anchorEl={this._menuAnchor}
                    open={this.state.inputValue.length > 0}
                    onClose={undefined}
                    TransitionComponent={Fade}
                >
                    <MenuItem onClick={this.handleClose}>Search in this repository</MenuItem>
                    <MenuItem onClick={this.handleClose}>Search in this organization</MenuItem>
                    <MenuItem onClick={this.handleClose}>Search the Conscience network</MenuItem>
                </Menu>*/}
            </div>
        )
    }

    onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ inputValue: event.target.value })
    }

    onFocusInput = () => {
        this.setState({ inputFocused: true })
    }

    onBlurInput = () => {
        this.setState({ inputFocused: false })
    }

    onKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === 'Enter') {
            evt.stopPropagation()
            this.onSubmit()
        }
    }

    onSubmit = () => {
        console.log('onSubmit')
        selectSearch(this.state.inputValue)
    }
}

interface Props {
    classes: any
}

interface State {
    inputValue: string
    inputFocused: boolean
}

const styles = (theme: Theme) => createStyles({
    root: {}, // For overriding
    searchBarPaper: {
        display: 'flex',
        height: 36,
        paddingLeft: 6,
        marginTop: 8,
        backgroundColor: '#525252',
        transition: theme.transitions.create(['color', 'background-color'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    searchBarFocused: {
        backgroundColor: '#fff',
        transition: theme.transitions.create(['color', 'background-color'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),

        '& input': {
            color: 'black',
        },
    },
    input: {
        color: '#909090',
        transition: theme.transitions.create('color', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),

        '& input::placeholder': {
            color: '#fff',
        },
    },
    iconButton: {
        padding: 4,
    },
    searchIcon: {
        color: '#909090',
    },
})

const mapStateToProps = (state: IGlobalState) => {
    // const user = state.user.users[state.user.currentUser || '']
    return {
        // user,
    }
}

const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(SearchBar))





